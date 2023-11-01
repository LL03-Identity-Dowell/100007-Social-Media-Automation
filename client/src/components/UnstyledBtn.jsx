/* eslint-disable react/prop-types */

export const UnstyledButton = ({ text, className, onClick }) => {
  const defaultClasses =
    "text-white rounded p-2";
  const combinedClasses = `${defaultClasses} ${className}`;
  return <button className={combinedClasses} onClick={onClick}>{text}</button>;
};
