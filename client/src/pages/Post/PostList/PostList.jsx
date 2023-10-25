import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ExtraSmallBtn from "../../../components/ExtraSmallBtn/ExtraSmallBtn";
import axios from "axios";

function PostList({ show }) {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    show();

    const apiUrl = "http://127.0.0.1:8000/api/v1/post_list/"; // Replace with your actual API URL

    // Make the API call using Axios
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        // Assuming your API response is in JSON format
        setApiData(response.data.posts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const elements = apiData?.map((item) => (
    <div className=" dark:bg-gray-800 flex flex-col lg:flex-row justify-between gap-4 lg:gap-8">
      <div>
        <h1 className=" lg:px-6 px-2 py-2 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
          {item?.title}
        </h1>

        <p className=" lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
          {item?.paragraph}
        </p>
      </div>
      <div className="lg:w-[300px] lg:pt-2 pl-2">
        <Link to="/post-detail">
          <ExtraSmallBtn title={"View Post"} />
        </Link>
      </div>
    </div>
  ));

  console.log(apiData);

  return (
    <div className="relative max-w-7xl mx-auto lg:h-auto lg:overflow-y-auto">
      <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
        <h1 className="text-3xl md:text-4xl">Posts List</h1>
      </div>

      <p className="px-6 py-3 italic">Total posts count: {apiData?.length} </p>

      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
        <div className=" lg:overflow-y-auto lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className=" dark:bg-gray-800 flex flex-col lg:flex-row justify-between gap-4 lg:gap-8">
            <div className="lg:w-[300px] lg:pt-2 pl-2">
              <Link to="/post-detail">
                <ExtraSmallBtn title={"View Post"} />
              </Link>
            </div>
          </div>
          {elements}
        </div>

        {/* Pagination */}
        <div className="flex justify-center pb-6 lg:mt-3">
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

export default PostList;
