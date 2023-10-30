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

import dummyData from "./data";

const UnscheduledPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = 5;

  const lastIndex = currentPage * pageCount;
  const firstIndex = lastIndex - pageCount;
  const currentPost = dummyData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(dummyData.length / pageCount);

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-20">
      <h3 className="text-[#495057] font-bold">
        Total posts count: {dummyData.length}
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
          totalPage={dummyData.length}
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
