import { useState } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const handleIsOpen1 = () => setIsOpen1(!isOpen1);
  const handleIsOpen2 = () => setIsOpen2(!isOpen2);

  return (
    <div className='flex items-center justify-between'>
      <nav className='w-full bg-white shadow'>
        <div className='justify-between px-4 md:items-center md:flex md:px-8'>
          <div>
            <div className='flex items-center justify-between py-3 md:py-5 md:block'>
              <Link to='/'>
                <h2 className='text-2xl font-bold text-dark'>LOGO</h2>
              </Link>
              <div className='md:hidden'>
                <button
                  className='p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border'
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 text-dark'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 text-dark'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4 6h16M4 12h16M4 18h16'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0'>
                <li className='text-dark hover:text-secondary'>
                  <Link to='/'>Home</Link>
                </li>

                <li className='relative text-dark'>
                  <span
                    className='flex items-center gap-1 cursor-pointer hover:text-secondary'
                    onClick={handleIsOpen1}
                  >
                    Our Company <MdKeyboardArrowDown className='text-xl' />
                  </span>

                  {/* first Sub menu */}
                  <span
                    className={
                      !isOpen1
                        ? "duration-300 ease-in-out opacity-0 invisible text-dark mt-2 grid absolute bg-white w-full rounded-lg px-3 gap-2 py-2 shadow-xl"
                        : "duration-300 ease-in-out opacity-1 text-dark mt-2 grid absolute z-50 border-t bg-white w-full rounded-lg px-3 gap-2 py-2 shadow-xl"
                    }
                  >
                    <Link to='about' className='hover:text-secondary'>
                      About
                    </Link>
                    <Link to='conatct' className='hover:text-secondary'>
                      Contact
                    </Link>
                  </span>
                </li>

                <li className='text-dark hover:text-secondary'>
                  <Link to='/services'>Services</Link>
                </li>

                <li className='relative text-dark'>
                  <span
                    className='flex items-center gap-1 cursor-pointer hover:text-secondary'
                    onClick={handleIsOpen2}
                  >
                    Information <MdKeyboardArrowDown className='text-xl' />
                  </span>

                  <span
                    className={
                      !isOpen2
                        ? "duration-300 ease-in-out opacity-0 invisible text-dark mt-2 grid absolute bg-white w-full rounded-lg px-3 gap-2 py-2 shadow-xl"
                        : "duration-300 ease-in-out opacity-1 text-dark mt-2 grid absolute z-50 border-t bg-white w-full rounded-lg px-3 gap-2 py-2 shadow-xl"
                    }
                  >
                    <Link to='faqs' className='hover:text-secondary'>
                      {"FAQ's"}
                    </Link>
                    <Link to='legal' className='hover:text-secondary'>
                      Legal
                    </Link>
                    <Link to='accounts' className='hover:text-secondary'>
                      Accounts
                    </Link>
                  </span>
                </li>
              </ul>

              <div className='mt-10 space-y-2 md:hidden'>
                <Link
                  to='/login'
                  className='inline-block w-full px-4 py-2 text-center rounded-md shadow text-whiteColor bg-blueColor hover:bg-primary hover:text-white'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='inline-block w-full px-4 py-2 text-center rounded-md shadow text-whiteColor bg-pinkColor hover:bg-primary hover:text-white'
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
          <div className='hidden space-x-2 md:inline-block'>
            <Link
              to='/login'
              className='px-4 py-2 rounded-md shadow text-whiteColor bg-blueColor hover:bg-pinkColor hover:text-whiteColor'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='px-4 py-2 rounded-md shadow text-whiteColor bg-pinkColor hover:bg-darkColor hover:text-white'
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
