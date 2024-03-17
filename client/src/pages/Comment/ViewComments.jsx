import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ErrorMessages, SuccessMessages } from '../../components/Messages';
import Loading from '../../components/Loading';
import { MdArrowLeft } from 'react-icons/md';
import {
  facebook,
  instagram,
  linkedin,
  pinterest,
  xTwitter,
} from '../../assets';

import CommentItem from './_components/CommentItem';
import { getDate } from './utils/getDate';

function ViewComments({ show }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasComment, setHasComments] = useState(true);

  const [comment, setComments] = useState({});

  const { id } = useParams();
  const nav = useNavigate();

  const parsedDatetime = comment?.nextUpdateTwitter;
  const datetime = getDate(parsedDatetime);
  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    const socialMediaKeys = Object.keys(comment).filter((key) =>
      Array.isArray(comment[key])
    );

    const hasComments = socialMediaKeys.some((key) => comment[key].length > 0);
    setHasComments(hasComments);
  }, [comment]);

  useEffect(() => {
    setLoading(true);

    const fetchComments = async () => {
      const url = `${
        import.meta.env.VITE_APP_BASEURL
      }/comments/get-post-comments/${id}/`;
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          const { data } = response;

          if (data.status === 'error') {
            setError('The  post does not have aryshare ID');
            setSuccess('');
          } else {
            setSuccess('Comments fetched successfully');
            setError('');
          }
          setComments(data);
        })
        .catch(() => {
          setLoading(false);
          setError(error?.response?.data?.platforms.join(', '));
          setSuccess('');
        });
      setLoading(false);
    };
    fetchComments();
  }, [id]);

  const handleDelete = async (commentId, platform) => {
    setLoading(true);
    setError('');
    setSuccess('');
    const body = {
      comment_id: commentId,
      platform,
    };
    const url = `${import.meta.env.VITE_APP_BASEURL}/comment/delete-comment/${id}/`;
    await axios
      .post(url, body, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.statusText === 'OK') {
          console.log('Hitt');
          setSuccess('Comment deleted successfully.');
          setError('');
        }
      })
      .catch(() => {
        setError(error?.response?.data?.platforms.join(', '));
        setSuccess('');
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
        <button
          onClick={() => nav(-1)}
          className='cursor-pointer text-[15px] flex gap-2 items-center bg-customBlue hover:bg-customTextBlue text-white  py-1 px-4 rounded-lg max-w-max'>
          <MdArrowLeft />
          Go back
        </button>

        {parsedDatetime && (
          <div className='text-center text-sm font-bold text-rose-500 flex justify-center items-center text-balance'>
            Please wait for the next update: {datetime}
          </div>
        )}
        {hasComment
          ? comment?.twitter?.length > 0 && (
              <div className='flex w-full mt-12 gap-x-20'>
                <ul className='flex flex-col w-full gap-y-6'>
                  {comment?.twitter?.map((t, i) => (
                    <li key={i} className='w-full flex items-center'>
                      <CommentItem
                        t={t}
                        src={t.profileImageUrl}
                        handleDelete={handleDelete}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )
          : !loading &&
            error && (
              <div className='text-center text-4xl font-bold text-[#333] flex justify-center items-center h-[350px] text-balance leading-10 flex-col'>
                Comments not found
              </div>
            )}
      </div>
    </div>
  );
}

export default ViewComments;
