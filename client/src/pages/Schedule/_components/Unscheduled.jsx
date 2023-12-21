import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Loading from "../../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../../components/Messages";
import { PostModal, ScheduleModal } from "./Modal";

const UnscheduledPage = () => {
  const [unscheduledPost, setUnscheduledPost] = useState([]);
  const [socialArr, setSocialArr] = useState([]);
  const [sucessMessage, setSuccessMessage] = useState(null);
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
  // const [readMore, setReadMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    //Load unscheduled data from API
    const url = `http://127.0.0.1:8000/api/v1/unscheduled-json/?page=${
      page + 1
    }&order=newest`;

    const linkedAcc = "http://127.0.0.1:8000/api/v1/linked-account/";
    const fetchLinkedAcc = async () => {
      try {
        const res = await axios.get(linkedAcc, {
          withCredentials: true,
        });
        setSocialArr(res.data.response);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUnscheduled = async () => {
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          setError(null);
          setLoading(false);
          setSuccess("Successfully fetched posts");
          let unscheduledData = response.data.Unscheduled_Posts.response;
          setUnscheduledPost(unscheduledData);
          if(response.data.total_items <= 0){
            setIsEmpty("You do not have any post")
          }
          setCount(response.data.total_items);
          setPageCount(Math.ceil(response.data.total_items / perPage));
          setShowMorePages(pageCount > pagesToDisplay);
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          setSuccess(null);
          setLoading(false);
          setError("Server error, Please try again later");

          console.error("Error fetching article:", error);
        });
    };
    fetchUnscheduled();
    fetchLinkedAcc();
  }, [page]);

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
          className={`lg:pt-4 px-2 text-md lg:text-lg text-gray-600 ${
            readMore ? "" : "line-clamp-4"
          } lg:w-[920px]`}
        >
          {text}
        </p>
        {isOverflowed && (
          <span
            onClick={handleReadMore}
            className='px-2 font-semibold cursor-pointer text-md lg:text-lg text-customTextBlue'
          >
            {readMore ? "Read Less..." : "Read More..."}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className='relative max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto mb-6'>
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {sucessMessage && <SuccessMessages>{sucessMessage}</SuccessMessages>}
      <p className="text-red-600 mt-10 text-xl lg:mr-12">{isEmpty}</p>

      <h3 className='px-4 py-3 italic'>Total posts count: {count}</h3>
      <ul className=' lg:h-auto grid gap-6 lg:mb-10 mb-6 '>
        {unscheduledPost.map((item) => (
          <li
            id={item.PK}
            key={item.PK}
            className='flex flex-col justify-between md:flex-row gap-x-14 mt-4'
          >
            <div className='flex flex-col md:w-9/12 gap-y-7 '>
              <p className='px-2 lg:py-4 text-md lg:text-lg'>{item.source}</p>
              <p className='px-2 py-0 font-bold text-md lg:text-xl text-customTextBlue dark:text-white'>
                {item.title}
              </p>

              <ReadMoreParagraph text={item.paragraph} />
              <div className="mr-4 lg:mr-8 block md:hidden">
                      <img
                        className="w-full h-50 rounded-lg mt-6 md:mt-20 "
                        src={item.image}
                        alt="image"
                      />
                    </div>
              <div className='self-end space-x-8'>
                <PostModal
                  article={item}
                  setError={setError}
                  setLoading={setLoading}
                  setSuccessMessage={setSuccessMessage}
                  socialArr={socialArr}
                />
                <ScheduleModal
                  article={item}
                  setError={setError}
                  setLoading={setLoading}
                  setSuccessMessage={setSuccessMessage}
                  socialArr={socialArr}
                ></ScheduleModal>
              </div>
            </div>
            <div className="mr-4 lg:mr-8 hidden md:block">
                      <img
                        className="w-50 h-40 rounded-lg mt-6 md:mt-20 "
                        src={item.image}
                        alt="image"
                      />
                    </div>
            {/* <img
              className='w-40 h-40 mt-6 md:mt-20 rounded-lg'
              src={item.image}
              alt='image'
            /> */}
          </li>
        ))}
      </ul>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pagesToDisplay}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        previousLabel={
          <span className='text-black text-xs md:text-lg'>{page > 0 ? "Previous" : ""}</span>
        }
        nextLabel={
          <span className='text-black text-xs md:text-lg'>
            {page < pageCount - 1 ? "Next" : " "}
          </span>
        }
        containerClassName='flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll md:overflow-x-auto'
        pageClassName='p-2 rounded-full cursor-pointer md:text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center'
        previousClassName='p-2 rounded-full cursor-pointer hover:bg-gray-300'
        nextClassName='p-2 rounded-full cursor-pointer hover:bg-gray-300'
        breakClassName='p-2'
        activeClassName='bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600 '
      />
    </div>
  );
};

export default UnscheduledPage;
