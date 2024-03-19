import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorMessages, SuccessMessages } from '/src/components/Messages';
import Loading from '/src/components/Loading.jsx';

export const Form = ({ name }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');

  const postMethod = async (data) => {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_AUTOMATIONURLL}/automation/`,
      data,
      {
        withCredentials: true,
      }
    );
    return res;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const channel = name.toLowerCase();

    try {
      const res = await postMethod({ ...data, channel });
      console.log(res.data);
      setSuccess(res?.data?.message);
    } catch (error) {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_AUTOMATIONURLL}/automation/`,

          {
            withCredentials: true,
          }
        );

        const { data } = res;
        if (data?.length === 0) {
          setStatus('insert');
        }
        if (data?.length > 0) {
          setStatus('update');
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [name]);

  return (
    <>
      {error !== '' && <ErrorMessages>{error}</ErrorMessages>}
      {success !== '' && <SuccessMessages>{success}</SuccessMessages>}
      {loading ? (
        <Loading />
      ) : (
        <form
          className='flex flex-col items-center justify-center gap-6'
          onSubmit={onSubmit}>
          {/* <input
            type='number'
            placeholder='Enter Page ID'
            className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
            name='page_id'
          />
          <input
            name='page_link'
            type='text'
            placeholder='Enter Page Link'
            className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
          /> */}
          <input
            name='number_of_posts_per_day'
            type='number'
            placeholder='Enter no. of posts per day'
            className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
          />
          {/* <input
            name='posts_no'
            type='password'
            placeholder='Enter your Page Password'
            className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
          /> */}
          <button
            type='submit'
            className='h-10 font-bold text-white rounded-sm w-28 text-center cursor-pointer bg-customBlue'>
            Done
          </button>
        </form>
      )}
    </>
  );
};
