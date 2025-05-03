import React, { useState } from "react";
import { ShieldCheckIcon, XIcon } from "@heroicons/react/solid";
import Modal from "./ui/Modal";

export default function ApproveTokenModal({
  isOpen,
  onClose,
  onProceed,
  contractAddress,
  approvalAmount
}) {
  const [customAmount, setCustomAmount] = useState(100);
  const [error, setError] = useState("");

  const handleProceed = () => {
    const parsed = Number(customAmount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid positive number.");
      return;
    }
    onProceed(parsed); // pass the updated value
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Approve FAN Token Transfer
          </h2>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p>
          To send FAN tokens, your wallet must first approve our platform smart contract to transfer tokens on your behalf.
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>This is a standard ERC-20 step for token-based platforms.</li>
          <li>You retain full control — we cannot access your wallet or other assets.</li>
          <li>Only FAN tokens can be transferred by our contract.</li>
          <li>Approval can be revoked anytime in your wallet settings.</li>
          <li>For your convenience, we default the approval to 100 FAN tokens to minimize repeated wallet approvals and gas fees. You can adjust this amount as needed.</li>
        </ul>

        <div className="mt-3 space-y-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            Set approval amount (FAN tokens):
          </label>
            <input
              type="number"
              min={approvalAmount}
              step="1"
              className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setError("");
              }}
            />
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
            Smart Contract: <span className="font-mono">{contractAddress}</span>
          </p>
        </div>

        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <a
            href="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#transferfrom"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            • What is ERC-20 approve?
          </a>
          <br />
          <a
            href="https://support.metamask.io/more-web3/learn/how-to-revoke-smart-contract-allowances-token-approvals/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            • How to revoke approvals later
          </a>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleProceed}
        >
          I Understand, Proceed
        </button>
      </div>
    </Modal>
  );
}
