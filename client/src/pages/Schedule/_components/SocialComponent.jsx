import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import {
  facebook,
  instagram,
  linkedin,
  pinterest,
  xTwitter,
  youtube,
} from "../../../assets";
import { checkProperty } from "./function";

export const SocialComponentForPost = ({
  article,
  setError,
  setLoading,
  setSuccessMessage,
  setOpen,
  socialArr,
}) => {
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    const paragraph = Array.isArray(article.paragraph)
      ? article.paragraph.join(" ")
      : article.paragraph;

    const editedArticle = { ...article, paragraph };

    const formData = new FormData(e.currentTarget);
    const socialArray = Array.from(formData.entries())
      .filter(([key, value]) => value === "on")
      .map(([key]) => key);

    if (socialArr.length === 0) {
      setError("No social channel linked! Please link atleast one.");
      setOpen(false);
      return;
    }
    const missingItems = socialArray.filter(
      (item) => !socialArr.includes(item)
    );

    if (missingItems.length > 0) {
      setError(`${missingItems.join(", ")} not linked`);
      return;
    }

    const filteredSocial = socialArray.filter(
      (social) => social !== "twitter" && social !== "pinterest"
    );

    const specialArray = ["twitter", "pinterest"].filter((social) =>
      socialArray.includes(social)
    );

    const mergedData = {
      ...editedArticle,
      social: filteredSocial,
      special: specialArray,
    };

    const url = `${import.meta.env.VITE_APP_BASEURL}/media_post/`;
    setLoading(true);

    await axios
      .post(url, mergedData, {
        withCredentials: true,
      })
      .then((res) => {
        const { isExist = false, data } = checkProperty(
          res?.data,
          "not_approved_channels"
        );

        if (isExist) {
          setError(`You don't have permission to post to ${data?.join(" ")}`);
          return;
        }
        setSuccessMessage("Successfully submit for post");
        setLoading(false);
        setTimeout(() => {
          navigate("/recent");
        }, 700);
      })
      .catch((error) => {
        if (error?.response?.data?.success === false) {
          setSuccessMessage(error?.response?.data?.message);
        } else {
          setError("Server error, Please try again later");
        }
        console.error("Error making posts:", error);
        setLoading(false);
      });
    setOpen(false);
  };

  return (
    <>
      <form className='form' onSubmit={onSubmit}>
        <div className='flex justify-between gap-4 mb-6'>
          <label
            htmlFor='facebook'
            className='flex flex-row-reverse items-center'
          >
            <img
              src={facebook}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-customBlue'
              alt='facebook'
            />
            <input
              name='facebook'
              className='w-3 h-3'
              type='checkbox'
              id='facebook'
            />
          </label>
          <label
            htmlFor='twitter'
            className='flex flex-row-reverse items-center'
          >
            <img
              src={xTwitter}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-black'
              alt='twitter'
            />
            <input
              name='twitter'
              className='w-3 h-3'
              type='checkbox'
              id='twitter'
            />
          </label>
          <label
            htmlFor='instagram'
            className='flex flex-row-reverse items-center'
          >
            <img
              src={instagram}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#b003c7]'
              alt='facebook'
            />
            <input
              name='instagram'
              className='w-3 h-3'
              type='checkbox'
              id='instagram'
            />
          </label>
          <label
            htmlFor='linkedin'
            className='flex flex-row-reverse items-center'
          >
            <img
              src={linkedin}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#0000ff]'
              alt='linkedin'
            />
            <input
              name='linkedin'
              className='w-3 h-3'
              type='checkbox'
              id='linkedin'
            />
          </label>

          <label
            htmlFor='youtube'
            className='flex flex-row-reverse items-center'
          >
            {/* <div className='icons8-youtube-logo md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 object-cover'></div> */}
            <img
              src={youtube}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#ae2d2d]'
              alt='pinterest'
            />
            <input
              name='youtube'
              className='w-3 h-3'
              type='checkbox'
              id='youtube'
            />
          </label>
          <label
            htmlFor='pinterest'
            className='flex flex-row-reverse items-center'
          >
            <img
              src={pinterest}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#e60023]'
              alt='pinterest'
            />
            <input
              name='pinterest'
              className='w-3 h-3'
              type='checkbox'
              id='pinterest'
            />
          </label>
        </div>
        <div className='flex justify-center mt-8'>
          <button
            type='submit'
            className='cursor-pointer text-base font-medium text-white rounded-md h-[46px] w-28 bg-customBlue hover:opacity-95 text-center'
          >
            Done
          </button>
        </div>
      </form>
    </>
  );
};

