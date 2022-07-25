// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import {ITrust} from "interfaces/ITrust.sol";

contract TrustPersonal {
    ITrust public trustContract;

    struct UserPayments {
        bool stream;
        bool periodic;
        bool milestone;
    }
    //addresses allowed to use this contract
    mapping(address => UserPayments) public userActivePayTypes;

    enum INVESTMENTTYPE {
        STAKING,
        LENDING,
        DCA //DolarCostAveraging ricochet exchange
    }

    enum PAYTYPE {
        STREAM,
        PERIODIC
    }

    // Investment Information
    struct InvestmentInfo {
        INVESTMENTTYPE investmentType;
        PAYTYPE payType;
        bool isActive;
        uint256 startTime;
        uint128 percentage;
        uint256 frequency;
        uint256 amountAccumunated;
        address asset;
    }

    //maps an address to investment information
    mapping(address => InvestmentInfo[]) private s_addressInvestment;

    //all the one time invoces requested by an address
    mapping(address => uint256[]) private addressOneTimeInvoices;

    //all the milestone payments requested by an address
    mapping(address => uint256[]) private addressMilestoneInvoices;
    //milestone payment
    struct MilestonePayment {
        uint256 startTime;
        bool[] _completedMilestones;
        uint256[] _milestoneDuration;
        uint256[] amountPerMilestone;
    }
    //mapps an address to all milestone payments requested
    mapping(address => MilestonePayment[]) private _milestonePayments;

    struct OneTimePaytment {
        address payer;
        uint256 amount;
        uint256 deadline;
        bool isPaid;
    }
    //maps an address to all one time payments requested
    mapping(address => OneTimePaytment[]) private _onetimePayments;
    //address to the keeper contract
    address private investmentKeeper;

    address[] private s_investingAddresses; //active addresses

    //only people reciving streams
    modifier onlyStream() {
        UserPayments memory types = userActivePayTypes[msg.sender];
        require(types.stream, "not recieving any streams");
        _;
    }

    constructor(address trust) {
        trustContract = ITrust(trust);
    }

    /**
     * @notice: create either a staking, lending or DCA position by streaming part of your salary
     * @param: int96 _toReduce, the amount to be streaming to the position per second
     * @param: uint8 _investType, the type of investment ie: staking, lending, or DCA
     */
    function streamInvestment(int96 _toReduce, uint8 _investType)
        external
        onlyStream
    {
        require(
            trustContract.getNetFlow(msg.sender) > _toReduce,
            "Not enought Stream"
        );
        trustContract.reduceFlow(msg.sender, _toReduce);
        //Logic to stream to investment
    }

    function _updateAddressPayType(
        address user_,
        bool stream_,
        bool periodic_,
        bool milestone_
    ) internal {
        userActivePayTypes[user_] = UserPayments({
            stream: stream_,
            periodic: periodic_,
            milestone: milestone_
        });
    }

    //update a payment from the main contract
    function updateAddressPayType(
        address user_,
        bool stream_,
        bool periodic_,
        bool milestone_
    ) external onlyTrustContract {
        _updateAddressPayType(user_, stream_, periodic_, milestone_);
    }

    /**
     * @notice: request a one time payment
     * @param: address _employer, employer address
     * @param: uint256 amount, amount requested
     * @param: uint256 deadline, when the payment should be made
     */
    function requestOneTimePayment(
        address _employer,
        uint256 amount,
        uint256 deadline,
        address token_
    ) external {
        uint256 length_ = addressOneTimeInvoices[msg.sender].length;
        uint256 id_ = trustContract.createInvoice(
            _employer,
            msg.sender,
            1,
            length_, //to determine index
            token_,
            (new uint256[]()),
            (new uint256[]()),
            amount,
            deadline
        );
        addressOneTimeInvoices[msg.sender].push(id_);
    }

    /**
     * @notice: request a payment that comes with milestones
     * @param: uint256[] milestoneDuration, how long each milestone takes
     * @param: uint256[] _amountPerMilestone
     */
    function requestMilestonePay(
        address _employer,
        uint256[] memory milestoneDuration,
        uint256[] memory _amountPerMilestone,
        address token
    ) external {
        require(milestoneDuration.length > 1);
        require(
            milestoneDuration.length == _amountPerMilestone.length,
            "undetermined milestone pay"
        );
        uint256 duration_;
        uint256 totalAmount;
        for (uint256 i = 0; i < milestoneDuration.length; ) {
            duration_ += milestoneDuration[i];
            totalAmount += milestoneDuration[i];
            unchecked {
                i++;
            }
        }
        uint256 index = _milestonePayments[msg.sender].length;
        trustContract.createInvoice(
            _employer,
            msg.sender,
            uint8(2),
            index,
            token,
            milestoneDuration._amountPerMilestone,
            totalAmount,
            duration_
        );
    }

    /**
     * @notice make an investment position from a periodic cash flow
     * @param: uint8 investmentType_, the type of investment ie: stake or Lending
     * @param: uint256 amount_, the amount tobe invested
     */
    function makePeriodicInvestment(uint8 investmentType_, uint256 amount_)
        external
    {
        //updated during payment
        //invested when payment is made or when distributed depending on the time of creation
    }

    //view the paytypes a user is recieving
    function viewAddressPayTypes(address _user)
        external
        view
        returns (UserPayments memory)
    {
        return userActivePayTypes[_user];
    }
}
