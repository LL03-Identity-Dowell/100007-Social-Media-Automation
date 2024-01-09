import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import Loading from "../../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../../components/Messages";

const MostRecent = () => {
  const [articles, setArticles] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState("");
  const [pagesToDisplay] = useState(4);
  const [showMorePages, setShowMorePages] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetch = () => {
      setLoading(true);
      // Make a GET request to the API endpoint with the session_id
      axios
        .get(
          `${import.meta.env.VITE_APP_BASEURL}/recent_posts/?page=${
            page + 1
          }&order=newest`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setError(null);
          setLoading(false);
          setSuccess('Successfully fetched posts')
          let data = response.data.MostRecentPosts.response;
          setArticles(data);
          // console.log(response.data);
          if(data.total_items <= 0){
            setIsEmpty("You do not have any recent posts")
          }
          setCount(response.data.total_items);
          setPageCount(Math.ceil(response.data.total_items / perPage));
          setShowMorePages(pageCount > pagesToDisplay);
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          setSuccess(null)
          setLoading(false);
          setError("Server error, Please try again later");
          console.error("Error fetching article:", error);
        });
    };
    fetch();
  }, [page]);

  // console.log(articles);
  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const ReadMoreParagraph = ({ text }) => {
    const [readMore, setReadMore] = useState(false);

    const [isOverflowed, setIsOverflowed] = useState(false);
    const paragraphRef = useRef(null);

    useEffect(() => {
      const paragraphElement = paragraphRef.current;

      // Check if the paragraph content overflows the container
      setIsOverflowed(
        paragraphElement.scrollHeight > paragraphElement.clientHeight
      );
    }, [text]);

    const handleReadMore = () => {
      setReadMore(!readMore);
    };
  
    return (
      <div>
         <p
        ref={paragraphRef}
        className={`lg:pt-4 lg:px-6 px-2 text-md lg:text-lg text-gray-600 ${
          readMore ? "" : "line-clamp-4"
        } lg:w-[920px] `}
      >
        {text}
      </p>
        {isOverflowed && (
        <span
          onClick={handleReadMore}
          className="text-md lg:text-lg lg:px-6 text-customTextBlue cursor-pointer font-semibold px-2"
        >
          {readMore ? "Read Less..." : "Read More..."}
        </span>
      )}
      </div>
    );
  }; 

  return (
    <div className="relative max-w-7xl mx-auto lg:h-auto  lg:overflow-y-auto mb-6">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      <p className="px-6 py-2 italic">Total article count: {count}</p>
      <p className="text-red-600 mt-10 text-xl lg:mr-12">{isEmpty}</p>
      {/* <div> */}
        {/* <div className=" grid gap-6 lg:mb-10 border border-green-700"> */}
          <div className=" text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="">
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

                      <ReadMoreParagraph text={article.paragraph} />
                    </div>

                    <div className="mr-4 lg:mr-8">
                      <img
                        className="w-[90%] md:w-50 md:h-40 h-50 rounded-lg"
                        src={article.image}
                        alt="image"
                      />
                    </div>

                  </div>
                ))}
            </div>
          </div>
        {/* </div> */}

        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={pagesToDisplay}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          previousLabel={<span className="text-black overflow-x-scroll text-xs md:text-lg">{page > 0 ? "Previous" : ""}</span>}
          nextLabel={<span className="text-black overflow-x-scroll text-xs md:text-lg">{page < pageCount - 1 ? "Next" : " "}</span>}
          containerClassName="flex justify-center items-center my-4 md:space-x-2 md:overflow-x-auto"
          pageClassName="p-2 rounded-full cursor-pointer md:text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
          previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
          breakClassName="p-2"
          activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 "
        />
        
      {/* </div> */}
    </div>
  );
};

export default MostRecent;
