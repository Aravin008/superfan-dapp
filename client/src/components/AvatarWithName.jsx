import React from "react";
import clsx from "clsx";
import { UserIcon } from "@heroicons/react/solid"; // v1 solid icon

export default function AvatarWithName({ profile, address, handleClick, size = "md", className = "" }) {
  const avatarUrl = profile?.avatarUrl || null;
  const username = profile?.name || null;
  const displayName = username || "Anonymous";

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x...";

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",  // slightly bigger than before for clarity
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={clsx("flex items-center space-x-2 min-w-0 cursor-pointer", className)} onClick={() => handleClick(profile, address) }>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${displayName}'s avatar`}
          className={clsx("rounded-full object-cover bg-gray-100", sizeClasses[size])}
        />
      ) : (
        <div
          className={clsx(
            "rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-white",
            sizeClasses[size]
          )}
        >
          <UserIcon className={clsx("opacity-70", iconSize[size])} aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-col min-w-0 font-semibol">
        <span className="text-gray-900 dark:text-white truncate max-w-[140px]">
          {displayName}
        </span>
        {!username && (
          <span className="text-gray-400 dark:text-gray-500 text-xs truncate max-w-[140px]">
            {shortAddress}
          </span>
        )}
      </div>
    </div>
  );
}
