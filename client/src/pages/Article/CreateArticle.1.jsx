import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";

export const CreateArticle = ({ show }) => {
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
  // const [title, setTitle] = useState();
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

  const callGenerateArticleAI = (item, index) => {
    item.forEach((data) => {});
    // Make an API request to GenerateArticleView
    // const payload = {
    //   title: "Sample Research Topic",
    //   subject: "Technology",
    //   verb: "improves",
    //   target_industry: "Healthcare",
    //   qualitative_categorization: "Research Article",
    //   targeted_for: "Medical Professionals",
    //   designed_for: "Information Sharing",
    //   targeted_category: "Medical Technology",
    //   image: "https://example.com/sample-image.jpg",
    // };
    // axios
    //   .post("http://127.0.0.1:8000/api/v1/article/AI/", {
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     // Handle the response here
    //     console.log(response.data);
    //     toast.success(response?.data?.message);
    //   })
    //   .catch((error) => {
    //     // Handle any errors
    //     console.error(error);
    //   });
  };

  const callGenerateArticleWiki = () => {
    // Make an API request to GenerateArticleView
    const payload = {
      title: "social",
      subject: "Technology",
      verb: "improves",
      target_industry: "Healthcare",
      qualitative_categorization: "Research Article",
      targeted_for: "Medical Professionals",
      designed_for: "Information Sharing",
      targeted_category: "Medical Technology",
      image: "https://example.com/sample-image.jpg",
    };
    axios
      .post("http://127.0.0.1:8000/api/v1/article/wiki/", payload, {
        withCredentials: true,
      })
      .then((response) => {
        // Handle the response here
        console.log(response.data);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        toast.error(error?.message);
      });
  };

  const callGenerateArticleWriteYourself = () => {
    // Make an API request to GenerateArticleView
    const session_id = localStorage.getItem("session_id");
    const payload = {
      title: "title",
      subject: "subject",
      verb: "verb",
      target_industry: "target_industry",
    };
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/article/write_yourself/?session_id=${session_id}`,
        payload,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        // Handle the response here
        console.log(response.data);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        toast.error(error?.message);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center article-container relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-visible ">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {/* <ToastContainer /> */}
      <h1 className="text-2xl font-semibold text-customTextBlue">
        Create An Article
      </h1>
      <p className="">Select a topic</p>
      <div className="overflow-y-scroll lg:overflow-y-visible h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-6 ">
        <div className="flex flex-col max-w-6xl content-center">
          <div className="overflow-x-auto lg:overflow-hidden sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden ">
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
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {item.ranks}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {item.sentence}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {item.created_by}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              className="bg-[#999999] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={callGenerateArticleAI(item, index)}
                            >
                              AiWriter
                            </button>

                            <button
                              className="bg-[#0866FF] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={callGenerateArticleWiki}
                            >
                              Wikipedia
                            </button>

                            <button
                              className="bg-[#333333] text-white text-xs mx-3 rounded p-2 w-auto"
                              onClick={callGenerateArticleWriteYourself}
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
    </div>
  );
};
