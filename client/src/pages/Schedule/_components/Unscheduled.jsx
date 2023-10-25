import Modal from "./Modal";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  SocialComponentForPost,
  SocialComponentForSchedule,
} from "./SocialComponent";

const UnscheduledPage = () => {
  const [apiData, setapiData] = useState([""]);

  useEffect(() => {
    // Define the API endpoint you want to fetch data from
    const apiUrl = "http://127.0.0.1:8000/api/v1/unscheduled-json/"; // Replace with your actual API URL

    // Make the API call using Axios
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        // Assuming your API response is in JSON format
        setapiData([...response.data.response]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  var elements = "";
  if (Array.isArray(apiData)) {
      elements = apiData.map((item) => (
      <li id={item.PK} key={item.PK} className="flex justify-between gap-x-14">
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
    ));
  } else {
    elements = '<h1>No Unscheduled Posts</h1>'
 }

  return (
    <div className="px-20">
      <h3 className="text-[#495057] font-bold">
        Total posts count: {apiData?.length}
      </h3>
      <ul className="space-y-10 ">
      {elements}
      </ul>
    </div>
  );
};

export default UnscheduledPage;
