import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTABI from "../../../artifacts/contracts/EventAccessNFT.sol/EventAccessNFT.json"; // adjust path
import { NFT_CONTRACT_ADDRESS } from "../constants/constants"; // set this in your constants

export function useNftContract() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.ethereum) return;

    const setup = async () => {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _account = await _signer.getAddress();

        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFTABI.abi, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(nftContract);
        setAccount(_account);
      } catch (err) {
        console.error("Failed to set up NFT contract:", err);
      } finally {
        setLoading(false);
      }
    };

    setup();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFTABI.abi, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(nftContract);
        setAccount(accounts[0]);
      } else {
        setProvider(null);
        setSigner(null);
        setContract(null);
        setAccount(null);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return { contract, signer, provider, account, loading };
}
