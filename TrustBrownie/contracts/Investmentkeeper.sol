// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData)
        external
        returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

pragma solidity ^0.8.13;

import {ITrust} from "../interfaces/ITrust.sol";
import {ITrustIDA} from "../interfaces/ITrustIDA.sol";

contract TrustKeeper is KeeperCompatibleInterface {
    ITrust private trustContract;
    ITrustIDA private trustIDA;

    constructor(address _trustContract, address _trustIda) {
        trustIDA = ITrustIDA(_trustIda);
        trustContract = ITrust(_trustContract);
        trustContract.addAdmin(address(this));
    }

    function checkUpkeep(
        bytes calldata /*checkData*/
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 _time = block.timestamp;
        upkeepNeeded = trustIDA.viewTimestamp(_time);
        performData = abi.encodePacked(_time);
    }

    function performUpkeep(bytes calldata performData) external override {
        uint256 _time = abi.decode(performData, (uint256));
        uint256 amount = trustIDA.amountTodistribute(_time);
        trustIDA.distribute(amount, uint32(_time));
    }
}
