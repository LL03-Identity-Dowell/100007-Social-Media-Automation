// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ErrorMessages, SuccessMessages } from "../../components/Messages";
// import Loading from "../../components/Loading";
import { useEffect } from "react";
import { MdArrowLeft, MdDelete } from "react-icons/md";
import CommentPostedTo from "./utils/CommentPostedTo";
// import CommentItem from "./_components/CommentItem";
// import {
//   facebook,
//   instagram,
//   linkedin,
//   pinterest,
//   xTwitter,
// } from "../../assets";

function ViewCommentTemplate({ show }) {
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [hasComment, setHasComments] = useState(false);

  // const [comments, setComments] = useState({});

  // const { id } = useParams();
  // const nav = useNavigate();

  // const parsedDatetime = comments?.nextUpdateTwitter;
  // const datetime = new Date(parsedDatetime);
  // const options = {
  //   year: "numeric",
  //   month: "numeric",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  //   hour12: false,
  // };
  // const humanReadableDatetime = datetime.toLocaleString(datetime, options);

  // console.log({ humanReadableDatetime, parsedDatetime, datetime });

  useEffect(() => {
    show();
  }, []);

  // useEffect(() => {
  //   const socialMediaKeys = Object.keys(comments).filter((key) =>
  //     Array.isArray(comments[key])
  //   );

  //   const hasComments = socialMediaKeys.some((key) => comments[key].length > 0);
  //   setHasComments(hasComments);
  // }, [comments]);

  // useEffect(() => {
  //   setLoading(true);

  //   const fetchComments = async () => {
  //     const url = `${
  //       import.meta.env.VITE_APP_BASEURL
  //     }/comments/get-post-comments/${id}/`;
  //     await axios
  //       .get(url, {
  //         withCredentials: true,
  //       })
  //       .then((response) => {
  //         const { data } = response;

  //         if (data.status === "error") {
  //           setError("The  post does not have aryshare ID");
  //           setSuccess("");
  //         } else {
  //           setSuccess("Comments fetched successfully");
  //           setError("");
  //         }
  //         setComments(data);
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //         setError(error?.response?.data?.platforms.join(", "));
  //         setSuccess("");
  //       });
  //     setLoading(false);
  //   };
  //   fetchComments();
  // }, [id]);

  // const handleDelete = async (commentId, platform) => {
  //   setLoading(true);
  //   setError("");
  //   setSuccess("");
  //   const body = {
  //     comment_id: commentId,
  //     platform,
  //   };
  //   const url = `${import.meta.env.VITE_APP_BASEURL}/comments/delete-comment/${id}/`;
  //   await axios
  //     .post(url, body, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       if (response.statusText === "OK") {
  //         console.log("Hitt");
  //         setSuccess("Comment deleted successfully.");
  //         setError("");
  //       }
  //     })
  //     .catch(() => {
  //       setError(error?.response?.data?.platforms.join(", "));
  //       setSuccess("");
  //     });
  //   setLoading(false);
  // };

  return (
    <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto'>
      {/* {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />} */}

      <div className='w-[90%] m-auto p-4  text-left text-gray-500 dark:text-gray-400 '>
        <h1 className='text-3xl text-center md:text-4xl text-customTextBlue'>
          Comments
        </h1>
        <button
          // onClick={() => nav(-1)}
          className='cursor-pointer text-[15px] flex gap-2 items-center bg-customBlue hover:bg-customTextBlue text-white  py-1 px-4 rounded-lg max-w-max'
        >
          <MdArrowLeft />
          Go back
        </button>

        {/* {parsedDatetime && ( */}
        <div className='text-center text-sm font-bold text-rose-500 flex justify-center items-center text-balance'>
          Please wait for the next update: Invalid Date
          {/* {humanReadableDatetime} */}
        </div>
        {/* )} */}
        {/* {hasComment ? ( */}
        <div className='flex w-full mt-12 gap-x-20'>
          <ul className='flex flex-col w-4/5 gap-y-6'>
            <li className='w-full p-2'>
              <div className='flex gap-x-4'>
                <div className='size-10 rounded-full mt-2 bg-gray-800 shrink-0' />
                <p className='line-clamp-3 shrink'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
                  similique animi! Ab id placeat perspiciatis! Quis perferendis
                  illum eum! Deleniti, alias. Atque, consequatur suscipit
                  distinctio delectus ratione pariatur ad praesentium obcaecati
                  tempore quod quibusdam, ex enim aperiam nostrum. Provident
                  odit veritatis soluta quisquam unde quas minima nam aliquam
                  placeat inventore.
                </p>
              </div>
              <div className='w-full flex justify-around ml-3 mt-6'>
                <p className='text-sm'>February 29, 2024 at 10:15:41 AM</p>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <button className='flex items-center gap-x-1 bg-red-600 rounded-md p-1 pr-2 cursor-pointer'>
                  <MdDelete className='text-white' />
                  <span className='text-xs text-white'>Delete</span>
                </button>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <CommentPostedTo />
              </div>
            </li>
            <li className='w-full p-2'>
              <div className='flex gap-x-4'>
                <div className='size-10 rounded-full mt-2 bg-gray-800 shrink-0' />
                <p className='line-clamp-3 shrink'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
                  similique animi! Ab id placeat perspiciatis! Quis perferendis
                  illum eum! Deleniti, alias. Atque, consequatur suscipit
                  distinctio delectus ratione pariatur ad praesentium obcaecati
                  tempore quod quibusdam, ex enim aperiam nostrum. Provident
                  odit veritatis soluta quisquam unde quas minima nam aliquam
                  placeat inventore.
                </p>
              </div>
              <div className='w-full flex justify-around ml-3 mt-6'>
                <p className='text-sm'>February 29, 2024 at 10:15:41 AM</p>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <button className='flex items-center gap-x-1 bg-red-600 rounded-md p-1 pr-2 cursor-pointer'>
                  <MdDelete className='text-white' />
                  <span className='text-xs text-white'>Delete</span>
                </button>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <CommentPostedTo />
              </div>
            </li>
            <li className='w-full p-2'>
              <div className='flex gap-x-4'>
                <div className='size-10 rounded-full mt-2 bg-gray-800 shrink-0' />
                <p className='line-clamp-3 shrink'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
                  similique animi! Ab id placeat perspiciatis! Quis perferendis
                  illum eum! Deleniti, alias. Atque, consequatur suscipit
                  distinctio delectus ratione pariatur ad praesentium obcaecati
                  tempore quod quibusdam, ex enim aperiam nostrum. Provident
                  odit veritatis soluta quisquam unde quas minima nam aliquam
                  placeat inventore.
                </p>
              </div>
              <div className='w-full flex justify-around ml-3 mt-6'>
                <p className='text-sm'>February 29, 2024 at 10:15:41 AM</p>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <button className='flex items-center gap-x-1 bg-red-600 rounded-md p-1 pr-2 cursor-pointer'>
                  <MdDelete className='text-white' />
                  <span className='text-xs text-white'>Delete</span>
                </button>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <CommentPostedTo />
              </div>
            </li>
            <li className='w-full p-2'>
              <div className='flex gap-x-4'>
                <div className='size-10 rounded-full mt-2 bg-gray-800 shrink-0' />
                <p className='line-clamp-3 shrink'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
                  similique animi! Ab id placeat perspiciatis! Quis perferendis
                  illum eum! Deleniti, alias. Atque, consequatur suscipit
                  distinctio delectus ratione pariatur ad praesentium obcaecati
                  tempore quod quibusdam, ex enim aperiam nostrum. Provident
                  odit veritatis soluta quisquam unde quas minima nam aliquam
                  placeat inventore.
                </p>
              </div>
              <div className='w-full flex justify-around ml-3 mt-6'>
                <p className='text-sm'>February 29, 2024 at 10:15:41 AM</p>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <button className='flex items-center gap-x-1 bg-red-600 rounded-md p-1 pr-2 cursor-pointer'>
                  <MdDelete className='text-white' />
                  <span className='text-xs text-white'>Delete</span>
                </button>
                <hr className='w-0.5 h-6 bg-gray-400' />
                <CommentPostedTo />
              </div>
            </li>
          </ul>
          <ul className='w-1/5 flex justify-center flex-col pl-8 bg-customTextBlue rounded-lg h-24'>
            <li className='font-semibold text-white/80'>
              Followers <span className='ml-2'>10</span>
            </li>
            <li className='font-semibold text-white/80'>
              Following <span className='ml-2'>200</span>
            </li>
          </ul>
        </div>
        {/* ) : (
          !loading &&
          error && (
            <div className='text-center text-4xl font-bold text-[#333] flex justify-center items-center h-[350px] text-balance leading-10 flex-col'>
              Comments not found
            </div>
          )
        )} */}
      </div>
    </div>
  );
}

export default ViewCommentTemplate;
