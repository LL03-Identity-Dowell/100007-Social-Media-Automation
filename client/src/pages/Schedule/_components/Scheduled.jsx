import { useEffect, useState } from "react";
import Loading from "/src/components/Loading.jsx";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";
import axios from "axios";
const ScheduledPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/v1/scheduled-json/",
          {
            withCredentials: true,
          }
        );
        const data = res.data;
        setArticles(data["Scheduled Posts"]);
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
  }, []);

  return (
    <div className='px-20'>
      <h3 className='text-[#495057] font-bold'>
        Total posts count: {articles?.response?.length}
      </h3>
      <ul className='space-y-10 '>
        {error !== "" && <ErrorMessages>{error}</ErrorMessages>}
        {success !== "" && <SuccessMessages>{success}</SuccessMessages>}
        {loading ? (
          <Loading />
        ) : (
          articles?.response?.map((item) => (
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
        )}
      </ul>
    </div>
  );
};

export default ScheduledPage;
