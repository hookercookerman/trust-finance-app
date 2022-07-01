// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISuperfluid, ISuperToken, SuperAppDefinitions} from "@superfluid/interfaces/superfluid/ISuperfluid.sol";
import {IInstantDistributionAgreementV1} from "@superfluid/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {SuperAppBase} from "@superfluid/apps/SuperAppBase.sol";
import {ITrust} from "../interfaces/ITrust.sol";

contract TrustIDA is SuperAppBase, Ownable {
    ISuperToken private _cashToken;
    ISuperfluid private _host;
    IInstantDistributionAgreementV1 private _ida;
    ITrust public trusContract;
    address public keeper;

    mapping(uint256 => uint256) public amountTodistribute;

    mapping(address => bool) public isSubscribing;

    uint32 public ONE_TIME_INDEX;

    struct DistributionInfo {
        bool isDistributable;
        address[] _receivers;
    }

    mapping(uint256 => DistributionInfo) public timeStampDistributable;

    constructor(
        ISuperToken cashToken,
        ISuperfluid host,
        IInstantDistributionAgreementV1 ida
    ) {
        _cashToken = cashToken;
        _host = host;
        _ida = ida;

        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

    function _checkSubscription(
        ISuperToken superToken,
        bytes calldata ctx,
        bytes32 agreementId
    ) private {
        ISuperfluid.Context memory context = _host.decodeCtx(ctx);
        // only interested in the subscription approval callbacks
        //uint32 INDEX_ID = getAddressIndexId(sender);
        if (
            context.agreementSelector ==
            IInstantDistributionAgreementV1.approveSubscription.selector
        ) {
            address publisher;
            uint32 indexId;
            bool approved;
            uint128 units;
            uint256 pendingDistribution;
            (publisher, indexId, approved, units, pendingDistribution) = _ida
                .getSubscriptionByID(superToken, agreementId);

            // sanity checks for testing purpose
            require(publisher == address(this), "DRT: publisher mismatch");
            //require(indexId == INDEX_ID, "DRT: publisher mismatch");

            if (approved) {
                isSubscribing[
                    context.msgSender /* subscriber */
                ] = true;
            }
        }
    }

    function distribute(uint256 cashAmount, uint32 _index) external onlyOwner {
        (uint256 actualCashAmount, ) = _ida.calculateDistribution(
            _cashToken,
            address(this),
            _index,
            cashAmount
        );

        _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
                _ida.distribute.selector,
                _cashToken,
                _index,
                actualCashAmount,
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );
    }

    function makeOnetimebatch/** could also make onetime payment*/(
        address[] memory _addresses,
        uint256[] memory _amounts,
        uint256 _timeFromNow
    ) external {
        uint256 len = _addresses.length;
        uint256 _time = block.timestamp + _timeFromNow;
        DistributionInfo storage distributionInfor = timeStampDistributable[
            _time
        ];
        if (distributionInfor.isDistributable == false) {
            _host.callAgreement(
                _ida,
                abi.encodeWithSelector(
                    _ida.createIndex.selector,
                    _cashToken,
                    uint32(_time),
                    new bytes(0) // placeholder ctx
                ),
                new bytes(0) // user data
            );
            for (uint256 i = 0; i < len; i++) {
                _host.callAgreement(
                    _ida,
                    abi.encodeWithSelector(
                        _ida.updateSubscription.selector,
                        _cashToken,
                        uint32(_time),
                        _addresses[i],
                        _amounts[i],
                        new bytes(0) // placeholder ctx
                    ),
                    new bytes(0) // user data
                );
                amountTodistribute[_time] += _amounts[i];
                timeStampDistributable[_time] = DistributionInfo(
                    true,
                    _addresses
                );
            }
        } else {
            for (uint256 i = 0; i < len; i++) {
                _host.callAgreement(
                    _ida,
                    abi.encodeWithSelector(
                        _ida.updateSubscription.selector,
                        _cashToken,
                        uint32(_time),
                        _addresses[i],
                        _amounts[i],
                        new bytes(0) // placeholder ctx
                    ),
                    new bytes(0) // user data
                );
                amountTodistribute[_time] += _amounts[i];
                timeStampDistributable[_time]._receivers.push(_addresses[i]);
            }
            timeStampDistributable[_time].isDistributable = true;
        }
    }

    function _addAddressToIndex(address _company, address recipient)
        external
        onlyOwner
    {
        ITrust.EmployeeInfo memory employee = trusContract.viewEmployeeInfo(
            _company,
            recipient
        );
        uint256 _time = employee.startTime + employee.paymentInterval;
        DistributionInfo storage distributionInfor = timeStampDistributable[
            _time
        ];

        if (distributionInfor.isDistributable == false) {
            _host.callAgreement(
                _ida,
                abi.encodeWithSelector(
                    _ida.createIndex.selector,
                    _cashToken,
                    uint32(_time),
                    new bytes(0) // placeholder ctx
                ),
                new bytes(0) // user data
            );

            _host.callAgreement(
                _ida,
                abi.encodeWithSelector(
                    _ida.updateSubscription.selector,
                    _cashToken,
                    uint32(_time),
                    recipient,
                    uint128(employee.monthlyIncome),
                    new bytes(0) // placeholder ctx
                ),
                new bytes(0) // user data
            );
            amountTodistribute[_time] += employee.monthlyIncome;
            address[] storage _addresses = distributionInfor._receivers;
            _addresses.push(recipient);
            timeStampDistributable[_time] = DistributionInfo(true, _addresses);
        } else {
            _host.callAgreement(
                _ida,
                abi.encodeWithSelector(
                    _ida.updateSubscription.selector,
                    _cashToken,
                    uint32(_time),
                    recipient,
                    uint128(employee.monthlyIncome),
                    new bytes(0) // placeholder ctx
                ),
                new bytes(0) // user data
            );
            amountTodistribute[_time] += employee.monthlyIncome;
            address[] storage _addresses = distributionInfor._receivers;
            _addresses.push(recipient);
            timeStampDistributable[_time]._receivers = _addresses;
        }
    }

    function viewTimestamp(uint256 _time) external view returns (bool) {
        return timeStampDistributable[_time].isDistributable;
    }

    function removeAddress(address _company, address _employee)
        external
        onlyOwner
    {
        ITrust.EmployeeInfo memory employee = trusContract.viewEmployeeInfo(
            _company,
            _employee
        );
        uint256 _time = employee.startTime + employee.paymentInterval;
        DistributionInfo storage dist = timeStampDistributable[_time];
        if (dist.isDistributable == true) {
            //bool isAdded
            if (block.timestamp < _time) {
                _host.callAgreement(
                    _ida,
                    abi.encodeWithSelector(
                        _ida.updateSubscription.selector,
                        _cashToken,
                        uint32(_time),
                        _employee,
                        uint128(0),
                        new bytes(0) // placeholder ctx
                    ),
                    new bytes(0) // user data
                );
            }
        }
        ///remove employee from index if block is not reached
    }

    function addAdmin(address _keeper) external onlyOwner {
        keeper = _keeper;
    }

    function addIdaContract(address _trust) external onlyOwner {
        trusContract = ITrust(_trust);
    }

    function afterAgreementCreated(
        ISuperToken superToken,
        address, /* agreementClass */
        bytes32 agreementId,
        bytes calldata, /*agreementData*/
        bytes calldata, /*cbdata*/
        bytes calldata _ctx
    ) external override returns (bytes memory newCtx) {
        //ISuperfluid.Context memory dContext = _host.decodeCtx(_ctx);
        //address sender = dContext.msgSender;
        _checkSubscription(superToken, _ctx, agreementId);
        newCtx = _ctx;
    }

    function beforeAgreementUpdated(
        ISuperToken superToken,
        address agreementClass,
        bytes32, /* agreementId */
        bytes calldata, /*agreementData*/
        bytes calldata /*ctx*/
    ) external view override returns (bytes memory data) {
        require(superToken == _cashToken, "DRT: Unsupported cash token");
        require(agreementClass == address(_ida), "DRT: Unsupported agreement");
        return new bytes(0);
    }

    function afterAgreementUpdated(
        ISuperToken superToken,
        address, /* agreementClass */
        bytes32 agreementId,
        bytes calldata, /*agreementData*/
        bytes calldata, /*cbdata*/
        bytes calldata _ctx
    ) external override returns (bytes memory newCtx) {
        //ISuperfluid.Context memory dContext = _host.decodeCtx(_ctx);
        //address sender = dContext.msgSender;
        _checkSubscription(superToken, _ctx, agreementId);
        newCtx = _ctx;
    }
}
