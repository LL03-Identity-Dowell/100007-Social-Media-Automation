/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/button";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";
import axios from "axios";
import Loading from "../../components/Loading";
import { ErrorMessages } from "../../components/Messages";

const Article = ({show}) => {
  const [articleData, setArticleData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    show();

    fetch()
  }, []);

  const fetch = () => {
    setLoading(true)
    // Make a GET request to the API endpoint with the session_id
    axios
    .get("http://127.0.0.1:8000/api/v1/list-articles/", {
      withCredentials: true,
    })
    .then((response) => {
      setLoading(false)
      let data = response.data.posts;
      setCount(data.length)
      setArticleData(data);
      // console.log(data);
    })
    .catch((error) => {
        setLoading(false)
        setError("Server error, Please try again later");
        console.error("Error fetching article:", error);
      });
  };


  
  return (
    <div className="relative h-[90vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      {loading && <Loading/>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
        <h2 className="text-3xl md:text-4xl ">Article List</h2>
      </div>

      <div className="count-article flex justify-between pt-0 pb-2 items-center">
        <p className="px-6 py-3 italic">Total posts count: {count}</p>

        <div className="lg:w-[140px] lg:pt-2">
          <ExtraSmallBtn title={"Create Article"} />
        </div>
      </div>

      <div>
        <div className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles" >
              {
                articleData && articleData.map((article, index)=>(
                  <div className="article" key={index}>
                    <p className="lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                        {article.source}
                      </p>
                    <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold">
                      {article.title}
                    </p>

                    <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                      <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg w-full line-clamp-4 leading-loose">
                        {article.paragraph}
                      </p>

                      <div className="lg:w-[150px] lg:pt-2 flex justify-end md:mr-6">
                        <Link to="/SpecificArticle">
                          <ExtraSmallBtn title={"View Article"} />
                        </Link>
                      </div>
                    </div>
                  </div>

                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
