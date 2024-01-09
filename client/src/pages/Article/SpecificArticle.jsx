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
      .post(`${import.meta.env.VITE_APP_BASEURL}/article-detail/`, payload, {
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
        </div>
      </div>
    </div>
  );
}
export default SpecificArticle;
