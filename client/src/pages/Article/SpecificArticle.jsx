import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

function SpecificArticle({ show }) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [articleDetailData, setArticleDetailData] = useState();
  

  useEffect(() => {
    show();

    fetch();
  }, []);

  const location = useLocation();

  const fetch = () => {
    setLoading(true);

    const recievedArticle = location.state.data;

    // console.log(recievedArticle);

    let payload = {
      article_id: recievedArticle.article_id,
      title: recievedArticle.title,
      paragraph: recievedArticle.paragraph,
      source: recievedArticle.source,
    };

    // Make a POST request to the API endpoint with the session_id
    axios
      .post(`http://127.0.0.1:8000/api/v1/article-detail/`, payload, {
        withCredentials: true,
      })
      .then((response) => {
        // setError(null);
        setLoading(false);
        let data = response.data.post;
        // console.log(data);
        setArticleDetailData(data);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error fetching article:", error);
      });
  };

  return (
    <div>
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div>
        <div className="lg:px-6 py-3 mt-2 md:mt-10">
          <div>
            <p className="lg:px-6 px-2 py-6 text-md lg:text-xl text-customTextBlue dark:text-white font-bold">{articleDetailData && articleDetailData.title}</p>
            <hr />
            <p className="lg:px-6 lg:pt-6 px-2 text-md  w-full  leading-loose">{articleDetailData && articleDetailData.paragraph}</p>
            <br />
            <p className="lg:px-6 lg:py-4 px-2 text-md lg:text-lg">{articleDetailData && articleDetailData.sources}</p>
            <br />
          </div>

          {/* <div>
            <div className='md:flex'>
              <div className='w-1/2 p-4'>
                <img
                  src={teacherImg}
                  alt='teacher image'
                  className='w-[200px] md:w-[300px] xl:w-[500px] xl:mt-6'
                />
              </div>
              <div className='w-1/2 md:p-4 md:mt-20 '>
                <div>
                  <label>
                    <b>Qualitative: </b>
                  </label>
                  <select className='p-1 text-xs '></select>
                </div>
                <br />

                <div>
                  <label>
                    <b>Targeted for: </b>
                  </label>
                  <select className='p-1 text-xs '>
                    <option>Apple-Technology</option>
                  </select>
                </div>
                <br />

                <div>
                  <label>
                    <b>Designed for: </b>
                  </label>
                  <select className='p-1 text-xs '>
                    <option>Twitter-uxlivinglab</option>
                  </select>
                </div>
                <br />

                <div>
                  <label>
                    <b>Targeted category: </b>
                  </label>
                  <select className='p-1 text-xs '>
                    <option>Brand</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='border border-t border-black'></div>

          <div className='flex items-center justify-center '>
            <div className='sm:w-1/2'>
              <div className='flex w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <div className='flex-1 p-4 m-2'>298 Word(s)</div>
                <div className='flex-1 p-4 m-2'>2072 Character(s)</div>
                <div className='flex-1 p-4 m-2'>0 Hashtag(s)</div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center '>
            <div className='md:w-1/3 '>
              <div className='flex '>
                <div className='flex-1 md:w-1/3 '>
                  <div className='lg:w-[350px]'>
                    <ExtraSmallBtn title={"Back"} />
                  </div>
                </div>

                <div className='flex-1 md:w-1/2 '>
                  <div className='lg:w-[350px]'>
                    <ExtraSmallBtn title={"Next"} />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default SpecificArticle;
