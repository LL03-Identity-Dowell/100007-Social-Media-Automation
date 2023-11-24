import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WriteYourSelf = ({ close }) => {
  const [inputs, setInputs] = useState({
    article: "",
    source: "",
  });
  const location = useLocation();
  const { state } = location;
  const { data } = state;

  const handelChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    const payload = {
        title: data,
        articletextarea: inputs.article,
        url: inputs.source,
    }
    console.log(payload);

    axios
      .post(
        `http://127.0.0.1:8000/api/v1/article/write_yourself/`,
        payload,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        // Handle the response here
        console.log(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });

  };


  useEffect(() => {
    close();
  }, []);

  return (
    <div className="max-w-7xl mx-auto lg:w-[900px] w-full h-[95vh] flex justify-center items-start px-4 mt-6 md:mt-12 ">
      <div className="w-full ">
        <h1 className="text-3xl lg:text-4xl font-bold text-customGray text-center">
          Write Article
        </h1>
        <form className="pt-4 md:pt-6" onSubmit={handelSubmit}>
          <div className=" w-full">
            <label htmlFor="article" className="text-gray-400">
              Article
            </label>
            <textarea
            required
              name="article"
              id="article"
              onChange={handelChange}
              className="p-4 w-full h-[200px] my-2 border border-gray-200 rounded-md"
              placeholder="Type here..."
            ></textarea>
          </div>
          <div className="grid mt-2">
            <label htmlFor="source" className="text-gray-400">
              Source of Article
            </label>
            <input
            required
              type="url"
              id="source"
              name="source"
              onChange={handelChange}
              placeholder="Enter source url of the article.."
              className="p-4 my-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex justify-center items-center mt-4">
            <button className="bg-customGray text-white py-2 md:py-3 md:px-8 px-4 rounded-md">
              Save Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteYourSelf;
