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
        console.log(response.data)
        let unscheduledData = response.data.Unscheduled_Posts;
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
    <div className="px-20">
      <h3 className="text-[#495057] font-bold">
        Total posts count: {unscheduledPost.length}
      </h3>
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
              <p className="text-[#333]">{item.paragraph}</p>
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
