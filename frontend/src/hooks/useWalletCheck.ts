import { useEffect } from "react";
import { useWallet } from "../store";


export default function useWalletCheck() {
  const [walletAddress, setWalletAddress] = useWallet(state => [state.walletAddress, state.setWalletAddress]);

  useEffect(() => {
    let ignore = false;

    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log("Make sure you have a metamask");
          return;
        } else {
          console.log("We have the ethereum object ", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" }) as string[];

        if (accounts.length !== 0 && !ignore) {
          const account = accounts?.[0];
          console.log("Found an authorized account:", account);
          setWalletAddress(account);
        } else {
          console.log("No authorized account found");
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkIfWalletIsConnected();

    return () => { ignore = true; };

  }, [setWalletAddress]);

  return [walletAddress, setWalletAddress] as const;

}
