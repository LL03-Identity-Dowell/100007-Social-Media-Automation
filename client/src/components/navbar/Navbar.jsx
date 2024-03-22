import { Link } from 'react-router-dom';
import Searchbar from '../Searchbar/Searchbar';
import { FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

const rights = localStorage.getItem("rights");
function Navbar() {
  const [username, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [memberType, setMemberType] = useState();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setSecondDropdownOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.username && user.email) {
      setUserName(user.username);
      setUserEmail(user.email);
      setMemberType(user.memberType);
    }
  });

  const dowellLogoutUrl =
    'https://100014.pythonanywhere.com/sign-out?redirect_url=' +
    window.location.origin;

  const handleLogout = () => {
    localStorage.clear();
    axios
      .get(`${import.meta.env.VITE_APP_BASEURL}/logout/`, {
        withCredentials: true,
      })
      .then((res) => {})
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
    const cookies = document.cookie.split(';');
    console.log(cookies);

    for (const cookie of cookies) {
      const [name, _] = cookie.split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    window.location.replace(dowellLogoutUrl);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleToggleSecondDropdown = () => {
    setSecondDropdownOpen(!isSecondDropdownOpen);
  };

  const handleSecondLinkClick = () => {
    // Close the dropdown when a link is clicked
    setSecondDropdownOpen(false);
  };
  const handleLinkClick = () => {
    // Close the dropdown when a link is clicked
    setDropdownOpen(false);
  };

  return (
    <nav className='sticky top-0 z-20 w-full text-white border-b border-gray-200 bg-customBlue dark:bg-gray-900 dark:border-gray-600'>
      <div className='flex flex-wrap items-center justify-between w-full p-4 '>
        <Link to='/' className='flex items-center'>
          {/* <img src={logoImage} className="h-8 mr-3" alt="Dowell Logo" /> */}
          <span
            className='self-center text-2xl font-bold whitespace-nowrap dark:text-white'
            data-tooltip-target='tooltip-default'
            data-tooltip-placement='bottom'>
            <div
              id='tooltip-default'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 bg-customGray tooltip dark:bg-gray-700'>
              Vist Home
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
            Samanta
          </span>
        </Link>
        <div className='flex gap-4 md:order-2 md:pr-4 '>
          <button
            type='button'
            data-collapse-toggle='navbar-search'
            aria-controls='navbar-search'
            aria-expanded='false'
            className='md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1'>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
            <span className='sr-only'>Search</span>
          </button>

          <div className='relative hidden md:block'>
            <Searchbar />
          </div>

          <div className='relative items-center justify-center hidden md:flex group'>
            <div className='flex items-center gap-2'>
              <span className='pr-2 text-sm font-semibold text-white'>
                {username && username}
              </span>
              <div className='flex items-center'>
                <button
                  // data-tooltip-target="user-tooltip1"
                  data-tooltip-placement='left'
                  type='button'
                  className='flex mr-3 text-sm bg-white rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark-focus-ring-gray-600'
                  id='user-menu-button'
                  onClick={handleToggleDropdown}
                  aria-expanded='false'
                  // data-dropdown-toggle="user-dropdown1"
                  // data-dropdown-placement="bottom"
                >
                  <span className='sr-only'>Open user menu</span>
                  <FaUser className='w-8 h-8 p-1 rounded-full text-customBlue' />
                </button>
                <svg
                  className='w-2.5 h-2.5 ml-2.5 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 10 6'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </div>
            </div>

            {/* <div
              id="user-tooltip1"
              role="tooltip"
              className="absolute z-50 invisible inline-block px-3 py-2 font-medium bg-white rounded-lg shadow-sm opacity-0 text-tooltipsm text-customBlue tooltip dark:bg-gray-700"
            >
              User profile
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div> */}

            {/* Dropdown menu */}
            <div
              // className={` ${
              //   isDropdownOpen ? "absolute" : "hidden"
              // } z-30 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
              // style={{
              //   top: isDropdownOpen ? "calc(100% - 20px)" : "0",
              //   right: 0,
              // }}

              className='absolute z-30 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow group-hover:block top-4 -right-5 dark:bg-gray-700 dark:divide-gray-600'
              id='user-dropdown1'>
              <div className='px-4 py-3'>
                <span className='block text-sm text-gray-500 truncate dark:text-gray-400 hover:text-customGray'>
                  {userEmail}
                </span>
              </div>
              <ul className='py-2' aria-labelledby='user-menu-button'>
                <li>
                  <Link
                    to='/user-profile'
                    onClick={handleLinkClick}
                    className='block px-4 py-2 text-sm text-gray-700 whitespace-nowrap hover:bg-gray-100 hover:text-customGray dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                    User Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to='/statistics/my-plan'
                    onClick={handleLinkClick}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                    title='View Plan'>
                    My Plan
                  </Link>
                </li>
                <li>
                  <Link
                    to='/statistics/my-team'
                    onClick={handleLinkClick}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                    title='View Team'>
                    My Team
                  </Link>
                </li>
                <li>
                  <Link
                    to='/statistics/my-usage'
                    onClick={handleLinkClick}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                    title='View Usage'>
                    My Usage
                  </Link>
                </li>
                <li>
                  <Link
                    to='/address'
                    onClick={handleLinkClick}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                    Address
                  </Link>
                </li>

                {/* <li>
                  <Link
                    to='/reset-password'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                  >
                    Reset password
                  </Link>
                </li> */}
              </ul>
              <div className='w-full overflow-hidden'>
                <button
                  onClick={handleLogout}
                  className='cursor-pointer block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <button
            data-collapse-toggle='navbar-search'
            type='button'
            className='inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-search'
            // aria-expanded='false'
            aria-expanded={isDropdownOpen ? 'true' : 'false'}
            onClick={handleToggleDropdown}>
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>

        <div
          // className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
          className={`${
            isDropdownOpen ? 'block' : 'hidden'
          }  mt-2 items-center justify-between w-full md:flex md:w-auto`}
          id='navbar-search'>
          <div className='relative mt-3 md:hidden '>
            <Searchbar />
          </div>
          <ul className='flex flex-col p-4 mt-4 font-medium text-white border border-gray-100 rounded-lg md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            <li>
              <Link
                to='/'
                onClick={handleLinkClick}
                className='block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'>
                Home
              </Link>
            </li>

            {/* Stats Dropdown menu */}

            <li>
              <a
                rel='noreferrer'
                href='https://100093.pythonanywhere.com/'
                target='_blank'
                className='block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent dark-border-gray-700'>
                Client Admin
              </a>
            </li>

            {/* Settings Dropdown Menu*/}
            <li className='relative group w-[200px]'>
              <button
                id='dropdownNavbarLink'
                // data-dropdown-toggle="settingsDropdown"
                onClick={handleToggleSecondDropdown}
                aria-expanded='false'
                className='flex items-center justify-between w-full py-2 pl-3 pr-4 rounded cursor-pointer hover:bg-gray-100 md:hover:bg-transparent md:border-0 hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent'>
                User Settings
                <svg
                  className='w-2.5 h-2.5 ml-2.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 10 6'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>
              {/* Dropdown */}
              <div
                // id="settingsDropdown"
                // style={{
                //   top: isSecondDropdownOpen ? "calc(100% - 1px)" : "0",
                //   left: 0,
                // }}
                // className={` ${
                //   isSecondDropdownOpen ? "absolute" : "hidden"
                // } z-30 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 w-full`}
                className='absolute z-30 hidden w-full my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow top-4 md:top-2 group-hover:block dark:bg-gray-700 dark:divide-gray-600'>
                <ul
                  className='py-2 text-sm text-gray-700 dark:text-gray-400'
                  aria-labelledby='dropdownLargeButton'>
                  <li>
                    <Link
                      to='/settings/hastags'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Hashtags & Mentions
                    </Link>
                  </li>
                  {rights === 'Admin' && (
                    <li>
                      <Link
                        to='/portfolio'
                        onClick={() => {
                          handleSecondLinkClick();
                          handleLinkClick();
                        }}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white"
                      >
                        Portfolio Approvals
                      </Link>
                    </li>
                  )}
                  {username === "uxliveadmin" && (
                    <li>
                      <Link
                        to='/admin-approval'
                        onClick={() => {
                          handleSecondLinkClick();
                          handleLinkClick();
                        }}
                        className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                        Admin Approvals
                      </Link>
                    </li>
                  )}
                  {memberType && (
                    <li>
                      <Link
                        to="/settings/owner-portfolio"
                        onClick={() => {
                          handleSecondLinkClick();
                          handleLinkClick();
                        }}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white"
                      >
                        Connect Social Media
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to='/settings/categoriesandtopic'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Categories & Topic
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/settings/postdetaildropdowns'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Post Detail Dropdown
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/settings/upload-image'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Upload image
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/social-media-channels'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Social Media Channels
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/target-cities'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Targeted Cities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/client-profile'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      View Client's Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/user-approval'
                      onClick={() => {
                        handleSecondLinkClick();
                        handleLinkClick();
                      }}
                      className='block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white'>
                      Approval By Clients
                    </Link>
                  </li>
                </ul>
                {/* <div className="py-1">

                                    <Link to="/user-settings" className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-400 dark:hover-text-white">User Settings</Link>
                                </div> */}
              </div>
            </li>

            <li className='md:hidden '>
              {/* profile pic  */}
              <button
                data-tooltip-target='user-tooltip'
                data-tooltip-placement='right'
                type='button'
                className='relative flex mt-3 ml-3 text-sm bg-white rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark-focus-ring-gray-600 '
                id='user-menu-button'
                aria-expanded='false'
                data-dropdown-toggle='user-dropdown'
                data-dropdown-placement='bottom'>
                <span className='sr-only'>Open user menu</span>
                <FaUser className='w-8 h-8 p-1 rounded-full text-customBlue' />
                <svg
                  className='w-2.5 h-2.5 ml-2.5 absolute -right-4 top-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 10 6'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>

              <div
                id='user-tooltip'
                role='tooltip'
                className='absolute z-50 invisible inline-block px-3 py-2 font-medium bg-white rounded-lg shadow-sm opacity-0 text-tooltipsm text-customBlue tooltip dark:bg-gray-700'>
                User profile
                <div className='tooltip-arrow' data-popper-arrow></div>
              </div>

              {/* Dropdown menu */}
              <div
                className='z-30 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600'
                id='user-dropdown'>
                <div className='px-4 py-3'>
                  <span className='block text-sm text-customBlue hover:text-customGray'>
                    {username}
                  </span>
                  <span className='block text-sm text-gray-500 truncate dark:text-gray-400 hover:text-customGray'>
                    {userEmail}
                  </span>
                </div>
                <ul className='py-2' aria-labelledby='user-menu-button'>
                  <li>
                    <Link
                      to='/user-profile'
                      onClick={handleLinkClick}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-customGray dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                      User Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/statistics/my-plan'
                      onClick={handleLinkClick}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                      title='View Plan'>
                      My Plan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/statistics/my-team'
                      onClick={handleLinkClick}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                      title='View Team'>
                      My Team
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/statistics/my-usage'
                      onClick={handleLinkClick}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                      title='View Usage'>
                      My Usage
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/address'
                      onClick={handleLinkClick}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                      Addresses
                    </Link>
                  </li>

                  {/* <li>
                    <Link
                      to='/reset-password'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                    >
                      Reset password
                    </Link>
                  </li> */}
                </ul>
                <div>
                  <button
                    onClick={handleLogout}
                    className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'>
                    Sign out
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
