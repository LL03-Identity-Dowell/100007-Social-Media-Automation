import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

import axios from "axios";
import { ErrorMessages } from "../../components/Messages";

function Comment({ show }) {
  const [error, setError] = useState("");

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const url = "http://127.0.0.1:8000/api/v1/comments/";
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          let data = response.data.recent_posts;
          setCommentList(data);
          console.log(data);
        })
        .catch(() => {
          setError("Server error, Please try again later");
        });
    };
    fetchComments();
  }, []);

  return (
    <>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto'>
        <div className='w-full text-sm text-left text-gray-500 dark:text-gray-400 '>
          <div className='py-2 font-semibold text-center text-customTextBlue lg:py-6'>
            <h2 className='text-3xl md:text-4xl '>Comments</h2>
          </div>
          <div className='comments'>
            {commentList.map((item) => (
              <div className='w-[90%] m-auto ' key={item.article_id}>
                <p className='px-2 py-0 font-bold lg:px-6 text-md lg:text-xl text-customTextBlue dark:text-white '>
                  {item.title}
                </p>
                <div className='flex flex-col items-baseline justify-between py-0 md:flex-row'>
                  <p className='w-full px-2 leading-loose lg:px-6 lg:pt-4 text-md lg:text-lg line-clamp-4'>
                    {item.paragraph}
                  </p>
                </div>
                <Link to={`/comment/${item.article_id}`}>
                  <div className='flex justify-end mt-2 lg:pt-2 md:mr-6 md:mt-0'>
                    <ExtraSmallBtn title={"View Comments"} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
