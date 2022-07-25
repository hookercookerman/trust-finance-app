// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IConstantFlowAgreementV1} from "@superfluid/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {ISuperTokenFactory} from "@superfluid/interfaces/superfluid/ISuperTokenFactory.sol";
import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "@superfluid/interfaces/superfluid/ISuperfluid.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPoolAddressesProvider} from "interfaces/IPoolAddressesProvider.sol";
import {IPool} from "interfaces/IPool.sol";
import {ITrustIDA} from "interfaces/ITrustIDA.sol";
import {IPersonal} from "interfaces/IPersonal.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Emploee__not_in__List();

contract TrustCFA is Ownable {
    IConstantFlowAgreementV1 private _cfa;
    ISuperfluid private _host;
    ISuperToken private _acceptedToken;
    ITrustIDA idaContract;

    //assets to invest
    mapping(string => address) public s_assetAddress;

    struct Company {
        address _address;
        bool status;
        bool payingInstram;
        bool payingMilestone;
        bool payingPeriodically;
        bool payingOneTime; //If they have added a onetime Payment ie employee
        uint256 totalPaying; //Total amount they are paying
        uint256 totalperiodicPaid; //Total paid in periodic payments
        uint256 streamStart; //@dev: tracks the time when the stream begins for accountability
    }

    // company to a onetime payment Id to an recipient address to amount
    mapping(address => mapping(uint256 => mapping(address => uint256)))
        public companyOneTimePayIdAddressAmount;

    mapping(address => address[]) public s_companyEmployees;

    mapping(address => Company) public s_companyInfo;

    //event MakePayment

    event MakePayment(address indexed _sender, uint256 indexed _amount);

    enum INVOICETYPE {
        ONETIMEPAYMENT,
        MILESTONE
    }

    struct EmployeeInfo {
        address employer;
        address employee;
        bool isActive;
        uint256 monthlyIncome;
        uint256 startTime;
        uint256 paymentInterval;
        uint256 endTime;
        uint256 totalpaid;
        bool isStreamed;
        bool isPeriodic;
        bool isOneTime;
    }

    struct Invoice {
        INVOICETYPE invoiceType;
        bool isAccepted;
        address payer;
        address receiver;
        uint256 amount;
        address token;
        uint256 deadline;
        uint256 indexInUserList;
        uint256[] milestoneTimes;
        uint256[] milestonePay;
        bool[] isMilestonePayed;
        bool isPayed;
    }

    //Tracks all invoices
    uint256 public invoices;

    mapping(address => uint256[]) private companyInvoiceIds;

    //a company to all invoices
    mapping(uint256 => Invoice) private idInvoices;

    struct Updateables {
        bool isUpdatable;
        address[] _addresses;
        int96[] _updates;
    }

    //addresses of the employer's employees to update streams.
    mapping(address => Updateables) private _updatableEmployees;

    mapping(address => address[]) private employeeEmployers; //people paying an address

    //addresses of people paid periodically
    address[] private periodicEmployees;
    //addresses of users paid in streams
    address[] private streamEmployees;

    //the total amount paid to one time users.
    mapping(address => uint256) public oneTimeUserTotalPay;

    uint256 public payments; //number of payments added
    //payment ID to employee information
    mapping(uint256 => EmployeeInfo) private s_employeeinfo;

    address private investmentKeeper;
    IPersonal public userContract;

    modifier onlyAdmin() {
        require(msg.sender == owner());
        _;
    }

    modifier onlyInvestmentKeeper() {
        require(msg.sender == investmentKeeper);
        _;
    }

    modifier onlyUserContract() {
        require(msg.sender == userContract);
        _;
    }

    event InvoicePayed(
        uint256 indexed id,
        address indexed sender,
        address indexed receiver
    );

    constructor(address host, address cfa) {
        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);
    }

    function addUserContract(address _address) external onlyOwner {
        userContract = IPersonal(_address);
    }

    /**
     * @notice add a compny to the platform
     * @dev only callable by the contract admin
     * @param _payType: the type of payment the company gives ie. Installments or stream
     */
    function _createCompany(uint8 _payType) external {
        if (_payType == 0) {
            s_companyInfo[msg.sender] = Company({
                _address: msg.sender,
                status: true,
                payingInstram: true,
                payingMilestone: false,
                payingPeriodically: false,
                payingOneTime: false,
                totalPaying: 0,
                totalperiodicPaid: 0,
                streamStart: 0
            });
        }
        if (_payType == 1) {
            s_companyInfo[msg.sender] = Company({
                _address: msg.sender,
                status: true,
                payingInstram: false,
                payingMilestone: false,
                payingPeriodically: true,
                payingOneTime: false,
                totalPaying: 0,
                totalperiodicPaid: 0,
                streamStart: 0
            });
        } else {
            s_companyInfo[msg.sender] = Company({
                _address: msg.sender,
                status: true,
                payingInstram: false,
                payingMilestone: false,
                payingPeriodically: false,
                payingOneTime: true,
                totalPaying: 0,
                totalperiodicPaid: 0,
                streamStart: 0
            });
        }
    }

    /**
     * @notice pays a one time invoce
     */
    function payOnetimeInvoce(uint256 invoiceId_) external {
        Invoice storage invoice = idInvoices[invoiceID_];
        ISuperToken token_ = ISuperToken(invoice.token);
        require(
            invoice.invoiceType == PAYMENTTYPE.ONETIMEPAYMENT,
            "wrong invoice type"
        );
        require(invoice.payer == msg.sender, "not authorized sender");
        require(invoice.isAccepted, "accept first");
        require(!invoice.isPayed, "payed");
        require(token_.allowance(msg.sender, address(this)) >= invoice.amount);
        token_.transferFrom(msg.sender, address(this), invoice.amount);
        if (block.timestamp >= invoice.deadline) {
            token_.transfer(invoice.receiver, invoice.amount);
            emit InvoicePayed(invoiceId_, msg.sender, invoice.receiver);
        } else {
            idaContract.addOneTimeInvoiceToIndex(invoiceId_);
        }
        idInvoices[invoiceId_].isPayed = true;
    }

    /**
     * @notice add an employer to the platform
     * @dev only callable by an active employer
     * @param _employeeAddress: address of the employer
     * @param _salary: the employee salary
     * @param _paymentInterval: the interval to which the employee receives the pay
     */
    function _addemployee(
        address _employeeAddress,
        uint256 _salary,
        uint256 _paymentInterval,
        uint256 _endOfContract, //** */
        uint256 _payType
    ) external {
        Company storage company = s_companyInfo[msg.sender];
        require(company.status == true, "not active");
        uint256 _payment = payments;
        if (_payType == 0) {
            s_employeeinfo[_payment] = EmployeeInfo({
                employer: msg.sender,
                employee: _employeeAddress,
                isActive: false,
                monthlyIncome: _salary,
                startTime: block.timestamp,
                paymentInterval: _paymentInterval,
                endTime: _endOfContract,
                totalpaid: uint256(0),
                isStreamed: true,
                isPeriodic: false,
                isOneTime: false
            });
            s_companyInfo[msg.sender].totalPaying += _salary;
            s_companyEmployees[msg.sender].push(_employeeAddress);
            streamEmployees.push(_employeeAddress);
        }

        if (_payType == 1) {
            s_employeeinfo[_payment] = EmployeeInfo({
                employer: msg.sender,
                employee: _employeeAddress,
                isActive: false,
                monthlyIncome: _salary,
                startTime: block.timestamp,
                paymentInterval: _paymentInterval,
                endTime: _endOfContract,
                totalpaid: uint256(0),
                isStreamed: false,
                isPeriodic: true,
                isOneTime: false
            });
            s_companyInfo[msg.sender].totalPaying += _salary;
            s_companyEmployees[msg.sender].push(_employeeAddress);
            periodicEmployees.push(_employeeAddress);
        }
        employeeEmployers[_employeeAddress].push(msg.sender);
    }

    function getEmployeeIndex(address _employee)
        public
        view
        returns (uint256 index)
    {
        uint256 size = getTotalCompanyEmployees(msg.sender);
        for (uint256 i = 0; i > size; i++) {
            if (s_companyEmployees[msg.sender][i] == _employee) {
                index = i;
            }
        }
    }

    /**
     * @notice removes a payment from the platform
     */
    //Removes a payment from the platform
    function removePayment(uint256 id_) external {
        require(msg.sender == s_employeeinfo[id_].employer);
        //uint256 indexToremove = getEmployeeIndex(_employee);
        //uint256 size = getTotalCompanyEmployees(msg.sender) - 1;
        s_employeeinfo[id_] = EmployeeInfo({
            employer: address(0),
            employee: address(0),
            isActive: false,
            monthlyIncome: 0,
            startTime: 0,
            paymentInterval: 0,
            endTime: 0,
            totalpaid: 0,
            isStreamed: false,
            isPeriodic: false,
            isOneTime: false
        });
        //if (s_companyInfo[msg.sender].isPeriodic == true) {
        //    //remove employee from IDA
        //    idaContract.removeAddress(_employee);
        //}
        //if (indexToremove == size) {
        //    s_companyEmployees[msg.sender].pop();
        //} else {
        //    s_companyEmployees[msg.sender][indexToremove] = s_companyEmployees[
        //        msg.sender
        //    ][size];
        //    s_companyEmployees[msg.sender].pop();
        //}
    }

    /*

*/
    function makeRecurringPayment() external /**recurring */
    {
        uint256 c_length = s_companyEmployees[msg.sender].length;
        require(c_length > 0);
        bool success = _acceptedToken.transferFrom(
            msg.sender,
            address(idaContract),
            getTotalPaying(msg.sender)
        );
        if (!success) {
            revert("transfer failed");
        }
        for (uint256 i = 0; i < c_length; i++) {
            address employee = s_companyEmployees[msg.sender][i];
            idaContract._addAddressToIndex(msg.sender, employee);
        }
    }

    //individual employee payment

    function makeOnetimePayment() external {}

    //approve certain addresses

    /**
     * @notice Called by the employer when they want to update streams
     */
    function _prepareStreamUpdate(
        address[] memory _employees,
        int96[] memory _amounts
    ) external {
        //Company storage company = s_companyInfo[msg.sender];
        require(_employees.length == _amounts.length, "arrays !eq");
        uint256 _length = _amounts.length;
        uint256 _companyAddresses = s_companyEmployees[msg.sender].length;
        require(_length <= s_companyEmployees[msg.sender].length); //@dev: can't update more addresses than yours
        uint256 _counter;
        for (uint256 i = 0; i < _length; ) {
            address user = _employees[i];
            for (uint256 j = 0; j < _companyAddresses; ) {
                if (s_companyEmployees[msg.sender][j] == user) {
                    _counter += 1;
                }
                unchecked {
                    j++;
                }
            }
            unchecked {
                i++;
            }
        }
        if (_counter == _length) {
            _updatableEmployees[msg.sender] = Updateables(
                true,
                _employees,
                _amounts
            );
        } else {
            revert Emploee__not_in__List();
        }
    }

    /**
     * @notice create an invoice for an employer
     */
    function createInvoice(
        address employerAddress_,
        address requestor_,
        uint8 invoiceType_,
        uint256 indexInUserList_,
        address token_,
        uint256[] memory milestoneTimes_,
        uint256[] memory milestonePay_,
        uint256 amount_,
        uint256 deadline_
    ) external onlyUserContract returns (uint256 _invoiceMem) {
        invoices += 1;
        _invoiceMem = invoices;
        if (invoiceType_ == 1) {
            idInvoices[_invoiceMem] = Invoice({
                invoiceType: INVOICETYPE.ONETIMEPAYMENT,
                isAccepted: false,
                payer: employerAddress_,
                reciever: requestor_,
                amount: amount_,
                token: token_,
                deadline: deadline_,
                milestoneTimes: new uint256[](),
                milestonePay: new uint256[](),
                isMilestonePayed: new bool[](),
                isPayed: false
            });
        } else {
            idInvoices[_invoiceMem] = Invoice({
                invoiceType: INVOICETYPE.MILESTONE,
                isAccepted: false,
                payer: employerAddress_,
                reciever: requestor_,
                amount: 0,
                token: token_,
                deadline: deadline_,
                milestoneTimes: milestoneTimes_,
                milestonePay: milestonePay_,
                isMilestonePayed: new bool[](),
                isPayed: false
            });
        }
        companyInvoiceIds[employerAddress_].push(_invoiceMem);
    }

    /**
     * @notice accept an invoice
     */
    function acceptInvoice(uint256 invoiceID_) external {
        Invoice storage invoice = idInvoices[invoiceID_];
        require(invoice.payer == msg.sender, "not authorized sender");
        require(!invoice.isAccepted, "already accepted");
        idInvoices[invoiceID_].isAccepted = true;
        if (invoice.invoiceType == INVOICETYPE.MILESTONE) {
            userContract.updateMilestonePayStatus();
        }
    }

    function _completeUpdate(address _employer) external onlyUserContract {
        address[] memory _emptyAddressArray;
        int96[] memory _emptyFR;
        _updatableEmployees[_employer] = Updateables(
            false,
            new address[](),
            new int96[]()
        );
    }

    function openStream(address _to, int96 _flowRate)
        external
        onlyUserContract
    {
        _createFlow(_to, _flowRate);
    }

    function closeStream(address _to) external onlyUserContract {
        _deleteFlow(address(this), _to);
    }

    function reduceFlow(address to, int96 flowRate) external onlyUserContract {
        _updateFlow(to, flowRate);
    }

    function _createFlow(address to, int96 flowRate) internal {
        if (to == address(this) || to == address(0)) return;
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.createFlow.selector,
                _acceptedToken,
                to,
                flowRate,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    function _updateFlow(address to, int96 flowRate) internal {
        if (to == address(this) || to == address(0)) return;
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                _acceptedToken,
                to,
                flowRate,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    function _deleteFlow(address from, address to) internal {
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.deleteFlow.selector,
                _acceptedToken,
                from,
                to,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    function addAdmin(address _keeper) external {
        investmentKeeper = _keeper;
    }

    function addIdaContract(address _idaCon) external onlyOwner {
        idaContract = ITrustIDA(_idaCon);
    }

    /*
        @constanteen: call this function after conection to ascertain if its a company
        @param: _companyAddress, the address connected on metamask
    */
    function isActiveCompany(address _companyAddress)
        public
        view
        returns (bool)
    {
        return s_companyInfo[_companyAddress]._address != address(0);
    }

    function getEmployeeFlowRate(uint256 id_) external view returns (int96) {
        uint256 salary = s_employeeinfo[id_].monthlyIncome;
        uint256 _flowRate = salary / 30 days;
        return toIint(_flowRate);
    }

    function toIint(uint256 number) private pure returns (int96) {
        int256 number1 = int256(number);
        return (int96(number1));
    }

    //total number of periodic employees
    function getPeriodicEmployee() external view returns (uint256 len) {
        len = periodicEmployees.length;
    }

    //Total people on playlist
    function getTotalCompanyEmployees(address _company)
        public
        view
        returns (uint256)
    {
        return s_companyEmployees[_company].length;
    }

    function getNetFlow(address _employee) external view returns (int96) {
        (, int96 flowrate, , ) = _cfa.getFlow(
            _acceptedToken,
            address(this),
            _employee
        );
        return flowrate;
    }

    //The total Amount the company is paying
    function getTotalPaying(address _company) public view returns (uint256) {
        return s_companyInfo[_company].totalPaying;
    }

    /**
     * @notice get an employer's infor
     * @param _company: employee address
     */
    function viewCompanyInfo(address _company)
        external
        view
        returns (Company memory)
    {
        return s_companyInfo[_company];
    }

    /**
     * @notice get an employee's infor
     * @param _employee: employee address
     */
    function viewEmployeeInfo(uint256 id_)
        external
        view
        returns (EmployeeInfo memory)
    {
        return s_employeeinfo[id_];
    }

    function viewCompanyEmployees(address _company)
        external
        view
        returns (address[] memory fullList)
    {
        fullList = s_companyEmployees[_company];
    }

    function getEmployeeEmployers(address _employee)
        external
        view
        returns (address[] memory)
    {
        return employeeEmployers[_employee];
    }

    function getUpdateables(address _employer)
        external
        view
        returns (Updateables memory _updates)
    {
        _updates = _updatableEmployees[_employer];
    }

    function viewInvoice(uint256 id_) external view returns (Invoice memory) {
        return idInvoices[id_];
    }

    //returns the total periodic pay per address
    //function getTotalPeriodicPayPerAddress(address _employee)
    //    public
    //    view
    //    returns (uint256)
    //{}
}
