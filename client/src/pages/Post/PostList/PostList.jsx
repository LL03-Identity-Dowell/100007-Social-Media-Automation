import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ExtraSmallBtn from "../../../components/ExtraSmallBtn/ExtraSmallBtn";
import Loading from "../../../components/Loading";
import { ErrorMessages } from "../../../components/Messages";

const PostList = ({ show }) => {
  const [postData, setPostData] = useState();
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

  const fetch = () => {
    setLoading(true);

    // Make a GET request to the API endpoint with the session_id
    axios
      .get(
        `http://127.0.0.1:8000/api/v1/post_list/?page=${page + 1}&order=newest`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setError(null);
        setLoading(false);
        let data = response.data;
        // console.log(data)
        setPostData(data.posts);
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

  // handle navigation to post-detail page
  const handlePostdetailNavigate = (post_id, title, paragraph, source) => {
    const dataToSend = {
      post_id: post_id,
      title: title,
      paragraph: paragraph,
      source: source,
    };
    setClickedPost(dataToSend);
    setButtonClicked(true);
  };

  // Use the clickedPost state to determine when to navigate
  useEffect(() => {
    if (buttonClicked && clickedPost) {
      navigate("/post-detail", { state: { data: clickedPost } });
    }
  }, [buttonClicked, clickedPost]);

  // console.log(postData)

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
    <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto'>
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className='py-2 font-semibold text-center text-customTextBlue lg:py-6'>
        <h2 className='text-3xl md:text-4xl '>Post List</h2>
      </div>

      <div className='flex items-center justify-between pt-0 pb-2 count-article'>
        <p className='px-6 py-3 italic'>Total posts count: {count}</p>

        {/* <Link to="/createarticle">
          <div className="lg:w-[140px] lg:pt-2">
            <ExtraSmallBtn title={"Create Article"} />
          </div>
        </Link> */}
      </div>

      <div>
        <div className='overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10'>
          <div className='w-full text-sm text-left text-gray-500 dark:text-gray-400 '>
            <div className='articles'>
              {postData &&
                postData.map((post, index) => (
                  <div className='mt-6 mr-2 article ' key={index}>
                    {/* <p className="px-2 lg:px-6 lg:py-4 text-md lg:text-lg">
                      {post.source}
                    </p> */}
                    <p className='lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold lg:w-[1000px]'>
                      {post.title}
                    </p>

                    <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                      <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg text-gray-600 line-clamp-4 leading-loose lg:w-[1000px]">

                        {post.paragraph}
                      </p>

                      <div className='lg:w-[150px] lg:pt-2 flex justify-end md:mr-6 mt-2 md:mt-0 '>
                        <ExtraSmallBtn
                          title={"View Post"}
                          onClick={() =>
                            handlePostdetailNavigate(
                              post.post_id,
                              post.title,
                              post.paragraph,
                              post.source
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
          previousLabel={<span className="text-black text-xs md:text-md">{page > 0 ? "Previous" : ""}</span>}
          nextLabel={<span className="text-black text-xs md:text-md">{page < pageCount - 1 ? "Next" : " "}</span>}
          containerClassName='flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll '
          pageClassName='p-2 rounded-full cursor-pointer md:text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center'
          previousClassName='p-2 rounded-full cursor-pointer hover:bg-gray-300'
          nextClassName='p-2 rounded-full cursor-pointer hover:bg-gray-300'
          breakClassName='p-2'
          activeClassName='bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 '
        />
        {/* {showMorePages && (
          <button
            className="p-2 text-white rounded-full cursor-pointer bg-customBlue hover:bg-blue-600"
            onClick={loadMorePages}
          >

          </button>
        )} */}
      </div>
    </div>
  );
};

export default PostList;
