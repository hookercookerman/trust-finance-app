// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface ITrust {
    enum INVOICETYPE {
        ONETIMEPAYMENT,
        MILESTONE
    }

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

    struct Updateables {
        bool isUpdatable;
        address[] _addresses;
        int96[] _updates;
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
    ) external;

    function getNetFlow(address _emplyee) external returns (int96);

    function openStream(address _to, int96 _flowrate) external;

    function closeStream(address _to) external;

    function makeInvestmentDeposit(address _recepient, address _token) external;

    function removeEmployee(address _toRemove) external;

    function getTotalCompanyEmployees(address _company)
        external
        view
        returns (uint256);

    function getTotalPaying(address _company) external view returns (uint256);

    function s_investingAddresses(uint256 index)
        external
        view
        returns (address);

    function reduceFlow(address to, int96 _toReduce) external;

    function getTotalAddresses() external view returns (uint256);

    function addAdmin(address _adminCon) external;

    function getEmployeeFlowRate(address _sender, address _employee)
        external
        view
        returns (int96);

    function s_companyEmployees(uint256 index) external view returns (address);

    function getPeriodicEmployee() external view returns (uint256 len);

    function viewCompanyInfo(address _company)
        external
        view
        returns (Company memory);

    function viewCompanyEmployees(address _company)
        external
        view
        returns (address[] memory fullList);

    function viewEmployeeInfo(address _company, address _employee)
        external
        view
        returns (EmployeeInfo memory);

    function getUpdateables(address _employer)
        external
        view
        returns (Updateables memory _updates);

    function _completeUpdate(address _employer) external;

    function isActiveCompany(address _companyAddress)
        external
        view
        returns (bool);

    function viewInvoice(uint256 id_) external view returns (Invoice memory);
}
