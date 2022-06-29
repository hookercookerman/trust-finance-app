import { useCallback, } from "react";
import { useNavigate } from "react-router-dom";
import useWalletCheck from "./useWalletCheck";


export default function useMetaMask() {
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useWalletCheck();

  const connectWallet = useCallback(async (destination: string) => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
      setWalletAddress(accounts?.[0]);

      navigate(`${destination}`);

    } catch (e) {
      console.error(e);
    }
  }, [navigate, setWalletAddress]);

  return [connectWallet, walletAddress] as const;
}