// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchNonce, getMe, loggingOut, verifyUser } from "../data/fetchData";
import { useToast } from "./ToastContext";
import ConfirmDialogOneBtn from "../components/ui/ConfirmDialogOneBtn";
// import { useWallet } from "./WalletContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // const [authToken, setAuthToken] = useState(null);
  const firstLoad = useRef();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const { showToast } = useToast();

  const initUser = async () => {
    try {
      const profile = await getMe();
      if (profile?.accountId) {
        setUserProfile(profile);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.warn("Silent fail on getMe()", err);
    } finally {
      console.log("Login check done");
      setIsLoginChecked(true);
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  const login = async (signer, currentAccount) => {
    try {
      if (!signer || !currentAccount) throw new Error("Wallet not connected");

      const { nonce } = await fetchNonce(currentAccount);
      // alert("Please confirm signin in your wallet");
      // showToast("Please confirm signature request in your wallet to connect, waiting...", 'warning', 10000);
      setShowSignatureModal(true);
      const signature = await signer.signMessage(nonce);
      setShowSignatureModal(false);
      const response = await verifyUser(currentAccount, signature, nonce);
      const profile = await getMe();
      if (profile?.accountId) {
        setUserProfile(profile);
      } else {
        setUserProfile(response);
      }
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = async () => {
    await loggingOut();
    setUserProfile(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userProfile, isLoginChecked, initUser }}>
      {children}
      <ConfirmDialogOneBtn
        message="Please confirm signature request in your wallet to connect, waiting..."
        isOpen={showSignatureModal}
        onCancel={() => setShowSignatureModal(false)}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
