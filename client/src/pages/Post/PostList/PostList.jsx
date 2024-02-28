import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import ExtraSmallBtn from "../../../components/ExtraSmallBtn/ExtraSmallBtn";
import Loading from "../../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../../components/Messages";
import { useQuery } from "react-query";

const PostList = ({ show }) => {
  const [isProductKey, setIsProductKey] = useState();
  const location = useLocation();
  // const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [success, setSuccess] = useState(false);
  // const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState("");
  const [pagesToDisplay] = useState(4);
  const [showMorePages, setShowMorePages] = useState(false);

  const [buttonClicked, setButtonClicked] = useState(false);
  const [clickedPost, setClickedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    show();

    // fetch();
  }, []);

  useEffect(() => {
    const productKey = localStorage.getItem("productKey");
    setIsProductKey(productKey);
  }, []);

  // const fetch = () => {
  //   setLoading(true);

  //   // Make a GET request to the API endpoint with the session_id
  //   axios
  //     .get(
  //       `${import.meta.env.VITE_APP_BASEURL}/post_list/?page=${page + 1}&order=newest`,
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((response) => {
  //       setError(null);
  //       setLoading(false);
  //       let data = response.data;

  //       if(data.total_items <= 0){
  //         setIsEmpty("You do not have any posts")
  //       }
  //       setPostData(data.posts);
  //       setCount(data.total_items);
  //       setPageCount(Math.ceil(data.total_items / perPage));
  //       setShowMorePages(pageCount > pagesToDisplay);
  //       window.scrollTo(0, 0);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       setError("Server error, Please try again later");
  //       console.error("Error fetching article:", error);
  //     });
  // };

  // handle navigation to post-detail page
  
  const page = parseInt(new URLSearchParams(location.search).get("page")) || 0;

  const {
    data: posts,
    status,
    isLoading,
    refetch,
  } = useQuery(
    ["posts", page],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASEURL}/post_list/?page=${
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

  const handlePostdetailNavigate = (post_id, title, paragraphs, article, source) => {
    if (isProductKey) {
      navigate("/");
    } 
    const dataToSend = {
      post_id: post_id,
      title: title,
      paragraph: paragraphs,
      article: article,
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

  useEffect(() => {
    if (status === "success") {
      setSuccess("Posts Fetched successfully");
      setCount(posts.total_items);
      setPageCount(Math.ceil(posts.total_items / perPage));
    } else if (status === "error") {
      setError("Error Fetching data, Please try again");
    }
    window.scrollTo(0, 0);

    setActivePage(page);
  }, [status, posts, perPage, page, activePage, navigate, location.pathname]);

  const handlePageClick = (data) => {
    setLoading(true);
    const selectedPage = data.selected;
    navigate(`${location.pathname}?page=${selectedPage}`);
  };

  return (
    <div className="relative  max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto mb-6">
      {loading || isLoading ? <Loading /> : null}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      <div className="py-2 font-semibold text-center text-customTextBlue lg:py-6">
        <h2 className="text-3xl md:text-4xl ">Post List</h2>
      </div>

      <div className="flex items-center justify-between pt-0 pb-2 count-article">
        <p className="px-6 py-3 italic">Total posts count: {count}</p>

        {/* <Link to="/createarticle">
          <div className="lg:w-[140px] lg:pt-2">
            <ExtraSmallBtn title={"Create Article"} />
          </div>
        </Link> */}
      </div>
      <p className="text-red-600 mt-10 text-xl lg:mr-12">{isEmpty}</p>
      <div className="mb-6">
        <div className=" lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              {posts &&
                posts.posts.map((post, index) => (
                  <div className="mt-6 mr-2 article " key={index}>
                    {/* <p className="px-2 lg:px-6 lg:py-4 text-md lg:text-lg">
                      {post.source}
                    </p> */}
                    <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold lg:w-[1000px]">
                      {post.title}
                    </p>

                    <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                      {post.paragraphs ? (
                        <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg text-gray-600 line-clamp-4 leading-loose lg:w-[1000px]">
                          {post.paragraphs}
                        </p>
                      ) : (
                        <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg text-gray-600 line-clamp-4 leading-loose lg:w-[1000px]">
                          {post.article}
                        </p>
                      )}

                      <div className="lg:w-[150px] lg:pt-2 flex justify-end md:mr-6 mt-2 md:mt-0 ">
                        <ExtraSmallBtn
                          title={"View Post"}
                          onClick={() =>
                            handlePostdetailNavigate(
                              post.post_id,
                              post.title,
                              post.paragraphs,
                              post.article,
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
            {page < posts?.total_items / 5 - 1 ? "Next" : " "}
          </span>
        }
        containerClassName="flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll md:overflow-auto "
        pageClassName="p-2 rounded-full cursor-pointer text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
        previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
        nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
        breakClassName="p-2"
        activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 "
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
