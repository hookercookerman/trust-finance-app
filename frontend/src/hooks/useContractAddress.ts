import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function useContractAddress(contractAddress: string, abi: any) {
  const [contractMethods, setContractMethods] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );
      setContractMethods(contract);
    }
    return () => {
      setContractMethods(null);
    };
  }, [abi, contractAddress]);
  

  return [contractMethods] as const;
}