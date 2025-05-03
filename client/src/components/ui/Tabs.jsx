import clsx from "clsx";
import React from "react";

export default function Tabs({ tabs = [], selected, onSelect, className }) {
  return (
    <div className={clsx("w-full overflow-x-auto", className)}>
      <ul className="flex gap-4 min-w-full whitespace-nowrap border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => {
          const isActive = selected === tab.value;
          return (
            <li
              key={tab.value}
              onClick={() => onSelect(tab.value)}
              className={clsx(
                "pb-2 cursor-pointer text-sm sm:text-base font-medium transition-colors duration-150 flex-auto text-center font-semibold",
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-600 hover:text-black border-b-2 border-transparent dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
