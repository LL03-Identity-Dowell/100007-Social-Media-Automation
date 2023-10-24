import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import { UnstyledButton } from '../../../components/UnstyledBtn';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function PostDetail({ show }) {

    useEffect(() => {
        show()
    }, [])

    const [editing, setEditing] = useState(false);

    const editPost = () => {
        setEditing(true);
    };

    const savePost = () => {
        setEditing(false);
    };

    const imgOverlayClassName = `img-overlay ${editing ? 'show-overlay' : ''}`;

    return (

        <div className="m-4 lg:m-8">

            <div className="flex flex-row-reverse">

                {/* Dropdown menu */}
                <Menu as="div" className="relative inline-block text-left">

                    <div>
                        <Menu.Button
                            id="dropdownDefaultButton"
                            data-dropdown-toggle="dropdown"
                            className="text-white bg-transparent hover:bg-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#1B3474" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                            onClick={editPost}
                                        >
                                            Edit Post
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                            onClick={savePost}
                                        >
                                            Save Post
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Delete Post
                                        </a>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type="submit"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block w-full px-4 py-2 text-left text-sm'
                                            )}
                                        >
                                            Copy Post
                                        </button>
                                    )}
                                </Menu.Item>

                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>


            </div>

            <div id="post-title" className="text-lg font-bold mb-2 md:mb-0">
                The inform documentation was informed by the Livinglab.
            </div>

            <hr className="my-4" />

            <div id="post-paragraphs" className="mt-4 md:mt-8">
                <div className="post-paragraph text-base">
                    The Livinglab is an innovative research and development laboratory that focuses on the use of technology to improve the quality of life. The Livinglab has recently released a new document that discusses the use of technology in the industry. This document, entitled “The Inform Documentation”, provides an in-depth look at how technology can be used in the industry to improve efficiency and productivity.
                </div>
                <div className="post-paragraph text-base">
                    The Livinglab is an innovative research and development laboratory that focuses on the use of technology to improve the quality of life. The Livinglab has recently released a new document that discusses the use of technology in the industry. This document, entitled “The Inform.
                </div>
                <div className="post-paragraph text-base">
                    The Livinglab is an innovative research and development laboratory that focuses on the use of technology to improve the quality of life. The Livinglab has recently released a new document that discusses the use of technology in the industry. This document, entitled “The Inform Documentation”, provides an in-depth look at how technology can be used in the industry to improve efficiency and productivity.
                </div>
                <div className="post-paragraph text-base">
                    The Livinglab is an innovative research and development laboratory that focuses on the use of technology to improve the quality of life. The Livinglab has recently released a new document that discusses the use of technology in the industry. This document, entitled “The Inform Documentation”.
                </div>
            </div>

            <hr className="my-4" />

            <div id="post-sources" className="mt-4 md:mt-8">
                <Link to="https://openai.com" className="post-source text-blue-500 hover:underline">
                    https://openai.com
                </Link>
            </div>

            <hr className="my-4" />

            <div className="flex flex-col lg:flex-row md:flex-row md:gap-20 lg:gap-24">
                <div className="m-3 relative image-container">
                    <div className={imgOverlayClassName}>
                        <button
                            type="button"
                            className="open_search glass-button absolute top-0 right-0"
                            data-bs-toggle="modal"
                            data-bs-target="#largeModal"
                        >
                            <a className="no-underline">Edit Photo</a>
                        </button>
                    </div>
                    <img src="https://images.pexels.com/photos/261621/pexels-photo-261621.jpeg?auto=compress&cs=tinysrgb&h=350" alt="Random image" className="img-fluid post-img" />
                </div>

                <div className="post-options mt-5 flex flex-col gap-6">

                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <strong>Qualitative categorization:</strong>
                        </label>
                        <select
                            name="qualitative_categorization"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="category">category</option>
                        </select>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <strong>Targeted for:</strong>
                        </label>
                        <select
                            id="brand" name="targeted_for"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="Apple-Technology">Apple-Technology</option>
                        </select>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        <label htmlFor="channel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <strong>Designed for:</strong>
                        </label>
                        <select
                            id="channel" name="designed_for"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="Twitter-uxlivinglab">Twitter-uxlivinglab</option>
                        </select>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <strong>Targeted category:</strong>
                        </label>
                        <select
                            id="channelbrand" name="targeted_category"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="Brand">Brand</option>
                        </select>
                    </div>

                </div>

            </div>

            <hr className="my-4" />

            <div className="flex justify-around flex-col md:flex-row lg:flex-row gap-4 ">
                <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
                    <svg className="w-2.5 h-2.5 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    550 Word(s)
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
                    <svg className="w-2.5 h-2.5 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    4500 Character(s)
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
                    <svg className="w-2.5 h-2.5 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    8 Hashtag(s)
                </span>

            </div>

            <div className='mt-8 flex gap-12 justify-center'>
                <UnstyledButton text={"Back"} className="text-base font-semibold bg-customBlue w-[128px] hover:bg-blue-800" />
                <UnstyledButton text={"Next"} className="text-base font-semibold bg-customBlue w-[128px] hover:bg-blue-800" />
            </div>

        </div>


    )
}

export default PostDetail