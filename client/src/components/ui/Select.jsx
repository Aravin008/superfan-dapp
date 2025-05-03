import React from "react";
import clsx from "clsx";

export default function Select({
  id,
  value,
  onChange,
  children,
  className = "",
  ...props
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={clsx(
        "w-full rounded border px-3 py-2 text-sm transition-colors",
        "border-gray-300 focus:border-black focus:outline-none bg-white",
        "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
