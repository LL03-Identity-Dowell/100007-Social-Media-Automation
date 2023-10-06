import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import Searchbar from '../Searchbar/Searchbar';
import { logoImage, profile } from '../../assets';

function Navbar() {
    return (
        <nav className="bg-customBlue text-white dark:bg-gray-900  w-full sticky top-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center">
                    {/* <img src={logoImage} className="h-8 mr-3" alt="Dowell Logo" /> */}
                    <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white" title='Vist Home'>Samanta</span>
                </Link>
                <div className="flex md:order-2">
                    <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>

                    <div className="relative hidden md:block">
                        <Searchbar />
                    </div>

                    <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false" >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                    <div className="relative mt-3 md:hidden">
                        <Searchbar />
                    </div>
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg text-white md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link to="/" className="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" title='Vist Home'>Home</Link>
                        </li>

                        {/* Stats Dropdown menu */}
                        <li>
                            <button id="dropdownNavbarLink" data-dropdown-toggle="statsDropdown" className="flex items-center justify-between w-full py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">My stats<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg></button>
                            {/* Dropdown */}
                            <div id="statsDropdown" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                                    <li>
                                        <Link to="/statistics/my-plan" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" title='View Plan'>My Plan</Link>
                                    </li>
                                    <li>
                                        <Link to="/statistics/my-team" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" title='View Team'>My Team</Link>
                                    </li>
                                    <li>
                                        <Link to="/statistics/my-usage" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" title='View Usage'>My Usage</Link>
                                    </li>
                                </ul>
                                {/* <div className="py-1">
                                    <Link to="/sign-out" className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Sign out</Link>
                                </div> */}
                            </div>

                        </li>

                        <li>
                            <Link to="/client-admin" className="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent dark-border-gray-700">Client Admin</Link>
                        </li>

                        {/* Settings Dropdown Menu*/}
                        <li>
                            <button id="dropdownNavbarLink" data-dropdown-toggle="settingsDropdown" className="flex items-center justify-between w-full py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Settings<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg></button>
                            {/* Dropdown */}
                            <div id="settingsDropdown" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                                    <li>
                                        <Link to="/hashtags-mentions" className="block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">Hashtags & Mentions</Link>
                                    </li>
                                    <li>
                                        <Link to="/hashtags-mentions" className="block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">Categories & Topic</Link>
                                    </li>

                                </ul>
                                <div className="py-1">
                                    <Link to="/user-settings" className="block px-4 py-2 text-sm text-gray-700 hover-bg-gray-100 dark:hover-bg-gray-600 dark:text-gray-400 dark:hover-text-white">User Settings</Link>
                                </div>
                            </div>

                        </li>

                        <li>
                            {/* profile pic  */}

                            <button data-tooltip-target="user-tooltip" data-tooltip-placement="left" type="button" className="flex mr-3 text-sm bg-white rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark-focus-ring-gray-600 relative " id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="right">
                                <span className="sr-only">Open user menu</span>
                                <FaUser title='User Profile' className="w-8 h-8 rounded-full text-customBlue p-1"/>
                                <svg className="w-2.5 h-2.5 ml-2.5 absolute -right-4 top-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                            </button>

                            <div id="user-tooltip" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-tooltipsm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                User profile
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>

                            {/* Dropdown menu */}
                            <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-customBlue hover:text-customGray">User Name</span>
                                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400 hover:text-customGray">name@mail.com</span>
                                </div>
                                <ul className="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <Link to="/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-customGray dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">User Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/address" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Address</Link>
                                    </li>
                                    <li>
                                        <Link to="/reset-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Reset password</Link>
                                    </li>
                                </ul>
                                <div>
                                    <Link to="/sign-out" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</Link>
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
