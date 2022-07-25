// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

contract ContractTest is Test {
    function setUp() public {}

    function testExample() public view {
        assert(
            address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266).balance ==
                0 ether
        );
    }
}
