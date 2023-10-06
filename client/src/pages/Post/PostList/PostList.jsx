import React, { useEffect, useState } from 'react'

import ExtraSmallBtn from '../../../components/ExtraSmallBtn/ExtraSmallBtn';

function PostList({ show }) {
    useEffect(() => {
        show()
    }, [])

    return (
        <div className="relative overflow-x-auto">
            <div className="text-center text-customTextBlue font-semibold py-6">
                <h1 className="text-3xl md:text-4xl">Posts List</h1>
            </div>
            <p className="px-6 py-3 italic">Total posts count: 24</p>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-gray-900 uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Post Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Post Content
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                        {/* <th scope="col" className="px-6 py-3">
                            Price
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </th>
                        <td className="px-6 py-4 text-sm">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </td>
                        <td className="px-6 py-4">
                            <ExtraSmallBtn title={"View Post"} />
                        </td>

                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </th>
                        <td className="px-6 py-4">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </td>
                        <td className="px-6 py-4">

                            <ExtraSmallBtn title={"View Post"} />

                        </td>

                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </th>
                        <td className="px-6 py-4">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </td>
                        <td className="px-6 py-4">

                            <ExtraSmallBtn title={"View Post"} />
                        </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </th>
                        <td className="px-6 py-4">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </td>
                        <td className="px-6 py-4">

                            <ExtraSmallBtn title={"View Post"} />
                        </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium text-base text-customTextBlue  dark:text-white">
                            The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                        </th>
                        <td className="px-6 py-4">
                            Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                        </td>
                        <td className="px-6 py-4">

                            <ExtraSmallBtn title={"View Post"} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-center mb-5 mt-3">
                <nav aria-label="Page navigation example">
                    <ul class="inline-flex -space-x-px text-sm">
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-800 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                        </li>
                        <li>
                            <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>

        </div>
    );
}

export default PostList
