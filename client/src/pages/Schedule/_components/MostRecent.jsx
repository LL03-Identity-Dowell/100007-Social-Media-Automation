import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Loading from "../../../components/Loading";
import { ErrorMessages } from "../../../components/Messages";

const MostRecent = () => {
  const [articles, setArticles] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(7);
  const [showMorePages, setShowMorePages] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch();
  }, [page]);

  const fetch = () => {
    setLoading(true);
    // Make a GET request to the API endpoint with the session_id
    axios
      .get(
        `http://127.0.0.1:8000/api/v1/recent_posts/?page=${
          page + 1
        }&order=newest`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setError(null);
        setLoading(false);
        let data = response.data.MostRecentPosts.response;
        setArticles(data);
        console.log(response.data);
        setCount(response.data.total_items);
        setPageCount(Math.ceil(response.data.total_items / perPage));
        setShowMorePages(pageCount > pagesToDisplay);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error fetching article:", error);
      });
  };

  console.log(articles);
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
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}

      <p className="px-6 py-2 italic">Total article count: {count}</p>

      <div>
        <div className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              {articles &&
                articles.map((article, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between md:items-center mt-10"
                  >
                    <div className="w-full">
                      <p className="lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                        {article.source}
                      </p>
                      <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold">
                        {article.title}
                      </p>

                      <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg line-clamp-4 lg:w-[920px] ">
                        {article.paragraph}
                      </p>
                    </div>

                    <div className="mr-4 lg:mr-8">
                      <img
                        className="w-[250px] h-[200px] rounded-lg"
                        src={article.image}
                        alt="image"
                      />
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
          previousLabel={<span className="text-black">Previous</span>}
          nextLabel={<span className="text-black">Next</span>}
          containerClassName="flex justify-center items-center my-4 space-x-2"
          pageClassName="p-2 rounded-full cursor-pointer text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
          previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          breakClassName="p-2"
          activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 "
        />
        {showMorePages && (
          <button
            className="bg-customBlue text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
            onClick={loadMorePages}
          >
            &gt;&gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default MostRecent;
