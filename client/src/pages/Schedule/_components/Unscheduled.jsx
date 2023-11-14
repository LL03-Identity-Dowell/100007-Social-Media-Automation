import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  SocialComponentForPost,
  SocialComponentForSchedule,
} from "./SocialComponent";

import ReactPaginate from "react-paginate";
import Loading from "../../../components/Loading";
import { ErrorMessages } from "../../../components/Messages";

const UnscheduledPage = () => {
  const [unscheduledPost, setUnscheduledPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(7);
  const [showMorePages, setShowMorePages] = useState(false);

  
  useEffect(() => {
    setLoading(true);
    //Load unscheduled data from API
    const url = `http://127.0.0.1:8000/api/v1/unscheduled-json/?page=${
      page + 1
    }&order=newest`;
    const fetchUnscheduled = async () => {
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          setError(null);
          setLoading(false);
          let unscheduledData = response.data.Unscheduled_Posts.response;
          setUnscheduledPost(unscheduledData);
          setCount(response.data.total_items);
          setPageCount(Math.ceil(response.data.total_items / perPage));
          setShowMorePages(pageCount > pagesToDisplay);
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          setLoading(false);
          setError("Server error, Please try again later");
          console.error("Error fetching article:", error);
        });
    };
    fetchUnscheduled();
  }, [page]);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}

      <h3 className="px-4 py-3 italic">
        Total posts count: {count}
      </h3>
      <ul className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:mb-10 ">
        {unscheduledPost.map((item) => (
          <li
            id={item.PK}
            key={item.PK}
            className="flex justify-between flex-col md:flex-row gap-x-14"
          >
            <div className="flex flex-col w-9/12 gap-y-7 ">
            <p className=" lg:py-4 px-2 text-md lg:text-lg">
                        {item.source}
                      </p>
                      <p className=" px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold">
                        {item.title}
                      </p>

                      <p className=" lg:pt-4 px-2 text-md lg:text-lg text-gray-600 line-clamp-4 lg:w-[920px] ">
                        {item.paragraph}
                      </p>

              <div className="self-end space-x-8">
                <Modal article={item} title="post">
                  <Dialog.Close asChild>
                    <button
                      className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                      aria-label="Close"
                    >
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                  <Dialog.Title className=" text-center text-[#1b3476] m-0 text-3xl font-semibold">
                    Where do you want to post?
                  </Dialog.Title>
                  <SocialComponentForPost article={item} />
                </Modal>
                <Modal article={item} title="schedule">
                  <Dialog.Close asChild>
                    <button
                      className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                      aria-label="Close"
                    >
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                  <Dialog.Title className=" text-center text-[#1b3476] m-0 text-3xl font-semibold">
                    Where do you want to post?
                  </Dialog.Title>
                  <SocialComponentForSchedule article={item} />
                </Modal>
              </div>
            </div>
            <img
              className="w-40 h-40 mt-20 rounded-lg"
              src={item.image}
              alt="image"
            />
          </li>
        ))}
      </ul>
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={pagesToDisplay}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          previousLabel={<span className="text-black">Previous</span>}
          nextLabel={<span className="text-black">Next</span>}
          containerClassName="flex justify-center items-center my-4 space-x-2"
          pageClassName="p-2 rounded-full cursor-pointer text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
          previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          breakClassName="p-2"
          activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 "
        />
    </div>
  );
};

export default UnscheduledPage;
