import React, { useState, useContext } from "react";
import { ModalContext } from "./ModalContext"; // use the shared context instance
import NoWalletModal from "../components/modals/NoWalletModal";
import MessageModal from "../components/modals/MessageModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ApproveTokenModal from "../components/ApprovaTokenModal";

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const showModal = (type, props = {}) => setModals((prev) => [...prev, { type, props }]);
  const hideModal = () => setModals((prev) => prev.slice(0, -1));

  const renderModal = () =>
    modals.map((modal, index) => {
      if (!modal.type) return null;
      const commonProps = { isOpen: true, onClose: hideModal, ...modal.props, };
  
      switch (modal.type) {
        case "NO_WALLET":
          return <NoWalletModal key={index} {...commonProps} />;
        case "SEND_MESSAGE":
          return <MessageModal key={index} {...commonProps} />;
        case "CONFIRM":
          return <ConfirmDialog key={index} {...commonProps} />;
        case "APPROVE_TOKEN":
          return <ApproveTokenModal key={index} {...commonProps} />;
        default:
          return null;
      }
    });  

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
