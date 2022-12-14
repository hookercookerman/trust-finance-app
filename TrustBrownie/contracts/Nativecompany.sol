// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {ISuperTokenFactory} from "@superfluid/interfaces/superfluid/ISuperTokenFactory.sol";
import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "@superfluid/interfaces/superfluid/ISuperfluid.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import {IConstantFlowAgreementV1} from "@superfluid/interfaces/agreements/IConstantFlowAgreementV1.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {SuperAppBase} from "@superfluid/apps/SuperAppBase.sol";
import {ITrust} from "../interfaces/ITrust.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NativeCompany is SuperAppBase, ReentrancyGuard {
    //mapping(address => mapping(uint256 => int96)) public AncestorIdFlowRate;
    //mapping(address => int96) public addressTotalOut;
    //mapping(address => uint256) public tokenDureation;

    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken private _acceptedToken; // accepted token
    address private _receiver;
    ITrust trustContract;

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken,
        address _addr
    ) {
        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;
        trustContract = ITrust(_addr);
        _receiver = address(trustContract);

        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

    function currentReceiver()
        external
        view
        returns (
            uint256 startTime,
            address receiver,
            int96 flowRate
        )
    {
        if (_receiver != address(0)) {
            (startTime, flowRate, , ) = _cfa.getFlow(
                _acceptedToken,
                address(this),
                _receiver
            );
            receiver = _receiver;
        }
    }

    /// @dev If a new stream is opened, or an existing one is opened
    function _updateOutflow(bytes calldata ctx)
        private
        returns (bytes memory newCtx)
    {
        newCtx = ctx;
        // @dev This will give me the new flowRate, as it is called in after callbacks
        int96 netFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));
        (, int96 outFlowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            address(this),
            _receiver
        ); // CHECK: unclear what happens if flow doesn't exist.
        int96 inFlowRate = netFlowRate + outFlowRate;

        // @dev If inFlowRate === 0, then delete existing flow.
        if (inFlowRate == int96(0)) {
            // @dev if inFlowRate is zero, delete outflow.
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.deleteFlow.selector,
                    _acceptedToken,
                    address(this),
                    _receiver,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        } else if (outFlowRate != int96(0)) {
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.updateFlow.selector,
                    _acceptedToken,
                    _receiver,
                    inFlowRate,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        } else {
            // @dev If there is no existing outflow, then create new flow to equal inflow
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.createFlow.selector,
                    _acceptedToken,
                    _receiver,
                    inFlowRate,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        }
    }

    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/
    function beforeAgreementCreated(
        ISuperToken, /*superToken*/
        address, /*agreementClass*/
        bytes32, /*agreementId*/
        bytes calldata, /*agreementData*/
        bytes calldata _ctx
    )
        external
        view
        virtual
        override
        returns (
            bytes memory /*cbdata*/
        )
    {
        ISuperfluid.Context memory dContext = _host.decodeCtx(_ctx);
        address sender = dContext.msgSender;
        if (trustContract.getTotalCompanyEmployees(sender) == 0) {
            revert("Add employees to trust contract");
        }
    }

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        ISuperfluid.Context memory dContext = _host.decodeCtx(_ctx);
        address sender = dContext.msgSender;
        uint256 numberOfAddresses = trustContract.getTotalCompanyEmployees(
            sender
        );
        address[] memory companyEmployees = trustContract.viewCompanyEmployees(
            sender
        );
        for (uint256 i = 0; i < numberOfAddresses; i++) {
            int96 _flowRate = trustContract.getEmployeeFlowRate(
                sender,
                companyEmployees[i]
            );
            trustContract.openStream(companyEmployees[i], _flowRate);
        }

        return _updateOutflow(_ctx);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, /*agreementData*/
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        ISuperfluid.Context memory dContext = _host.decodeCtx(_ctx);
        address sender = dContext.msgSender;
        ITrust.Updateables memory updates = trustContract.getUpdateables(
            sender
        );

        if (updates.isUpdatable) {
            address[] memory _toBeUpdated = updates._addresses;
            int96[] memory _amountUpdates = updates._updates;
            uint256 _updateNumber = _toBeUpdated.length;
            for (uint256 i = 0; i < _updateNumber; i++) {
                int96 _flowRate = _amountUpdates[i];
                address _user = _toBeUpdated[i];
                trustContract.openStream(_user, _flowRate);
            }
        }
        return _updateOutflow(_ctx);
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        // According to the app basic law, we should never revert in a termination callback
        if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass))
            return _ctx;
        ISuperfluid.Context memory dContext = _host.decodeCtx(_ctx);
        address sender = dContext.msgSender;
        uint256 numberOfAddresses = trustContract.getTotalCompanyEmployees(
            sender
        );

        if (numberOfAddresses != 0) {
            for (uint256 i = 0; i < numberOfAddresses; i++) {
                address employee = trustContract.s_companyEmployees(i);
                trustContract.closeStream(employee);
            }
        }
        return _updateOutflow(_ctx);
    }

    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return
            ISuperAgreement(agreementClass).agreementType() ==
            keccak256(
                "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
            );
    }

    modifier onlyHost() {
        require(
            msg.sender == address(_host),
            "RedirectAll: support only one host"
        );
        _;
    }

    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }
}
