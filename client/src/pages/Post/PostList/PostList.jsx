import React, { useEffect, useState } from 'react'

import ExtraSmallBtn from '../../../components/ExtraSmallBtn/ExtraSmallBtn';

function PostList({ show }) {
    useEffect(() => {
        show()
    }, [])

    return (
        <div className="relative h-[90vh] lg:h-auto overflow-y-hidden">
            <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
                <h1 className="text-3xl md:text-4xl">Posts List</h1>
            </div>
            <p className="px-6 py-3 italic">Total posts count: 24</p>
            <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                <div className="text-sm text-gray-900 uppercase dark:text-gray-400">
                    <div className='lg:grid grid-cols-5 hidden'>
                        <span scope="col" className="px-6 py-3 col-span-2">
                            Post Title
                        </span>
                        <span scope="col" className="px-6 py-3 col-span-2">
                            Post Content
                        </span>
                        <span scope="col" className="px-6 py-3 col-span-1">
                            Actions
                        </span>
                        {/* <th scope="col" className="px-6 py-3">
                            Price
                        </th> */}
                    </div>
                </div>
                <div className='overflow-y-scroll h-[70vh] lg:h-auto'>
                    <div className=" dark:bg-gray-800 grid lg:grid-cols-5">
                        <div scope="row" className="lg:col-span-2 lg:px-6 px-2 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </div>
                        <div className="lg:col-span-2 lg:px-6 lg:py-4 px-2 text-sm">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </div>
                        <div className="lg:col-span-1 lg:px-6 px-2 py-4">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>
                    <div className=" dark:bg-gray-800 grid lg:grid-cols-5">
                        <div scope="row" className="lg:col-span-2 lg:px-6 px-2 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </div>
                        <div className="lg:col-span-2 lg:px-6 lg:py-4 px-2 text-sm">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </div>
                        <div className="lg:col-span-1 lg:px-6 px-2 py-4">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>
                    <div className=" dark:bg-gray-800 grid lg:grid-cols-5">
                        <div scope="row" className="lg:col-span-2 lg:px-6 px-2 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </div>
                        <div className="lg:col-span-2 lg:px-6 lg:py-4 px-2 text-sm">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </div>
                        <div className="lg:col-span-1 lg:px-6 px-2 py-4">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>
                    
                    
                </div>
            <div className="flex justify-center mb-5 lg:mt-3">
                <nav aria-label="Page navigation example">
                    <ul class="inline-flex -space-x-px font-normal">
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-800 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                        </li>
                        <li>
                            <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-white border border-gray-300 bg-customBlue hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            </div>


        </div>
    );
}

export default PostList
