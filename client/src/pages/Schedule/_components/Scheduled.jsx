import { useEffect, useState } from "react";
import Loading from "/src/components/Loading.jsx";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";
import axios from "axios";
import Pagination  from "../../../components/Pagination";

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
        setSuccess("Successfully fetched articles");
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

  return (
    <div className='px-6'>
      <h3 className='ml-5 italic'>
        Total posts count: {articles?.list?.length}
      </h3>
      <ul className='space-y-4 '>
        {error !== "" && <ErrorMessages>{error}</ErrorMessages>}
        {success !== "" && <SuccessMessages>{success}</SuccessMessages>}
        {loading ? (
          <Loading />
        ) : (
          articles?.list?.map((item) => (
            <li id={item?.PK} key={item?.PK} className='flex justify-between'>
              <div className='flex flex-col w-5/6 gap-y-3 '>
                <span className='text-base text-[#0000007c] ml-5'>
                  {item?.source}
                </span>
                <h3 className='px-2 py-2 font-bold lg:px-6 text-md lg:text-xl text-customTextBlue dark:text-white'>
                  {item?.title}
                </h3>
                <p className='px-2 text-gray-500 lg:px-6 lg:py-4 text-md lg:text-lg'>
                  {item?.paragraph}
                </p>
                <span className='flex items-center self-end gap-x-2'>
                  <div className='icons8-clock'></div>
                  <p className='text-[#333] text-sm'>{item?.Date}</p>
                </span>
              </div>
              <img
                className='w-40 h-40 mt-20 rounded-lg'
                src={item?.image}
                alt='image'
              />
            </li>
          ))
        )}
      </ul>
      <div className='flex justify-center w-full pr-24 mt-14'>
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
