// src/context/WalletContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { ethers } from "ethers";
import { GUESTBOOK_ADDRESS } from "../constants/constants";
import { abi } from "../../../artifacts/contracts/GuestbookWithTips.sol/GuestbookWithTips.json";
import { useAuth } from "./AuthContext";
import { getCreators } from "../data/fetchData";
import { useToast } from "./ToastContext";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const firstLoadRef = useRef();
  const { isLoggedIn, login, logout, isLoginChecked } = useAuth();
  const {showToast} = useToast();
  const [currentAccount, setCurrentAccount] = useState("");
  const [isCurrentUserCreator, setIsCurrentUserCreator] = useState(false);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [readOnlyContract, setReadOnlyContract] = useState(null);

  const CONTRACT_ADDRESS = GUESTBOOK_ADDRESS;
  const CONTRACT_ABI = abi;

  const dataRef = useRef({currentAccount});
  dataRef.current = {currentAccount};

  const fetchCreatorsAndStatus = async (addr, accounts, readContract) => {
    try {
      const result = await getCreators(addr[0], true); 
      if (!result || !result?.creators || result?.creators?.length === 0) {
        console.warn("No creator data returned, treating as non-creator");
        // setCreatorList([]);
        setIsCurrentUserCreator(false);
        return;
      }
      const isCreator = result?.creators && result?.creators[0].isCreator;
      setIsCurrentUserCreator(isCreator);
    } catch (err) {
      console.error("Failed to fetch creator info", err);
      setIsCurrentUserCreator(false);
    }
  };
  

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      const writeContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const readContract = writeContract.connect(browserProvider);

      setProvider(browserProvider);
      setSigner(signer);
      setContract(writeContract);
      setReadOnlyContract(readContract);
      setCurrentAccount(address);

      await fetchCreatorsAndStatus([address], [address], readContract);

      await logout();
      await login(signer, address); // trigger login on new connection
    } catch(err) {
      console.log(err, err.message)
      showToast("Failed to connect account.", 'error');
    }
  };

  useEffect(() => {
    if (!isLoginChecked) return; // only run setup once login check is confirmed
  
    if (!window.ethereum) return;
  
    const setup = async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum, "any");
        setProvider(browserProvider);
  
        const accounts = await browserProvider.send("eth_accounts", []);
        console.log("accounts lenght", accounts.length);
        if (accounts.length === 0) {
          setCurrentAccount("");
          // setCreatorList([]);
          setIsCurrentUserCreator(false);
          return;
        }
  
        const addr = accounts[0];
        const signer = await browserProvider.getSigner();
        const writeContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const readContract = writeContract.connect(browserProvider);
  
        setSigner(signer);
        setContract(writeContract);
        setReadOnlyContract(readContract);
  
        const previousAccount = addr;
        // console.log("Current", dataRef.current.currentAccount, "Previous", previousAccount);
        if ((dataRef.current?.currentAccount.toLowerCase() !== previousAccount?.toLowerCase()) || !isLoggedIn) {
          if (dataRef.current?.currentAccount && (dataRef.current?.currentAccount.toLowerCase() !== previousAccount?.toLowerCase())) {
            showToast("Account Changed, Reconnecting Wallet..", 'info');
            await logout(); // logout old session
            await login(signer, addr); // login new session
          }

          if(!isLoggedIn) {
            console.log("Logging in with wallet", addr);
            await login(signer, addr);
          }
        }
  
        setCurrentAccount(addr);
        await fetchCreatorsAndStatus([addr], accounts, readContract);
      } catch (err) {
        console.error("Wallet setup failed", err);
      }
    };
  
    setup();
  
    window.ethereum.on("accountsChanged", setup);
    window.ethereum.on("chainChanged", () => window.location.reload());
  
    return () => {
      window.ethereum.removeListener("accountsChanged", setup);
      window.ethereum.removeListener("chainChanged", () => window.location.reload());
    };
  }, [isLoginChecked]);

  return (
    <WalletContext.Provider
      value={{
        currentAccount,
        isCurrentUserCreator,
        contract,
        signer,
        readOnlyContract,
        provider,
        connectWallet,
        fetchCreatorsAndStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
