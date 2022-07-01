from brownie import (
    NativeCompany,
    StreamMarket,
    TrustCFA,
    TrustToken,
    TrustSwap,
    network,
    convert,
    accounts,
    config,
    web3,
    TrustIDA,
    DepositKeeper
)
from scripts.helpful_scripts import get_account

NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = [
    "hardhat", "development", "ganache"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS + [
    "mainnet-fork",
    "binance-fork",
    "matic-fork",
]
# Etherscan usually takes a few blocks to register the contract has been deployed
BLOCK_CONFIRMATIONS_FOR_VERIFICATION = 6


DECIMALS = 18
INITIAL_VALUE = web3.toWei(2000, "ether")

# owner account
owner_account = get_account()

company_account = accounts.add(config["wallets"]["from_ac1"])
employee_account = accounts.add(config["wallets"]["from_ac2"])
employee_2_account = accounts.add(config["wallets"]["from_ac3"])

host_mumbai = convert.to_address("0xEB796bdb90fFA0f28255275e16936D25d3418603")
cfa_mumbai = convert.to_address("0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873")
ida_mumbai = convert.to_address("0x804348D4960a61f2d5F9ce9103027A3E849E09b8")
daix_mumbai = convert.to_address("0x983E2b60604603792ea99b95f5e69A0445a83278")
fdai_mumbai = convert.to_address("0x9A753f0F7886C9fbF63cF59D0D4423C5eFaCE95B")

'''
    Workflow from the point when the employee registers an account to trasfer of salaries. 
'''


def main():
    # instantiate contracts

    # native company contract (superApp) which holds the stream fallback logic
    native_company = NativeCompany[-1]

    # ida contract logic
    ida_contract = TrustIDA[-1]

    # main contract
    trust_contract = TrustCFA[-1]

    '''
        Step1: we add a company address to the platform to enable it to add employees
        @NOTE: adding a company, assuming its evrified
        @dev only callable by the contract admin
        @param _payType: the type of payment the company gives ie. Installments or stream
        @param _companyAddress: the address of the company
    '''
    trust_contract._createCompany(
        0, company_account, 0, {"from": owner_account})

    '''
        Step2: the company adds aemployee address
        @NOTE: add an employer to the platform
        @dev only callable by an active employer
        @param _employeeAddress: address of the employer
        @param _salary: the employee salary
        @param _paymentInterval: the interval to which the employee receives the pay
    '''
    # this employee is paid in streams because the employer pays in streams
    trust_contract._addemployee(employee_account, convert.to_uint(
        "2000 ether"), 30, {'from': company_account})

    '''
        Step3: the employer creates a stream to the NativeCompany contract.
        @NOTE: the stream has to be created with a flow rate able to support the employees' salaries.
        This can be done on the superfluid console.
        Or intergrated on our flontend for a one stop experience.
    '''


if __name__ == "__main__":
    main()
