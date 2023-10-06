import { Link } from "react-router-dom";

const CustomLink = ({ children, to, title }) => {
  return (
    <Link
      className='flex flex-col items-center justify-center hover:opacity-90 hover:text-blue-600'
      to={to}
    >
      <div className=' bg-[#800080] p-2 rounded-md'>{children}</div>
      <span className='text-sm md:text-md'>{title}</span>
    </Link>
  );
};

export default CustomLink;
