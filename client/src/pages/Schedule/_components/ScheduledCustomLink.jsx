import {Link} from "react-router-dom";
import {twMerge} from "tailwind-merge";

export const ScheduledCustomLink = ({children, to, pathname}) => {
    return (
        <Link
            className={twMerge(
                "text-[#34495e] text-3xl font-bold hover:text-customBlue",
                pathname === to.split("/")[1] && "text-customBlue underline"
            )}
            to={to}
        >
            {children}
        </Link>
    );
};
