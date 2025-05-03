import React from "react";
import clsx from "clsx";

const Input = React.forwardRef(
  ({ type = "text", className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          "w-full rounded border px-3 py-2 text-sm transition-colors",
          "border-gray-300 focus:border-black focus:outline-none bg-white",
          "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
