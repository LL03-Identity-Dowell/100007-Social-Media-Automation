import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import Wikipidia from "./Wikipidia";

const CreateArticle = ({ show }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [topics, setTopics] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(7);
  const [showMorePages, setShowMorePages] = useState(false);
  const [wikipida, setWikipida] = useState(null);
  // const [showWikipida, setShowWikipida] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    show();
    const callGenerateArticleAPI = () => {
      // Make an API request to GenerateArticleView
      setLoading(true);
      axios
        .get(
          `http://127.0.0.1:8000/api/v1/article/generate/?page=${
            page + 1
          }&order=newest`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setError(null);
          setLoading(false);
          setSuccess("Topics Fetched Successfully...!");
          // Handle the response here
          const data = response.data.topics;
          setTopics(data);
          setCount(response.data.total_items);
          setPageCount(Math.ceil(response.data.total_items / perPage));
          setShowMorePages(pageCount > pagesToDisplay);
          window.scrollTo(0, 0);
          // console.log(response.data);
        })
        .catch((error) => {
          setLoading(false);
          setError("Server error, Please try again later");
          console.error(error);
        });
    };
    callGenerateArticleAPI();
  }, [page]);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const callGenerateArticleAI = (item) => {
    // console.log(item);
    const data = {
      title: item,
    };
    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/api/v1/article/AI/", data, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response);
        setLoading(false);
        // Handle the response here
        setSuccess("Articles created successfully...!");
        setTimeout(()=>{
          navigate("/article");
        }, 2000)
      })
      .catch((error) => {
        setSuccess(null);
        setError("Error Fetching Data, Please try again");
        // Handle any errors
        console.error(error);
      });
  };

  const callGenerateArticleWiki = (item) => {
    // Make an API request to GenerateArticleView
    const data = {
      title: item,
    };
    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/api/v1/article/wiki/", data, {
        withCredentials: true,
      })
      .then((response) => {
        // Handle the response here
        const data = response.data.message
          setLoading(false);
          setWikipida(data)
          navigate("/article/Wikipidia/", { state: { data } })
          // setShowWikipida(true)
          // setSuccess(data); 
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(null);
        console.log(error);
        setError("Error Fetching Data, Please try again");
      });
  };

  const callGenerateArticleWriteYourself = (item) => {
    const data = {
      title: item,
    };
    navigate("/article/write_yourself/", { state: { data } })
  };

  return (
    <div className="lg:flex lg:flex-col lg:justify-center lg:items-center lg:article-container lg:relative  lg:max-w-7xl lg:mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-visible ">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {/* <ToastContainer /> */}
      <h1 className="text-2xl font-semibold text-customTextBlue">
        Create An Article
      </h1>
      <p className="">Select a topic</p>
      <div className=" ">
        <div className="flex flex-col max-w-6xl content-center">
          <div className="overflow-x-auto lg:overflow-hidden sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className=" text-left text-sm font-light w-auto">
                  <thead className="border-y font-medium dark:border-black">
                    <tr>
                      <th scope="col" className="text-lg px-6 py-4">
                        Rank
                      </th>
                      <th scope="col" className="text-lg px-6 py-4">
                        Sentense
                      </th>
                      <th scope="col" className="text-lg px-6 py-4">
                        Created By
                      </th>
                      <th scope="col" className="text-lg px-6 py-4">
                        Select Handle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics &&
                      topics.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b transition duration-300 ease-in-out text-md lg:text-lg text-gray-600 font-normal hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                        >
                          <td className="lg:whitespace-nowrap md:whitespace-nowrap px-6 py-4 font-medium">
                            {item.ranks}
                          </td>
                          <td className="lg:whitespace-nowrap md:whitespace-nowrap px-6 py-4">
                            {item.sentence}
                          </td>
                          <td className="lg:whitespace-nowrap md:whitespace-nowrap px-6 py-4">
                            {item.created_by}
                          </td>
                          <td className="lg:whitespace-nowrap md:whitespace-nowrap px-6 py-4">
                            <button
                              className="bg-[#999999] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={() =>
                                callGenerateArticleAI(item.sentence)
                              }
                            >
                              AiWriter
                            </button>

                            <button
                              className="bg-[#0866FF] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={()=> callGenerateArticleWiki(item.sentence)}
                            >
                              Wikipedia
                            </button>

                            <button
                              className="bg-[#333333] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={()=> callGenerateArticleWriteYourself(item.sentence)}
                            >
                              Write Yourself
                            </button>
                            
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pagesToDisplay}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        previousLabel={
          <span className="text-black">{page > 0 ? "Previous" : ""}</span>
        }
        nextLabel={
          <span className="text-black">
            {page < pageCount - 1 ? "Next" : " "}
          </span>
        }
        containerClassName="flex justify-center items-center my-4 space-x-2"
        pageClassName="p-2 rounded-full cursor-pointer text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
        previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
        nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
        breakClassName="p-2"
        activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 "
      />

      {/* {wikipida && <Wikipidia wikipida={wikipida}/>} */}
    </div>
  );
};

export default CreateArticle;
