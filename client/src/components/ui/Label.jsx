import clsx from "clsx";

const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={clsx("block text-sm font-bold mb-1", className)}
  >
    {children}
  </label>
);

export default Label;
