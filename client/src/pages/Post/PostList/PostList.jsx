import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import ExtraSmallBtn from '../../../components/ExtraSmallBtn/ExtraSmallBtn';

function PostList({ show }) {
    useEffect(() => {
        show()
    }, [])

    return (
        <div className="relative h-[90vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
            <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
                <h1 className="text-3xl md:text-4xl">Posts List</h1>
            </div>
            <p className="px-6 py-3 italic">Total posts count: 24</p>
            <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                <div className='overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10'>
                    <div className=" dark:bg-gray-800 flex flex-col lg:flex-row  gap-4 lg:gap-8">
                        <div>
                            <h1 className=" lg:px-6 px-2 py-2 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                                The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                            </h1>
                            <p className=" lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                                Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                            </p>
                        </div>
                        <div className="lg:w-[300px] lg:pt-2">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>


                    <div className=" dark:bg-gray-800 flex flex-col lg:flex-row gap-4 lg:gap-8">
                        <div>
                            <h1 className=" lg:px-6 px-2 py-2 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                                The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                            </h1>
                            <p className=" lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                                Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                            </p>
                        </div>
                        <div className="lg:w-[300px] lg:pt-2">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>


                    <div className=" dark:bg-gray-800 flex flex-col lg:flex-row  gap-4 lg:gap-8">
                        <div>
                            <h1 className=" lg:px-6 px-2 py-2 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                                The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                            </h1>
                            <p className=" lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                                Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                            </p>
                        </div>
                        <div className="lg:w-[300px] lg:pt-2">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>


                    <div className=" dark:bg-gray-800 flex flex-col lg:flex-row  gap-4 lg:gap-8">
                        <div>
                            <h1 className=" lg:px-6 px-2 py-2 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                                The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                            </h1>
                            <p className=" lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                                Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                            </p>
                        </div>
                        <div className="lg:w-[300px] lg:pt-2">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>

                    </div>

                    <div className=" dark:bg-gray-800 flex flex-col lg:flex-row  gap-4 lg:gap-8">
                        <div>
                            <h1 className=" lg:px-6 px-2 py-2 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                                The Behavioral economics was Thing Pexels API enables programmatic access to the full Pexels content library, including photos, vid the The Pexels API enables programmatic access to the full Pexels content library
                            </h1>
                            <p className=" lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                                Behavioral Economics and the Pexels API Behavioral economics is a field of study that examines the intersection of psychology and economics. It seeks to understand why people make certain decisions, and how those decisions can be influenced by external factors.
                            </p>
                        </div>
                        <div className="lg:w-[300px] lg:pt-2">
                            <ExtraSmallBtn title={"View Post"} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mb-5 lg:mt-3">
                    <nav aria-label="Page navigation example">
                        <ul className="inline-flex -space-x-px font-normal">
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-800 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-white border border-gray-300 bg-customBlue hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
          </div>
        </div>
        <div className="flex justify-center mb-5 lg:mt-3">
          <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px font-normal">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-800 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center px-3 h-8 text-white border border-gray-300 bg-customBlue hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  5
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight  text-gray-800 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default PostList
