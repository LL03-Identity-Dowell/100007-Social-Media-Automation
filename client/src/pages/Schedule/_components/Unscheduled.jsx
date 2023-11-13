import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //Load unscheduled data from API
  const url = "http://127.0.0.1:8000/api/v1/unscheduled-json/";
  const fetchUnscheduled = async () => {
    setIsError(null);
    setIsLoading(true);
    await axios
      .get(url, {
        withCredentials: true,
      })
      .then((response) => {
        setIsLoading(false);
        let unscheduledData = response.data.Unscheduled_Posts;
        setUnscheduledPost(unscheduledData.response);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(error);
      });
  };
  useEffect(() => {
    fetchUnscheduled();
  }, []);

  const itemsPerPage = 2;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = unscheduledPost.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(unscheduledPost.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % unscheduledPost.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      {isLoading && <Loading />}
      {isError && <ErrorMessages>{isError}</ErrorMessages>}
      <div className="count-article flex justify-between pt-0 pb-2 items-center">
        <p className="px-6 py-3 italic">
          Total posts count: {unscheduledPost.length}
        </p>
      </div>
      <div>
        <div className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              {currentItems.map((item, index) => (
                <div className="article mr-2 mt-6 " key={index}>
                  <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold lg:w-[1000px]">
                    {item.title}
                  </p>

                  <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                    <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg line-clamp-4 leading-loose lg:w-[1000px]">
                      {item.paragraph}
                    </p>
                    <div className="self-end space-x-8">
                      <img
                        className="w-40 h-40  rounded-lg"
                        src={item.image}
                        alt="image"
                      />
                    </div>
                  </div>
                  <div className=" space-x-8 flex flex-col md:flex-row justify-end items-baseline py-0 pr-60">
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
              ))}
            </div>
          </div>
        </div>
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
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
    </div>
  );
};

export default UnscheduledPage;
