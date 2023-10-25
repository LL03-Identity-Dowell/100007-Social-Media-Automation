import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LadyPixel, step1, step2, step3, step4, step5 } from "../../assets";
import Loading from "../../components/Loading";

// import useDowellLogin from "../../hooks/useDowellLogin";

const Home = ({ close }) => {
  // const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    close();
    fetchSessionId(); // Fetch session ID when the component mounts
  }, []);

  const fetchSessionId = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get('session_id');

    if (session_id) {
      // Store the session_id in both local storage and session storage
      localStorage.setItem("session_id", session_id);
      sessionStorage.setItem("session_id", session_id);
      console.log(session_id)
      // Proceed to fetch data or handle authenticated user logic
      setLoading(true)
      fetchData();
    } else {
      // If no session_id, redirect to the login page with session_id as a query parameter
      window.location.href = `https://100014.pythonanywhere.com/?redirect_url=http://localhost:5173/`;
    }
  };

  const fetchData = (session_id) => {
    // Define the API URL
    const apiUrl = "http://127.0.0.1:8000/api/v1/main/";
    
    setLoading(true)
    // Enable sending cookies with the request
    axios.defaults.withCredentials = true;
    
    // Make a GET request to the API endpoint
    axios
    .get(apiUrl,)
    .then((response) => {
      setLoading(false)
      // Store the response data in the component state
      let data = response.data
        localStorage.setItem("userInfo", data);
        // setData(data);
        console.log("Data from API:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


  return (
    <div className="w-[100vw] h-[90vh]">
      {loading && <Loading/>}
      <div className="flex flex-col justify-between md:flex-row">
        <div className="w-full px-2 py-8 text-center xl:px-6">
          <h1 className="text-2xl xl:text-[30px] font-semibold text-customBlue">Automate Your Social Media with Samanta</h1>
          <p className="text-customDarkpuprle font-semibold text-[18px] md:text-[20px] py-4 xl:py-6">Easily Manage all your Social and get Efficient Results</p>

          <div >
            <p className="text-[#6b2722] font-semibold italic text-[18px] md:text-[22px]">Step by Step</p>
            <p className="text-customGray font-semibold text-[18px] md:text-[22px] pb-6">Ordering Process</p>
          </div>

          <div className="flex justify-between xl:gap-10">

            <Link to="/topic">
              <img src={step1} alt="Topic" className="" title='Topic' />
            </Link>

            <Link to="/article">
              <img src={step2} alt="article" className="" title='Articles' />
            </Link>
            <Link to="/post-list">
              <img src={step3} alt="post" className="" title='Post' />
            </Link>
            <Link to="/scheduled">
              <img src={step4} alt="schedule" className="" title='Schedule' />
            </Link>
            <Link to="/comment">
              <img src={step5} alt="comment" className="" title='Comment' />
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={LadyPixel} alt="ladyPixel" className="w-[200px] md:w-[300px] xl:w-[500px] xl:mt-6" />
        </div>
      </div>
    </div>
  );
};

export default Home;
