import { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";
import Loading from "/src/components/Loading.jsx";

export const Form = ({ name }) => {
  const [type, setType] = useState("insert");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  console.log(success);

  const putMethod = async (data) => {
    const res = await axios.put(
      `http://127.0.0.1:8000/api/v1/${name}-form/`,
      data,
      {
        withCredentials: true,
      }
    );
    return res;
  };
  const postMethod = async (data) => {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/v1/${name}-form/`,
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

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      let res;
      if (type === "insert") {
        res = await postMethod(data);
      }
      if (type === "update") {
        res = await putMethod(data);
      }
      setSuccess(res.data.message);
    } catch (error) {
      setError("Request failed");
      console.log(error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/v1/${name}-form/`,

          {
            withCredentials: true,
          }
        );
        setType(res.data.status);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [name]);

  return (
    <>
      {error !== "" && <ErrorMessages>{error}</ErrorMessages>}
      {success !== "" && <SuccessMessages>{success}</SuccessMessages>}
      {loading ? (
        <Loading />
      ) : (
        <form
          className='flex flex-col items-center justify-center gap-6'
          onSubmit={onSubmit}
        >
          <input
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
          />
          <input
            name='page_password'
            type='number'
            placeholder='Enter no. of posts per day'
            className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
          />
          <input
            name='posts_no'
            type='password'
            placeholder='Enter your Page Password'
            className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
          />
          <button
            type='submit'
            className='h-12 font-bold text-white rounded-sm w-28 bg-customBlue'
          >
            Done
          </button>
        </form>
      )}
    </>
  );
};
