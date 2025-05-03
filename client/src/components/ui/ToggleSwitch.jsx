import clsx from 'clsx';
import React from 'react';

export default function ToggleSwitch({ isEnabled, onToggle, label, className }) {
  return (
    <div className={clsx("flex items-center space-x-3", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative cursor-pointer" onClick={onToggle}>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={() => {}} // prevent React warning
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition duration-200 ease-in-out ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
