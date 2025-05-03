import React from "react";
import Modal from "../ui/Modal";

export default function NoWalletModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-gray-800 dark:text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Wallet Required</h2>

        <p className="text-sm text-gray-600  dark:text-gray-300 mb-4 text-center">
          This feature requires a crypto wallet like MetaMask. It lets you securely connect and interact with our app.
        </p>

        <div className="text-sm text-center mb-6 font-semibold ">
          <a
            href="https://metamask.io/faqs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Learn more about wallets
          </a>
        </div>

        <div className="flex justify-end space-x-3 font-semibold ">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    </Modal>
  );
}
