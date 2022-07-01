// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface ITrustIDA {
    struct DistributionInfo {
        bool isDistributable;
        address[] _receivers;
    }

    function getAddressIndexId(address _employer)
        external
        pure
        returns (uint32 indexID);

    function distribute(uint256 cashAmount, uint256 _time) external;

    function _addAddressToIndex(address _company, address recipient) external;

    function removeAddress(address _company, address _employee) external;

    function amountTodistribute(uint256 _timeStamp)
        external
        view
        returns (uint256);

    function viewTimestamp(uint256 _time) external view returns (bool);
}
