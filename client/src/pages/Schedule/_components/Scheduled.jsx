import { useEffect, useRef, useState } from "react";
import Loading from "/src/components/Loading.jsx";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";
import axios from "axios";
import { Pagination } from "../../../components/Pagination";

const ScheduledPage = () => {
  const [articles, setArticles] = useState({
    list: [],
    totalPage: 0,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/v1/scheduled-json?page=${pageNumber}&order=newest`,
          {
            withCredentials: true,
          }
        );
        const data = res.data;
        setArticles(data["Scheduled Posts"]["response"]);
        setArticles({
          list: data["Scheduled Posts"]["response"],
          totalPage: data.total_page,
          totalPosts: data.total_items,
        });
        setSuccess("Successfully fetched posts");
        setError("");
      } catch (error) {
        setError("Error fetching the articles");
        setSuccess("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNumber]);

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
          className={`lg:pt-4 pr-0 text-md lg:text-lg text-gray-600 ${
            readMore ? "" : "line-clamp-4"
          } lg:w-[920px]`}
        >
          {text}
        </p>
        {isOverflowed && (
          <span
            onClick={handleReadMore}
            className='pr-0 font-semibold cursor-pointer text-md lg:text-lg text-customTextBlue'
          >
            {readMore ? "Read Less..." : "Read More..."}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto overflow-x-hidden'>
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {SuccessMessages && <SuccessMessages>{SuccessMessages}</SuccessMessages>}

      <h3 className='px-4 py-3 pr-0 italic'>
        Total posts count: {articles?.totalPosts}
      </h3>
      <ul className='overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:mb-10 px-0 md:px-2'>
        {articles?.list?.map((item) => (
          <li
            id={item?.PK}
            key={item?.PK}
            className='flex flex-col justify-between mt-4 md:flex-row gap-x-14'
          >
            <div className='flex flex-col w-full md:w-9/12 gap-y-3 '>
              <p className='text-[15px]  lg:py-4 lg:text-lg'>{item.source}</p>
              <p className='py-0 pr-0 text-base font-bold lg:text-xl text-customTextBlue dark:text-white'>
                {item.title}
              </p>

              <ReadMoreParagraph text={item.paragraph} />

              <span className='flex items-center self-end mt-3 gap-x-2'>
                <div className='icons8-clock'></div>
                <p className='text-[#333] text-sm'>{item?.Date}</p>
              </span>
            </div>
            <div className='mr-4 lg:mr-8'>
              <img
                className='h-40 mt-6 rounded-lg w-50 md:mt-20 '
                src={item.image}
                alt='image'
              />
            </div>
          </li>
        ))}
      </ul>
      <div className='flex w-full p-0 md:justify-center md:w-full md:pr-24 md:mt-14'>
        <Pagination
          currentPage={pageNumber}
          setPageNumber={setPageNumber}
          totalPage={articles.totalPage}
        />
      </div>
    </div>
  );
};

export default ScheduledPage;
