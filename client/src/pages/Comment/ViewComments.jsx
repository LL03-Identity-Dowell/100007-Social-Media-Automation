import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";
import { getDate } from "./utils/getDate";
function ViewComments({ show }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasComment, setHasComments] = useState(false);

  const [comments, setComments] = useState({});

  const { id } = useParams();

  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    const socialMediaKeys = Object.keys(comments).filter((key) =>
      Array.isArray(comments[key])
    );

    const hasComments = socialMediaKeys.some((key) => comments[key].length > 0);
    setHasComments(hasComments);
  }, [comments]);
  useEffect(() => {
    setLoading(true);

    const fetchComments = async () => {
      const url = `http://127.0.0.1:8000/api/v1/comments/get-post-comments/${id}/`;
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          const { data } = response;

          if (data.status !== "error") {
            setComments(data);
            setSuccess("Comments fetched successfully");
            setError("");
          } else {
            setError(data.message.split(".")[0]);
            setSuccess("");
          }
        })
        .catch(() => {
          setError(error?.response?.data?.platforms.join(", "));
          setSuccess("");
        });
      setLoading(false);
    };
    fetchComments();
  }, [id]);

  const handleDelete = async (commentId, platform) => {
    setLoading(true);
    setError("");
    setSuccess("");
    const body = {
      comment_id: commentId,
      platform,
    };
    const url = `http://127.0.0.1:8000/api/v1/comments/delete-comment/${id}/`;
    await axios
      .post(url, body, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.statusText === "OK") {
          console.log("Hitt");
          setSuccess(
            `Comment deleted successfully. It will be updated ${new Date(
              new Date.getTime() + 2 * 60 * 60 * 1000
            )}`
          );
          setError("");
        }
      })
      .catch(() => {
        setError(error?.response?.data?.platforms.join(", "));
        setSuccess("");
      });
    setLoading(false);
  };

  return (
    <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto'>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />}

      <div className='w-[90%] m-auto p-4  text-left text-gray-500 dark:text-gray-400 '>
        <h1 className='text-3xl text-center md:text-4xl text-customTextBlue'>
          Comments
        </h1>
        <Link
          to='/comment'
          className='px-3 py-2 mt-4 text-white rounded-md bg-customGray md:py-3 md:px-8'
        >
          Go back
        </Link>
        {hasComment ? (
          <div>
            {comments?.twitter?.length > 0 && (
              <div>
                <div className='flex items-center gap-4 mt-8'>
                  <img
                    src='/x-twitter.svg'
                    className='w-12 h-12 p-1 bg-black border rounded-full '
                    alt=''
                  />
                  <h2 className='text-2xl font-bold'>Twitter</h2>
                </div>
                <ol className='pl-20 space-y-4 mt-7'>
                  {comments?.twitter?.map((t, i) => {
                    const date = getDate(t.created);
                    return (
                      <li
                        className='flex items-center w-full gap-6 px-8 py-4 bg-gray-100'
                        key={t.commentId}
                      >
                        <h4 className='mt-1'>{i + 1}.</h4>
                        <div>
                          <p className='text-xl'>{t.comment}</p>
                          <span className='text-sm'>{date}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(t.commentId, t.platform)}
                          className='px-6 py-2.5 rounded-sm ml-auto text-sm font-bold text-red-600 bg-red-300 cursor-pointer'
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {comments?.pinterest?.length > 0 && (
              <div>
                <div className='flex items-center gap-4 mt-8'>
                  <img
                    src='/pinterest.svg'
                    className='w-12 h-12 p-1 bg-[#e60023] border rounded-full '
                    alt=''
                  />
                  <h2 className='text-2xl font-bold'>Pinterest</h2>
                </div>
                <ol className='pl-20 space-y-4 mt-7'>
                  {comments.pinterest.map((t, i) => {
                    const date = getDate(t.created);
                    return (
                      <li className='flex gap-6' key={t.commentId}>
                        <h4 className='mt-1'>{i + 1}.</h4>
                        <div>
                          <p className='text-xl'>{t.comment}</p>
                          <span className='text-sm'>{date}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {comments?.facebook?.length > 0 && (
              <div>
                <div className='flex items-center gap-4 mt-8'>
                  <img
                    src='/facebook.svg'
                    className='w-12 h-12 p-1 border rounded-full bg-customBlue '
                    alt=''
                  />
                  <h2 className='text-2xl font-bold'>Facebook</h2>
                </div>
                <ol className='pl-20 space-y-4 mt-7'>
                  {comments.facebook.map((t, i) => {
                    const date = getDate(t.created);
                    return (
                      <li className='flex gap-6' key={t.commentId}>
                        <h4 className='mt-1'>{i + 1}.</h4>
                        <div>
                          <p className='text-xl'>{t.comment}</p>
                          <span className='text-sm'>{date}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {comments?.youtube?.length > 0 && (
              <div>
                <div className='flex items-center gap-4 mt-8'>
                  <div className='custom-youtube-logo '></div>
                  <h2 className='text-2xl font-bold'>Youtube</h2>
                </div>
                <ol className='pl-20 space-y-4 mt-7'>
                  {comments.youtube.map((t, i) => {
                    const date = getDate(t.created);
                    return (
                      <li className='flex gap-6' key={t.commentId}>
                        <h4 className='mt-1'>{i + 1}.</h4>
                        <div>
                          <p className='text-xl'>{t.comment}</p>
                          <span className='text-sm'>{date}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {comments?.instagram?.length > 0 && (
              <div>
                <div className='flex items-center gap-4 mt-8'>
                  <img
                    src='/instagram.svg'
                    className='w-12 h-12 p-1 border rounded-full bg-[#b003c7] '
                    alt=''
                  />
                  <h2 className='text-2xl font-bold'>Instagram</h2>
                </div>
                <ol className='pl-20 space-y-4 mt-7'>
                  {comments.instagram.map((t, i) => {
                    const date = getDate(t.created);
                    return (
                      <li className='flex gap-6' key={t.commentId}>
                        <h4 className='mt-1'>{i + 1}.</h4>
                        <div>
                          <p className='text-xl'>{t.comment}</p>
                          <span className='text-sm'>{date}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {comments?.linkedin?.length > 0 && (
              <div>
                <div className='flex items-center gap-4 mt-8'>
                  <img
                    src='/linkedin.svg'
                    className='w-12 h-12 p-1 border rounded-full bg-[#0000ff] '
                    alt=''
                  />
                  <h2 className='text-2xl font-bold'>Linkedin</h2>
                </div>
                <ol className='pl-20 space-y-4 mt-7'>
                  {comments.linkedin.map((t, i) => {
                    const date = getDate(t.created);
                    return (
                      <li className='flex gap-6' key={t.commentId}>
                        <h4 className='mt-1'>{i + 1}.</h4>
                        <div>
                          <p className='text-xl'>{t.comment}</p>
                          <span className='text-sm'>{date}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <div className='text-4xl font-bold text-[#333] flex justify-center items-center h-[350px]'>
              No comments posted
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ViewComments;
