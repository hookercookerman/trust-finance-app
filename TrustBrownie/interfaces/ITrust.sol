// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface ITrust {
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

    function openStream(address _to, int96 _flowrate) external;

    function closeStream(address _to) external;

    function makeInvestmentDeposit(address _recepient, address _token) external;

    function _getFlow(address sender) external view returns (uint256, int96);

    function removeEmployee(address _toRemove) external;

    function getTotalCompanyEmployees(address _company)
        external
        view
        returns (uint256);

    function getTotalPaying(address _company) external view returns (uint256);

    //function getUserAddress(uint256 index) external view returns (address);

    function s_investingAddresses(uint256 index)
        external
        view
        returns (address);

    function reduceFlow(address to) external;

    function getTotalAddresses() external view returns (uint256);

    function addAdmin(address _adminCon) external;

    function getEmployeeFlowRate(address _sender, address _employee)
        external
        view
        returns (int96);

    function s_companyEmployees(uint256 index) external view returns (address);

    function getPeriodicEmployee() external view returns (uint256 len);

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
}
