import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";
import axios from "axios";
import Loading from "../../components/Loading";
import { ErrorMessages } from "../../components/Messages";
import SpecificArticle from "./SpecificArticle";

const Article = ({ show }) => {
  const [articleData, setArticleData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(7);
  const [showMorePages, setShowMorePages] = useState(false);


  const [buttonClicked, setButtonClicked] = useState(false);
  const [clickedPost, setClickedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    show();
    fetch();
  }, [page]);




  // console.log(sessionId);

  const fetch = () => {
    setLoading(true);
    const session_id = localStorage.getItem("session_id");
    // Make a GET request to the API endpoint with the session_id
    axios
      .get(
        `http://127.0.0.1:8000/api/v1/list-articles/?page=${page + 1
        }&order=newest`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setError(null);
        setLoading(false);
        let data = response.data;
        // console.log(data);
        setArticleData(data.Articles);
        setCount(data.total_items);
        setPageCount(Math.ceil(data.total_items / perPage));
        setShowMorePages(pageCount > pagesToDisplay);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error fetching article:", error);
      });
  };

  const handlePostdetailNavigate = (article_id, title, paragraph, source) => {
    const dataToSend = {
      article_id: article_id,
      title: title,
      paragraph: paragraph,
      source: source,
    };
    // console.log(dataToSend);
    setClickedPost(dataToSend);
    setButtonClicked(true);
  };

  // Use the clickedPost state to determine when to navigate
  useEffect(() => {
    if (buttonClicked && clickedPost) {
      navigate("/article-detail", { state: { data: clickedPost } });
    }
  }, [buttonClicked, clickedPost]);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const loadMorePages = () => {
    if (pageCount > pagesToDisplay) {
      const nextPagesToDisplay = Math.min(pageCount - page, pagesToDisplay);
      setShowMorePages(nextPagesToDisplay + page < pageCount);
      setPage(page + nextPagesToDisplay);
    }
  };

  return (
    <div className="relative h-[90vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
        <h2 className="text-3xl md:text-4xl ">Article List</h2>
      </div>

      <div className="count-article flex justify-between pt-0 pb-2 items-center">
        <p className="px-6 py-3 italic">Total posts count: {count}</p>

        <Link to="/createarticle">
          <div className="lg:w-[140px] lg:pt-2">
            <ExtraSmallBtn title={"Create Article"} />
          </div>
        </Link>
      </div>

      <div>
        <div className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              {articleData &&
                articleData.map((article, index) => (
                  <div className="article mr-2 mt-6 " key={index}>
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

                      <div className="lg:w-[150px] lg:pt-2 flex justify-end md:mr-6 mt-2 md:mt-0">
                        <ExtraSmallBtn
                          title={"View Article"}
                          onClick={() =>
                            handlePostdetailNavigate(
                              article.article_id,
                              article.title,
                              article.paragraph,
                              article.source
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={pagesToDisplay}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          previousLabel={<span className="text-black">{page > 0 ? "Previous" : ""}</span>}
          nextLabel={<span className="text-black">{page < pageCount - 1 ? "Next" : " "}</span>}
          containerClassName="flex justify-center items-center my-4 space-x-2"
          pageClassName="p-2 rounded-full cursor-pointer text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
          previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          breakClassName="p-2"
          activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 "
        />
        
      </div>
    </div>
  );
};

export default Article;