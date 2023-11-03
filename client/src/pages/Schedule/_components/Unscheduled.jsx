import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  SocialComponentForPost,
  SocialComponentForSchedule,
} from "./SocialComponent";

import Pagination from "../../../components/Pagination";
import ReactPaginate from "react-paginate";

const UnscheduledPage = () => {
  const [unscheduledPost, setUnscheduledPost] = useState([]);

  //Load unscheduled data from API
  const url = "http://127.0.0.1:8000/api/v1/unscheduled-json/";
  const fetchUnscheduled = async () => {
    await axios
      .get(url, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        let unscheduledData = response.data.Unscheduled_Posts;
        console.log(unscheduledData);
        setUnscheduledPost(unscheduledData.response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchUnscheduled();
  }, []);

  //handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = 4;
  const lastIndex = currentPage * pageCount;
  const firstIndex = lastIndex - pageCount;
  const currentPost = unscheduledPost.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(unscheduledPost.length / pageCount);
  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  //Select page number to navigate to the page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      
      <div className="count-article flex justify-between pt-0 pb-2 items-center">
        <p className="px-6 py-3 italic">Total posts count: {unscheduledPost.length}</p>
      </div>
      {/* <div>
        <div className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              {postData &&
                postData.map((post, index) => (
                  <div className="article mr-2 mt-6 " key={index}>
                    
                    <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold lg:w-[1000px]">
                      {post.title}
                    </p>

                    <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                      <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg line-clamp-4 leading-loose lg:w-[1000px]">
                        {post.paragraph}
                      </p>

                      <div className="lg:w-[150px] lg:pt-2 flex justify-end md:mr-6 mt-2 md:mt-0">

                        <ExtraSmallBtn title={"View Post"} onClick={() => handlePostdetailNavigate(post.post_id, post.title, post.paragraph, post.source)} />

                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

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
        
      </div> */}
      <ul className="space-y-10 ">
        {currentPost.map((item) => (
          <li
            id={item.PK}
            key={item.PK}
            className="flex justify-between gap-x-14"
          >
            <div className="flex flex-col w-9/12 gap-y-7 ">
              <span className="text-base text-[#0000007c]">{item.source}</span>
              <h3 className="text-2xl font-bold text-customTextBlue">
                {item.title}
              </h3>
              <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg line-clamp-4 leading-loose lg:w-[1000px]">
                  {item.paragraph}
                </p>
              </div>

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
        <Pagination
          pageCount={pageCount}
          totalPage={unscheduledPost.length}
          currentPage={currentPage}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </ul>
    </div>
  );
};

export default UnscheduledPage;
