import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { GUESTBOOK_ADDRESS } from "../constants/constants";
import { abi } from '../../../artifacts/contracts/GuestbookWithTips.sol/GuestbookWithTips.json';

const CONTRACT_ADDRESS = GUESTBOOK_ADDRESS;
const CONTRACT_ABI = abi;

export function useGuestbookContract() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [readOnlyContract, setReadOnlyContract] = useState(null);

  const init = useCallback(async () => {
    if (!window.ethereum) return;

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const readOnly = contractWithSigner.connect(browserProvider); // this is still a contract, but with provider only

    setProvider(browserProvider);
    setSigner(signer);
    setContract(contractWithSigner);
    setReadOnlyContract(readOnly);
  }, []);

  useEffect(() => {
    init(); // initial load

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", init);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", init);
      }
    };
  }, [init]);

  return { provider, signer, contract, readOnlyContract };
}
