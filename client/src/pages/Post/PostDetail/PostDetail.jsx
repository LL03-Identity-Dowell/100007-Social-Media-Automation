import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PostDetail({ show }) {
    useEffect(() => {
        show()
    }, [])

    return (

        <div className="m-4">

            <div class="flex flex-row-reverse">
                <button
                    id="dropdownDefaultButton"
                    data-dropdown-toggle="dropdown"
                    className="text-white bg-transparent hover:bg-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#1B3474" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </button>
                <div
                    id="dropdown"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-0"
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Edit Post
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Save Post
                            </Link>
                        </li>
                        <li>
                            <Link to="/earnings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Delete Post
                            </Link>
                        </li>
                        <li>
                            <Link to="/sign-out" className="block px-4 py-2 hover-bg-gray-100 dark:hover-bg-gray-600 dark:hover-text-white">
                                Copy Post
                            </Link>
                        </li>
                    </ul>
                </div>
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

            <div className="flex flex-col lg:flex-row md:flex-row items-center lg:gap-24">
                <div className="m-3 relative image-container">
                    <div className="img-overlay">
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

                <div className="post-options">
                    <div >
                        <label htmlFor="content" className="block">
                            <strong>Qualitative categorization:</strong>
                        </label>
                        <select name="qualitative_categorization" className="mb-4">
                            <option value="category">category</option>
                        </select>
                    </div>

                    <div >
                        <label htmlFor="brand" className="block">
                            <strong>Targeted for:</strong>
                        </label>
                        <select id="brand" name="targeted_for" className="mb-4">
                            <option value="Apple-Technology">Apple-Technology</option>
                        </select>
                    </div>

                    <div >
                        <label htmlFor="channel" className="block">
                            <strong>Designed for:</strong>
                        </label>
                        <select id="channel" name="designed_for" className="mb-4">
                            <option value="Twitter-uxlivinglab">Twitter-uxlivinglab</option>
                        </select>
                    </div>

                    <div >
                        <label htmlFor="channelbrand" className="block">
                            <strong>Targeted category:</strong>
                        </label>
                        <select id="channelbrand" name="targeted_category" className="mb-4">
                            <option value="Brand">Brand</option>
                        </select>
                    </div>
                </div>

            </div>




        </div>


    )
}

export default PostDetail