import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";

import { useNavigate } from "react-router-dom";

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
    setLoading(true);
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

    const url = "http://127.0.0.1:8000/api/v1/media_post/";

    await axios
      .post(url, mergedData, {
        withCredentials: true,
      })
      .then((res) => {
        setError(null);
        setLoading(false);
        setSuccessMessage("Successfully submit for post");

        setTimeout(() => {
          navigate("/recent");
        }, 700);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error fetching article:", error);
        setSuccessMessage(null);
      });
    setOpen(false);
  };

  return (
    <>
      <form className='form' onSubmit={onSubmit}>
        <div className='flex justify-around'>
          <label
            htmlFor='facebook'
            className='flex flex-row-reverse items-center'
          >
            <img src='/facebook.svg' className='w-20 h-20' alt='facebook' />
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
              src='/square-x-twitter.svg'
              className='w-20 h-20'
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
            <img src='/instagram.svg' className='w-20 h-20' alt='facebook' />
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
            <img src='/linkedin.svg' className='w-20 h-20' alt='linkedin' />
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
            <img src='/youtube.svg' className='w-20 h-20' alt='youtube' />
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
            <img src='/pinterest.svg' className='w-20 h-20' alt='pinterest' />
            <input
              name='pinterest'
              className='w-3 h-3'
              type='checkbox'
              id='pinterest'
            />
          </label>
        </div>
        <div className='mt-[25px] flex justify-center '>
          <button
            type='submit'
            className='px-7 py-2.5 text-base font-medium text-white rounded-md bg-customBlue hover:opacity-95'
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
    setLoading(true);

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

    const url = "http://127.0.0.1:8000/api/v1/media_schedule/";

    await axios
      .post(url, mergedData, {
        withCredentials: true,
      })
      .then((res) => {
        setError(null);
        setLoading(false);
        setSuccessMessage("Successfully submit for schedule");
        console.log(res);
        setTimeout(() => {
          navigate("/unscheduled");
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error fetching article:", error);
        setSuccessMessage(null);
      });
    setOpen(false);
  };

  return (
    <>
      <form className='form' onSubmit={onSubmit}>
        <div className='flex justify-around'>
          <label
            htmlFor='facebook'
            className='flex flex-row-reverse items-center'
          >
            <img src='/facebook.svg' className='w-20 h-20' alt='facebook' />
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
              src='/square-x-twitter.svg'
              className='w-20 h-20'
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
            <img src='/instagram.svg' className='w-20 h-20' alt='facebook' />
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
            <img src='/linkedin.svg' className='w-20 h-20' alt='linkedin' />
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
            <img src='/youtube.svg' className='w-20 h-20' alt='youtube' />
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
            <img src='/pinterest.svg' className='w-20 h-20' alt='pinterest' />
            <input
              name='pinterest'
              className='w-3 h-3'
              type='checkbox'
              id='pinterest'
            />
          </label>
        </div>
        <div className='mt-[25px] flex justify-center space-x-6'>
          <input type='datetime-local' name='datetime' />
          <Dialog.Close asChild>
            <button
              type='button'
              className='px-7 py-2.5 text-base font-medium text-white rounded-md bg-[#464646] hover:opacity-95'
            >
              Remove
            </button>
          </Dialog.Close>

          <button
            type='submit'
            className='px-7 py-2.5 text-base font-medium text-white rounded-md bg-customBlue hover:opacity-95'
          >
            Done
          </button>
        </div>
      </form>
    </>
  );
};
