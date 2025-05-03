import React from "react";
import Modal from "./Modal";

export default function ConfirmDialog({
  isOpen,
  message = "Are you sure you want to proceed?",
  onConfirm,
  onCancel,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="text-center">
        <p className="mb-6 text-gray-800 dark:text-gray-200 font-bold text-l">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-bold text-l text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-bold text-l text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
