import Web3 from "web3/dist/web3.min.js";

export const convertGweiToUsd = (amount: string) => {
  if (!amount) return 0;
  return Web3.utils.fromWei(amount);
};

export const toWei = (amount: string) => {
  if (!amount) return 0;
  return Web3.utils.toWei(amount);
};