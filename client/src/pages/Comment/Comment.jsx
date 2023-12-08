import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

import axios from "axios";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import CommentModal from "./_components/CommentModal";
import PostedTo from "./_components/PostedTo";
import Loading from "../../components/Loading";

function Comment({ show }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const url = "http://127.0.0.1:8000/api/v1/comments/";
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          let data = response.data.recent_posts;
          setCommentList(data);
          setSuccess("successfully fetch the comments");
          setError("");
        })
        .catch(() => {
          setError("Server error, Please try again later");
          setSuccess("");
        });
      setLoading(false);
    };
    fetchComments();
  }, []);

  return (
    <>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />}
      <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto'>
        <div className='w-full text-sm text-left text-gray-500 dark:text-gray-400 '>
          <div className='py-2 font-semibold text-center text-customTextBlue lg:py-6'>
            <h2 className='text-3xl md:text-4xl '>Comments</h2>
          </div>
          <ul className='space-y-12'>
            {commentList.map((item) => (
              <li className='w-[90%] m-auto list-none' key={item.article_id}>
                <div className='flex items-center justify-between'>
                  <p className='px-2 py-0 font-bold lg:px-6 text-md lg:text-xl text-customTextBlue dark:text-white '>
                    {item.title}
                  </p>
                  <PostedTo socials={item?.post_response?.posts[0]?.postIds} />
                </div>
                <div className='flex flex-col items-baseline justify-between py-0 md:flex-row'>
                  <p className='w-full px-2 leading-loose lg:px-6 lg:pt-4 text-md lg:text-lg line-clamp-4'>
                    {item.paragraph}
                  </p>
                </div>

                <div className='flex justify-end gap-8 mt-2 lg:pt-2 md:mr-6 md:mt-4'>
                  <CommentModal
                    id={item.article_id}
                    socials={item?.post_response?.posts[0]?.postIds}
                    setError={setError}
                    setSuccess={setSuccess}
                    setLoading={setLoading}
                  />
                  <Link to={`/comment/${item.article_id}`}>
                    <ExtraSmallBtn title={"View Comments"} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Comment;
