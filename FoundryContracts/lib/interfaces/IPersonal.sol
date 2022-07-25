// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

interface IPersonal {
    struct UserPayments {
        bool stream;
        bool periodic;
        bool milestone;
    }

    function viewAddressPayTypes(address _user)
        external
        view
        returns (UserPayments memory);

    function updateAddressPayType(
        address user_,
        bool stream_,
        bool periodic_,
        bool milestone_
    ) external;
}
