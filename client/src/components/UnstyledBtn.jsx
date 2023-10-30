/* eslint-disable react/prop-types */

export const UnstyledButton = ({ text, className }) => {
  const defaultClasses =
    "text-white rounded p-2";
  const combinedClasses = `${defaultClasses} ${className}`;
  return <button className={combinedClasses}>{text}</button>;
};
