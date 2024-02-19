import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Wikipidia from "./Wikipidia";
import { useQuery } from "react-query";

const CreateArticle = ({ show }) => {
  const [isProductKey, setIsProductKey] = useState();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(4);
  const [wikipida, setWikipida] = useState(null);
  const [activePage, setActivePage] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const productKey = localStorage.getItem("productKey");
    setIsProductKey(productKey);
  }, []);
  
  useEffect(() => {
    show();
    // const callGenerateArticleAPI = () => {
    //   // Make an API request to GenerateArticleView
    //   setLoading(true);
    //   axios
    //     .get(
    //       `${import.meta.env.VITE_APP_BASEURL}/article/generate/?page=${
    //         page + 1
    //       }&order=newest`,
    //       {
    //         withCredentials: true,
    //       }
    //     )
    //     .then((response) => {
    //       setError(null);
    //       setLoading(false);
    //       setSuccess("Topics Fetched Successfully...!");
    //       // Handle the response here
    //       const data = response.data.topics;
    //       // console.log(data);
    //       setTopics(data);
    //       setCount(response.data.total_items);
    //       setPageCount(Math.ceil(response.data.total_items / perPage));
    //       setShowMorePages(pageCount > pagesToDisplay);
    //       window.scrollTo(0, 0);
    //       // console.log(response.data);
    //     })
    //     .catch((error) => {
    //       setLoading(false);
    //       setError("Server error, Please try again later");
    //       console.error(error);
    //     });
    // };
    // callGenerateArticleAPI();
  }, []);

  const page = parseInt(new URLSearchParams(location.search).get("page")) || 0;

  const {
    data: topics,
    status,
    isLoading,
    refetch,
  } = useQuery(
    ["topics", page],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASEURL}/article/generate/?page=${
          page + 1
        }&order=newest`,
        { withCredentials: true }
      );
      return response.data;
    },

    {
      keepPreviousData: true,
      onSettled: () => setLoading(false),
    }
  );

  useEffect(() => {
    if (status === "success") {
      setSuccess("Topics Fetched successfully");
      setCount(topics.total_items);
      setPageCount(Math.ceil(topics.total_items / perPage));
    } else if (status === "error") {
      setError("Error Fetching data, Please try again");
    }
    window.scrollTo(0, 0);

    setActivePage(page);
  }, [status, topics, perPage, page, activePage, navigate, location.pathname]);

  const handlePageClick = (data) => {
    setLoading(true);
    const selectedPage = data.selected;
    navigate(`${location.pathname}?page=${selectedPage}`);
  };

  const callGenerateArticleAI = (item) => {
    // console.log(item);
    if (isProductKey) {
      navigate("/");
    } 
    const data = {
      title: item,
    };
    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/article/AI/`, data, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response);
        setLoading(false);
        // Handle the response here
        setSuccess("Articles created successfully...!");
        setTimeout(() => {
          navigate("/article");
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(null);
        setError("Error Fetching Data, Please try again");
        // Handle any errors
        console.error(error);
      });
  };

  const callGenerateArticleWiki = (item) => {
    // Make an API request to GenerateArticleView
    if (isProductKey) {
      navigate("/");
    } 
    const data = {
      title: item,
    };
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/article/wiki/`, data, {
        withCredentials: true,
      })
      .then((response) => {
        // Handle the response here
        const data = response.data.message;
        setLoading(false);
        setWikipida(data);
        navigate("/article/Wikipidia/", { state: { data } });
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
    if (isProductKey) {
      navigate("/");
    } 
    const data = {
      title: item,
    };
    navigate("/article/write_yourself/", { state: { data } });
  };

  return (
    <div className="overflow-y-hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:article-container lg:relative lg:max-w-7xl lg:mx-auto lg:h-auto lg:overflow-y-visible ">
      {loading || isLoading ? <Loading /> : null}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {/* <ToastContainer /> */}
      <h1 className="text-2xl font-semibold text-customTextBlue">
        Create An Article
      </h1>
      <p className="">Select a topic</p>
      <div className="">
        <div className="flex flex-col content-center max-w-6xl">
          <div className="overflow-x-auto lg:overflow-hidden sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="w-auto text-sm font-light text-left ">
                  <thead className="font-medium border-y dark:border-black">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-lg">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-4 text-lg">
                        Sentense
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-lg md:whitespace-nowrap"
                      >
                        Created By
                      </th>
                      <th scope="col" className="px-6 py-4 text-lg">
                        Select Handle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics &&
                      topics.topics.map((item, index) => (
                        <tr
                          key={index}
                          className="font-normal text-gray-600 transition duration-300 ease-in-out border-b text-[15px] hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                        >
                          <td className="px-6 py-4 font-medium lg:whitespace-nowrap md:whitespace-nowrap">
                            {item.ranks}
                          </td>
                          <td className="px-6 py-4 lg:whitespace-nowrap md:whitespace-nowrap">
                            {item.sentence}
                          </td>
                          <td className="px-6 py-4 lg:whitespace-nowrap md:whitespace-nowrap">
                            {item.created_by}
                          </td>
                          <td className="px-6 py-4 lg:whitespace-nowrap md:whitespace-nowrap">
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
                              onClick={() =>
                                callGenerateArticleWiki(item.sentence)
                              }
                            >
                              Wikipedia
                            </button>

                            <button
                              className="bg-[#333333] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={() =>
                                callGenerateArticleWriteYourself(item.sentence)
                              }
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
        pageCount={Math.max(0, pageCount)}
        pageRangeDisplayed={pagesToDisplay}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        forcePage={page}
        previousLabel={
          <span className="text-black text-xs md:text-lg">
            {page > 0 ? "Previous" : ""}
          </span>
        }
        nextLabel={
          <span className="text-black text-xs md:text-lg">
            {page < topics?.total_items / 5 - 1 ? "Next" : " "}
          </span>
        }
        containerClassName="flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll md:overflow-auto "
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
