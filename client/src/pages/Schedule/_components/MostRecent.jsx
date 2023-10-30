import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Loading from "../../../components/Loading";
import { ErrorMessages } from "../../../components/Messages";

const MostRecent = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDisplay] = useState(7);
  const [showMorePages, setShowMorePages] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch();
  }, [page]);

  const fetch = () => {
    setLoading(true);
    // Make a GET request to the API endpoint with the session_id
    axios
      .get(`http://127.0.0.1:8000/api/v1/recent_posts/?page=${page + 1}&order=newest`, {
        withCredentials: true,
      })
      .then((response) => {
        setError(null);
        setLoading(false);
        let data = response.data;
        setArticles(data);
        console.log(data);
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
    <div className='px-20'>
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <h3 className='text-[#495057] font-bold text-start'>
        Total posts count: {count}
      </h3>
      <ul className='space-y-10 '>
        {articles.length
          ? articles.map((item) => (
              <li
                id={item.PK}
                key={item.PK}
                className='flex justify-between gap-x-10'
              >
                <div className='flex flex-col w-9/12 gap-y-7 '>
                  <span className='text-base text-[#0000007c]'>
                    {item.source}
                  </span>
                  <h3 className='text-2xl font-bold text-customTextBlue'>
                    {item.title}
                  </h3>
                  <p className='text-[#333]'>{item.paragraph}</p>
                  <span className='flex items-center self-end gap-x-2'>
                    <div className='icons8-clock'></div>
                    <p className='text-[#333] text-sm'>{item.Date}</p>
                  </span>
                </div>
                <img
                  className='w-40 h-40 mt-20 rounded-lg'
                  src={item.image}
                  alt='image'
                />
              </li>
            ))
          : null}
      </ul>


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
  );
};

export default MostRecent;
