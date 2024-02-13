import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";
import axios from "axios";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import { useQuery } from "react-query";

const Article = ({ show }) => {
  const location = useLocation();
  // const [articleData, setArticleData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [count, setCount] = useState(0);
  // const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(4);
  const [activePage, setActivePage] = useState(0);
  const [showMorePages, setShowMorePages] = useState(false);

  const [buttonClicked, setButtonClicked] = useState(false);
  const [clickedPost, setClickedPost] = useState(null);
  const navigate = useNavigate();

  const page = parseInt(new URLSearchParams(location.search).get("page")) || 0;

  const {
    data: articleData,
    status,
    isLoading,
    refetch,
  } = useQuery(
    ["listArticles", page],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASEURL}/list-articles/?page=${
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
    show();
  }, []);

  useEffect(() => {
    if (status === "success") {
      setsuccess("Article Fetched successfully")
      setCount(articleData.total_items);
      setPageCount(Math.ceil(articleData.total_items / perPage));
    }
    else if (status === "error") {
      setError("Error Fetching data, Please try again")
    }
    window.scrollTo(0, 0);

    setActivePage(page);
  }, [
    status,
    articleData,
    perPage,
    page,
    activePage,
    navigate,
    location.pathname,
  ]);

  // useEffect(() => {
  //   // Update the URL with the selected page only if it has changed
  //   if (page !== parseInt(new URLSearchParams(location.search).get("page"))) {
  //     navigate(`${location.pathname}?page=${page + 1}`, { replace: true });
  //   }
  // }, [page, location.search]);

  const handlePostdetailNavigate = (article_id, title, paragraph, source) => {
    const dataToSend = {
      article_id: article_id,
      title: title,
      paragraph: paragraph,
      source: source,
    };
    navigate("/article-detail", { state: { data: dataToSend } });
  };

  const handlePageClick = (data) => {
    setLoading(true);
    const selectedPage = data.selected;
    navigate(`${location.pathname}?page=${selectedPage}`);
  };

  // useEffect(() => {
  //   const fetch = () => {
  //     setLoading(true);
  //     const session_id = localStorage.getItem("session_id");
  //     // Make a GET request to the API endpoint with the session_id
  //     axios
  //       .get(
  //         `${import.meta.env.VITE_APP_BASEURL}/list-articles/?page=${page + 1
  //         }&order=newest`,
  //         {
  //           withCredentials: true,
  //         }
  //       )
  //       .then((response) => {
  //         setError(null);
  //         setLoading(false);
  //         let data = response.data;
  //         // console.log(data);
  //         setArticleData(data.Articles);
  //         setCount(data.total_items);
  //         setPageCount(Math.ceil(data.total_items / perPage));
  //         setShowMorePages(pageCount > pagesToDisplay);
  //         window.scrollTo(0, 0);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         setError("Server error, Please try again later");
  //         console.error("Error fetching article:", error);
  //       });
  //   };
  //   if (page !== parseInt(new URLSearchParams(location.search).get('page'))) {
  //     fetch();
  //   }

  // }, [page, location.search]);

  // console.log(sessionId);

  // const handlePostdetailNavigate = (article_id, title, paragraph, source) => {
  //   const dataToSend = {
  //     article_id: article_id,
  //     title: title,
  //     paragraph: paragraph,
  //     source: source,
  //   };
  //   // console.log(dataToSend);
  //   setClickedPost(dataToSend);
  //   setButtonClicked(true);
  // };

  // Use the clickedPost state to determine when to navigate
  // useEffect(() => {
  //   if (buttonClicked && clickedPost) {
  //     navigate("/article-detail", { state: { data: clickedPost } });
  //   }
  // }, [buttonClicked, clickedPost]);

  // useEffect(() => {
  //   // Update the URL with the selected page
  //   navigate(`${location.pathname}?page=${page + 1}`);
  // }, [page, navigate, location.pathname]);

  // const handlePageClick = (data) => {
  //   const selectedPage = data.selected;
  //   if (selectedPage >= 0 && selectedPage < pageCount) {
  //     setPage(selectedPage);
  //     console.log(selectedPage);
  //   }
  // };

  return (
    <div className="relative mx-auto mb-6 overflow-y-hidden max-w-7xl lg:h-auto lg:overflow-y-auto ">
      {loading || isLoading ? <Loading /> : null}
      {status === "error" && <ErrorMessages>{error}</ErrorMessages>}
      {status === "success" && <SuccessMessages>{success}</SuccessMessages>}
      <div className="py-2 font-semibold text-center text-customTextBlue lg:py-6">
        <h2 className="text-3xl md:text-4xl ">Article List</h2>
      </div>

      <div className="flex items-center justify-between pt-0 pb-2 count-article">
        <p className="py-3 italic md:px-6">Total posts count: {count}</p>

        <Link to="/createarticle">
          <div className="lg:w-[140px] lg:pt-2 md:mr-6 ">
            <ExtraSmallBtn title={"Create Article"} />
          </div>
        </Link>
      </div>

      <div className="mb-6">
        <div className="grid gap-6 pb-10 lg:h-auto lg:gap-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              {articleData &&
                articleData.Articles.map((article, index) => (
                  <div className="mt-6 mr-2 article " key={index}>
                    <p className="px-2 lg:px-6 lg:py-4 text-md lg:text-lg">
                      {article.source}
                    </p>
                    <p className="px-2 py-0 font-bold lg:px-6 text-md lg:text-xl text-customTextBlue dark:text-white">
                      {article.title}
                    </p>

                    <div className="flex flex-col items-baseline justify-between py-0 content-button md:flex-row">
                      <p className="w-full px-2 leading-loose lg:px-6 lg:pt-4 text-md lg:text-lg line-clamp-4">
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
              {page < articleData?.total_items / 5 - 1 ? "Next" : " "}
            </span>
          }
          containerClassName="flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll md:overflow-auto "
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