export const SocialComponentForSchedule = ({
  article,
  setError,
  setLoading,
  setSuccessMessage,
  setOpen,
  // socialArr,
}) => {
  const socialArr = ["twitter"];
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const paragraph = Array.isArray(article.paragraph)
      ? article.paragraph.join(" ")
      : article.paragraph;

    const editedArticle = { ...article, paragraph };

    const formData = new FormData(e.currentTarget);
    const socialArray = Array.from(formData.entries())
      .filter(([key, value]) => value === "on")
      .map(([key]) => key);

    if (socialArr.length === 0) {
      setError("No social channel linked! Please link atleast one.");
      setOpen(false);
      return;
    }
    const missingItems = socialArray.filter(
      (item) => !socialArr.includes(item)
    );

    if (missingItems.length > 0) {
      setError(`${missingItems.join(", ")} not linked`);
      return;
    }

    const filteredSocial = socialArray.filter(
      (social) => social !== "twitter" && social !== "pinterest"
    );

    const specialArray = ["twitter", "pinterest"].filter((social) =>
      socialArray.includes(social)
    );

    const datetimeInput = formData.get("datetime");

    const mergedData = {
      ...editedArticle,
      time: datetimeInput,
      social: filteredSocial,
      special: specialArray,
      schedule: "11/23/2023 21:27:00",
    };

    const url = `${import.meta.env.VITE_APP_BASEURL}/media_schedule/`;

    setLoading(true);

    await axios
      .post(url, mergedData, {
        withCredentials: true,
      })
      .then((res) => {
        setError(null);
        setSuccessMessage("Successfully submit for schedule");
        setLoading(false);
        setTimeout(() => {
          navigate("/unscheduled");
        }, 1000);
      })
      .catch((error) => {
        if (error?.response?.data?.success === false) {
          setSuccessMessage(error?.response?.data?.message);
        } else {
          setError("Server error, Please try again later");
        }
        console.error("Error making posts:", error);
        setLoading(false);
      });
    setOpen(false);
  };

  return (
    <>
      <form className='w-full mx-auto form' onSubmit={onSubmit}>
        <div className='flex items-center gap-4 mb-6 md:justify-between'>
          <label
            htmlFor='facebook'
            className='flex flex-row-reverse items-center w-full'
          >
            <img
              src={facebook}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-customBlue'
              alt='facebook'
            />
            <input
              name='facebook'
              className='w-3 h-3'
              type='checkbox'
              id='facebook'
            />
          </label>
          <label
            htmlFor='twitter'
            className='flex flex-row-reverse items-center w-full'
          >
            <img
              src={xTwitter}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-black'
              alt='twitter'
            />
            <input
              name='twitter'
              className='w-3 h-3'
              type='checkbox'
              id='twitter'
            />
          </label>
          <label
            htmlFor='instagram'
            className='flex flex-row-reverse items-center w-full'
          >
            <img
              src={instagram}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#b003c7]'
              alt='facebook'
            />
            <input
              name='instagram'
              className='w-3 h-3'
              type='checkbox'
              id='instagram'
            />
          </label>
          <label
            htmlFor='linkedin'
            className='flex flex-row-reverse items-center w-full'
          >
            <img
              src={linkedin}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#0000ff]'
              alt='linkedin'
            />
            <input
              name='linkedin'
              className='w-3 h-3'
              type='checkbox'
              id='linkedin'
            />
          </label>

          <label
            htmlFor='youtube'
            className='flex flex-row-reverse items-center w-full '
          >
            {/* <div className='icons8-youtube-logo md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 object-cover'></div> */}
            <img
              src={youtube}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#ae2d2d]'
              alt='pinterest'
            />
            <input
              name='youtube'
              className='w-3 h-3'
              type='checkbox'
              id='youtube'
            />
          </label>
          <label
            htmlFor='pinterest'
            className='flex flex-row-reverse items-center w-full'
          >
            <img
              src={pinterest}
              className='md:w-20 md:h-[90px] w-[50px] h-[50px] ml-1 md:p-5 p-2 rounded-2xl bg-[#e60023]'
              alt='pinterest'
            />
            <input
              name='pinterest'
              className='w-3 h-3'
              type='checkbox'
              id='pinterest'
            />
          </label>
        </div>
        <div className='flex justify-center mt-8 space-x-6'>
          <input type='datetime-local' name='datetime' />
          <Dialog.Close asChild>
            <button
              type='button'
              className='w-28 h-[46px] rounded-lg text-center text-base font-medium text-white bg-[#464646] hover:opacity-95'
            >
              Remove
            </button>
          </Dialog.Close>

          <button
            type='submit'
            className='text-base text-center font-medium text-white rounded-md h-[46px] w-28 bg-customBlue hover:opacity-95'
          >
            Done
          </button>
        </div>
      </form>
    </>
  );
};
