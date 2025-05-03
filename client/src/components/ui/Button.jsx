import React from "react";
import clsx from "clsx";

const base = "rounded px-4 py-2 font-semibold transition-colors duration-200";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
};

const sizes = {
  sm: "text-sm py-1 px-3",
  md: "text-base py-2 px-4",
  lg: "text-lg py-3 px-5",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
