import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";
import { MdArrowLeft } from "react-icons/md";
import CommentItem from "./_components/CommentItem";

function ViewComments({ show }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasComment, setHasComments] = useState(false);

  const [comments, setComments] = useState({});

  const { id } = useParams();

  const parsedDatetime = comments?.nextUpdateTwitter;
  const datetime = new Date(parsedDatetime);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const humanReadableDatetime = datetime.toLocaleString(undefined, options);

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
      const url = `${import.meta.env.VITE_APP_BASEURL
        }/comments/get-post-comments/${id}/`;
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          const { data } = response;

          if (data.status === "error") {
            setError("The  post does not have aryshare ID");
            setSuccess("");
          } else {
            setSuccess("Comments fetched successfully");
            setError("");
          }
          setComments(data);
        })
        .catch(() => {
        setLoading(false);
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
    const url = `${import.meta.env.VITE_APP_BASEURL}/comments/delete-comment/${id}/`;
    await axios
      .post(url, body, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.statusText === "OK") {
          console.log("Hitt");
          setSuccess("Comment deleted successfully.");
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
          className='cursor-pointer text-[15px] flex gap-2 items-center bg-gray-400 hover:bg-customTextBlue text-white  py-1 px-4 rounded-lg max-w-max'
        >
          <MdArrowLeft />
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
                  {comments?.twitter?.map((t, i) => (
                    <CommentItem
                      t={t}
                      i={i}
                      key={i}
                      handleDelete={handleDelete}
                    />
                  ))}
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
                    return (
                      <CommentItem
                        t={t}
                        i={i}
                        key={i}
                        handleDelete={handleDelete}
                      />
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
                  {comments.facebook.map((t, i) => (
                    <CommentItem
                      t={t}
                      i={i}
                      key={i}
                      handleDelete={handleDelete}
                    />
                  ))}
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
                  {comments.youtube.map((t, i) => (
                    <CommentItem
                      t={t}
                      i={i}
                      key={i}
                      handleDelete={handleDelete}
                    />
                  ))}
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
                  {comments.instagram.map((t, i) => (
                    <CommentItem
                      t={t}
                      i={i}
                      key={i}
                      handleDelete={handleDelete}
                    />
                  ))}
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
                  {comments.linkedin.map((t, i) => (
                    <CommentItem
                      t={t}
                      i={i}
                      key={i}
                      handleDelete={handleDelete}
                    />
                  ))}
                </ol>
              </div>
            )}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className='text-center text-4xl font-bold text-[#333] flex justify-center items-center h-[350px] text-balance'>
              Please wait for the next update:
              {humanReadableDatetime}
            </div>
          )
        )}
        {!loading && error && (
          <div className='text-center text-4xl font-bold text-[#333] flex justify-center items-center h-[350px] text-balance leading-10 flex-col'>
            Comments not found
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewComments;
