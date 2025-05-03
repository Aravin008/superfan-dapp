import React from "react";
import clsx from "clsx";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx(
        "w-full rounded border px-3 py-2 text-sm transition-colors resize-y",
        "border-gray-300 focus:border-black focus:outline-none bg-white",
        "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
