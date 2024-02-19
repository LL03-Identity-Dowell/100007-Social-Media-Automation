import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

import axios from "axios";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import CommentModal from "./_components/CommentModal";
import PostedTo from "./_components/PostedTo";
import Loading from "../../components/Loading";
import ReactPaginate from "react-paginate";
import { useQuery } from "react-query";

function Comment({ show }) {
  const location = useLocation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [perPage] = useState(5);
  const [activePage, setActivePage] = useState(0);
  const [isEmpty, setIsEmpty] = useState("");
  const [pagesToDisplay] = useState(4);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  // const [comments, setComments] = useState({
  //   paginatedPosts: [],
  //   page: page,
  //   totalPages: 0,
  //   totalItems: 0,
  // });

  const navigate = useNavigate();

  // const count = comments.totalItems;

  useEffect(() => {
    show();
  }, []);

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     setLoading(true);
  //     const url = `${import.meta.env.VITE_APP_BASEURL}/comments/?page=${
  //       page + 1
  //     }&order=newest`;
  //     await axios
  //       .get(url, {
  //         withCredentials: true,
  //       })
  //       .then((response) => {
  //         const { paginated_posts, page, total_pages, total_items } =
  //           response.data;

  //         if (Array.isArray(total_items) && total_items <= 0) {
  //           setIsEmpty("You do not have any posts");
  //           setSuccess("");
  //           setError("You do not have any posts");
  //         } else {
  //           setSuccess("Successfully Fetched the posts");
  //           setError("");
  //           setComments({
  //             paginatedPosts: paginated_posts,
  //             page,
  //             totalPages: total_pages,
  //             totalItems: total_items,
  //           });
  //         }
  //         setShowMorePages(comments.totalPages > pagesToDisplay);
  //         window.scrollTo(0, 0);
  //       })
  //       .catch(() => {
  //       setLoading(false);
  //         setError(error?.response?.data?.platforms.join(", "));
  //         setSuccess("");
  //       });
  //     setLoading(false);
  //   };
  //   fetchComments();
  // }, [page]);

  const page = parseInt(new URLSearchParams(location.search).get("page")) || 0;

  const { data: paginated_posts, status, isLoading, refetch } = useQuery(
    ["comment", page],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASEURL}/comments/?page=${
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
      setSuccess("Comments Fetched successfully");
      setCount(paginated_posts.total_items);
      setPageCount(Math.ceil(paginated_posts.total_items / perPage));
    } else if (status === "error") {
      setError("Error Fetching data, Please try again");
      setLoading(false)
    }
    window.scrollTo(0, 0);

    setActivePage(page);
  }, [
    status,
    perPage,
    page,
    activePage,
    navigate,
    location.pathname,
  ]);

  const handlePageClick = (data) => {
    setLoading(true);
    const selectedPage = data.selected;
    navigate(`${location.pathname}?page=${selectedPage}`);
  };

  return (
    <>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading || isLoading ? <Loading /> : null}
      <div className='relative mx-auto mb-6 overflow-y-hidden max-w-7xl lg:h-auto lg:overflow-y-auto'>
        <div className='w-full mb-6 text-sm text-left text-gray-500 dark:text-gray-400'>
          <div className='py-2 font-semibold text-center text-customTextBlue lg:py-6'>
            <h2 className='text-3xl md:text-4xl '>Comments</h2>
          </div>
          <h3 className='px-4 py-3 italic'>Total posts count: {count}</h3>

          <ul className='mt-6 space-y-12'>
            {paginated_posts && paginated_posts.paginated_posts.map((item) => {
              const redirectForComment = () => {
                // console.log(item);
                if (item?.post_response) {
                  navigate(`/comment/${item.article_id}`);
                } else {
                  setError("The post does not have aryshare ID");
                }
                setTimeout(() => {
                  setError("");
                }, 2000);
              };
              return (
                <li className='m-auto list-none ' key={item.article_id}>
                  <p className='mt-10 text-xl text-red-600 lg:mr-12'>
                    {isEmpty}
                  </p>
                  <div className='flex items-center justify-between'>
                    <p className='px-2 py-0 font-bold lg:px-6 text-md lg:text-xl text-customTextBlue dark:text-white '>
                      {item.title}
                    </p>
                    <PostedTo
                      socials={item?.post_response?.posts[0]?.postIds}
                    />
                  </div>
                  <div className='flex flex-col items-baseline justify-between py-0 md:flex-row'>
                    <p className='w-full px-2 leading-loose lg:px-6 lg:pt-4 text-md lg:text-lg line-clamp-4'>
                      {item.paragraph}
                    </p>
                  </div>

                  <div className='flex justify-end gap-8 mt-2 lg:pt-2 md:mr-6 md:mt-4'>
                    <CommentModal
                      id={item.article_id}
                      socials={item?.post_response?.posts[0]?.postIds}
                      setError={setError}
                      setSuccess={setSuccess}
                      setLoading={setLoading}
                    />
                    <button onClick={redirectForComment}>
                      <ExtraSmallBtn title={"View Comments"} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
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
              {page < paginated_posts?.total_items / 5 - 1 ? "Next" : " "}
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
    </>
  );
}

export default Comment;
