/* eslint-disable react/prop-types */

export const Button = ({text, className}) => {
    const defaultClasses =
        "bg-[#1434A4] text-white text-xs rounded p-2 w-[128px]";
    const combinedClasses = `${defaultClasses} ${className}`;
    return <button className={combinedClasses}>{text}</button>;
};
