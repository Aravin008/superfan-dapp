import { useEffect, useState } from "react";
import { ethers } from "ethers";
import FanTokenABI from "../../../artifacts/contracts/FanToken.sol/FanToken.json";
import { FAN_TOKEN_ADDRESS } from "../constants/constants";

export function useFanToken() {
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    let contractInstance;

    const fetchData = async () => {
      setLoading(true);
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        contractInstance = new ethers.Contract(FAN_TOKEN_ADDRESS, FanTokenABI.abi, signer);
        setContract(contractInstance);

        const bal = await contractInstance.balanceOf(address);
        setAccount(address);
        setBalance(ethers.formatUnits(bal, 18));
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        try {
          const bal = await contractInstance.balanceOf(accounts[0]);
          setBalance(ethers.formatUnits(bal, 18));
        } catch (err) {
          console.error("Failed to update balance on account change:", err);
          setBalance(null);
        }
      } else {
        setAccount(null);
        setBalance(null);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return { contract, account, balance, loading };
}
