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
          `http://127.0.0.1:8000/api/v1/scheduled-json?page=${pageNumber}`,
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
        className={`lg:pt-4 px-2 text-md lg:text-lg text-gray-600 ${
          readMore ? "" : "line-clamp-4"
        } lg:w-[920px]`}
      >
        {text}
      </p>
        {isOverflowed && (
        <span
          onClick={handleReadMore}
          className="text-md lg:text-lg text-customTextBlue cursor-pointer font-semibold px-2"
        >
          {readMore ? "Read Less..." : "Read More..."}
        </span>
      )}
      </div>
    );
  }; 


  return (
    <div className='px-6'>
      <h4 className='ml-5 italic'>Total posts count: {articles?.totalPosts}</h4>
      <ul className='space-y-4 '>
        {error !== "" && <ErrorMessages>{error}</ErrorMessages>}
        {success !== "" && <SuccessMessages>{success}</SuccessMessages>}
        {loading ? (
          <Loading />
        ) : (
          articles?.list?.map((item) => (
            <li
              id={item?.PK}
              key={item?.PK}
              className='flex flex-col justify-between md:flex-row'
            >
              <div className='flex flex-col w-full md:w-9/12 gap-y-3 '>
                <span className='text-base text-[#0000007c] ml-5'>
                  {item?.source}
                </span>
                <p className=' py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold lg:w-[1000px]'>
                  {item?.title}
                </p>
                {/* <p className='lg:pt-4 text-md lg:text-lg line-clamp-4 leading-loose lg:w-[980px] text-gray-500'>
                  {item?.paragraph}
                </p> */}
                <ReadMoreParagraph text={item.paragraph} />
                <span className='flex items-center self-end mt-3 gap-x-2'>
                  <div className='icons8-clock'></div>
                  <p className='text-[#333] text-sm'>{item?.Date}</p>
                </span>
              </div>
              <img
                className='w-full mt-6 rounded-lg md:w-40 aspect-square md:mt-20'
                src={item?.image}
                alt='image'
              />
            </li>
          ))
        )}
      </ul>
      <div className='flex p-0 md:justify-center justify-normal md:w-full md:pr-24 md:mt-14'>
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
