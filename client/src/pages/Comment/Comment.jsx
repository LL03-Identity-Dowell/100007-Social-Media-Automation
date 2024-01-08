import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

import axios from "axios";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import CommentModal from "./_components/CommentModal";
import PostedTo from "./_components/PostedTo";
import Loading from "../../components/Loading";
import ReactPaginate from "react-paginate";

function Comment({ show }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState("");
  const [pagesToDisplay] = useState(4);
  const [showMorePages, setShowMorePages] = useState(false);

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const url = `${import.meta.env.VITE_APP_BASEURL}/comments/?page=${page + 1
    }&order=newest`;
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          let data = response.data.paginated_posts;
          setCommentList(data);
          if(data.total_items <= 0){
            setIsEmpty("You do not have any posts")
          }
          setSuccess("successfully fetch the comments");
          setError("");
          setCount(response.data.length);
          setCount(response.data.total_items);
          setPageCount(Math.ceil(response.data.total_items / perPage));
          setShowMorePages(pageCount > pagesToDisplay);
          window.scrollTo(0, 0);
        })
        .catch(() => {
          setError("Server error, Please try again later");
          setSuccess("");
        });
      setLoading(false);
    };
    fetchComments();
  }, [page]);

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  return (
    <>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />}
      <div className='relative  max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto mb-6'>
        <div className='w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-6'>
          <div className='py-2 font-semibold text-center text-customTextBlue lg:py-6'>
            <h2 className='text-3xl md:text-4xl '>Comments</h2>
          </div>
          <h3 className='px-4 py-3 italic'>Total posts count: {count}</h3>
            <p className="text-red-600 mt-10 text-xl lg:mr-12">{isEmpty}</p>
          
          <ul className='space-y-12 mt-6'>
            {commentList.map((item) => (
              <li className=' m-auto list-none' key={item.article_id}>
                <div className='flex items-center justify-between'>
                  <p className='px-2 py-0 font-bold lg:px-6 text-md lg:text-xl text-customTextBlue dark:text-white '>
                    {item.title}
                  </p>
                  <PostedTo socials={item?.post_response?.posts[0]?.postIds} />
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
                  <Link to={`/comment/${item.article_id}`}>
                    <ExtraSmallBtn title={"View Comments"} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={pagesToDisplay}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          previousLabel={<span className="text-black text-xs md:text-lg">{page > 0 ? "Previous" : ""}</span>}
          nextLabel={<span className="text-black text-xs md:text-lg">{page < pageCount - 1 ? "Next" : " "}</span>}
          containerClassName="flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll md:overflow-x-auto"
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
