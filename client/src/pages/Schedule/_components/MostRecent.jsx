import { useEffect, useState } from "react";
import Loading from "/src/components/Loading.jsx";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";
import { Pagination } from "../../../components/Pagination";

const MostRecent = () => {
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
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/recent_posts?page=${pageNumber}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setSuccess("Successfully fetched articles");
          setArticles({
            list: data["Most Recent Posts"]["response"],
            totalPage: data.total_pages,
            totalPosts: data.total_items,
          });
          setError("");
        }
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
    <div className='px-20'>
      <h3 className='text-[#495057] font-bold text-start'>
        Total posts count: {articles.totalPosts}
      </h3>
      <ul className='space-y-10 '>
        {error !== "" && <ErrorMessages>{error}</ErrorMessages>}
        {success !== "" && <SuccessMessages>{success}</SuccessMessages>}
        {loading ? (
          <Loading />
        ) : articles.totalPosts ? (
          articles.list.map((item) => (
            <li
              id={item?.PK}
              key={item?.PK}
              className='flex justify-between gap-x-10'
            >
              <div className='flex flex-col w-9/12 gap-y-7 '>
                <span className='text-base text-[#0000007c]'>
                  {item?.source}
                </span>
                <h3 className='text-2xl font-bold text-customTextBlue'>
                  {item?.title}
                </h3>
                <p className='text-[#333]'>{item?.paragraph}</p>
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
        ) : null}
        <div className='flex justify-center w-full pr-24'>
          <Pagination
            currentPage={pageNumber}
            setPageNumber={setPageNumber}
            totalPage={articles.totalPage}
          />
        </div>
      </ul>
    </div>
  );
};

export default MostRecent;
