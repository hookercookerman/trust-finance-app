// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IConstantFlowAgreementV1} from "@superfluid/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {ISuperTokenFactory} from "@superfluid/interfaces/superfluid/ISuperTokenFactory.sol";
import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "@superfluid/interfaces/superfluid/ISuperfluid.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPoolAddressesProvider} from "../interfaces/IPoolAddressesProvider.sol";
import {IPool} from "../interfaces/IPool.sol";
import {ITrustIDA} from "../interfaces/ITrustIDA.sol";

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

    struct EmployeeInfo {
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

    //employer to employee to information
    mapping(address => mapping(address => EmployeeInfo)) private s_employeeinfo;

    address private investmentKeeper;

    modifier onlyAdmin() {
        require(msg.sender == owner());
        _;
    }

    modifier onlyInvestmentKeeper() {
        require(msg.sender == investmentKeeper);
        _;
    }

    constructor(address host, address cfa) {
        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);
    }

    /**
     * @notice add a compny to the platform
     * @dev only callable by the contract admin
     * @param _payType: the type of payment the company gives ie. Installments or stream
     */
    function _createCompany(uint8 _payType) external {
        if (_payType == 0) {
            s_companyInfo[msg.sender] = Company(
                msg.sender,
                true,
                true,
                false,
                false,
                0,
                0,
                0
            );
        }
        if (_payType == 1) {
            s_companyInfo[msg.sender] = Company(
                msg.sender,
                true,
                false,
                true,
                false,
                0,
                0,
                0
            );
        } else {
            s_companyInfo[msg.sender] = Company(
                msg.sender,
                true,
                false,
                false,
                true,
                0,
                0,
                0
            );
        }
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
        if (_payType == 0) {
            s_employeeinfo[msg.sender][_employeeAddress] = EmployeeInfo(
                false,
                _salary,
                block.timestamp,
                _paymentInterval,
                _endOfContract,
                uint256(0),
                true,
                false,
                false
            );
            s_companyInfo[msg.sender].totalPaying += _salary;
            s_companyEmployees[msg.sender].push(_employeeAddress);
            streamEmployees.push(_employeeAddress);
        }

        if (_payType == 1) {
            s_employeeinfo[msg.sender][_employeeAddress] = EmployeeInfo(
                false,
                _salary,
                block.timestamp,
                _paymentInterval,
                _endOfContract,
                uint256(0),
                false,
                true,
                false
            );
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

    function removeEmployee(address _employee) external {
        //require(msg.sender == s_employeeinfo[][_employee].employer);
        //uint256 indexToremove = getEmployeeIndex(_employee);
        //uint256 size = getTotalCompanyEmployees(msg.sender) - 1;
        s_employeeinfo[msg.sender][_employee] = EmployeeInfo(
            false,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false
        );
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
    function makePayment() external /**recurring */
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
    //approve certain addresses

    function _prepareStreamUpdate(
        address[] memory _employees,
        int96[] memory _amounts
    ) external {
        Company storage company = s_companyInfo[msg.sender];
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

    function openStream(address _to, int96 _flowRate) external {
        _createFlow(_to, _flowRate);
    }

    function closeStream(address _to) external {
        _deleteFlow(address(this), _to);
    }

    function reduceFlow(address to, int96 flowRate) external {
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

    function getEmployeeFlowRate(address _company, address _employee)
        external
        view
        returns (int96)
    {
        uint256 salary = s_employeeinfo[_company][_employee].monthlyIncome;
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
    function viewEmployeeInfo(address _company, address _employee)
        external
        view
        returns (EmployeeInfo memory)
    {
        return s_employeeinfo[_company][_employee];
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
}
