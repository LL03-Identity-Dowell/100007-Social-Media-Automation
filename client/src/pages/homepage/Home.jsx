import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LadyPixel, step1, step2, step3, step4, step5 } from "../../assets";
import Loading from "../../components/Loading";

const Home = ({ close }) => {
  // const [product, setProduct] = useState('');
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    close();
    // fetchSessionId();
  }, []);

  // useEffect(() => {
  //   const fetchAndRemoveSessionId = async () => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const session_id = urlParams.get("session_id");

  //     if (session_id) {
  //       // Store the session_id in both local storage and session storage
  //       localStorage.setItem("session_id", session_id);
  //       sessionStorage.setItem("session_id", session_id);

  //       // Remove the session_id from the URL without causing a page reload
  //       const newUrl = window.location.href.split('?')[0];
  //       window.history.replaceState({}, document.title, newUrl);

  //       // Proceed to fetch data or handle authenticated user logic
  //       setLoading(true);
  //       fetchData();
  //     } else {
  //       // If no session_id, redirect to the login page with session_id as a query parameter
  //       window.location.href = `https://100014.pythonanywhere.com/?redirect_url=http://localhost:5173/`;
  //     }
  //   };

  //   // Check if session_id has already been processed to avoid continuous reload
  //   if (!localStorage.getItem("session_id") && !sessionStorage.getItem("session_id")) {
  //     fetchAndRemoveSessionId();
  //   }
  // }, []);

  // const fetchSessionId = async () => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const session_id = urlParams.get("session_id");

  //   if (session_id) {
  //     // Store the session_id in both local storage and session storage
  //     localStorage.setItem("session_id", session_id);
  //     sessionStorage.setItem("session_id", session_id);
  //     // console.log(session_id);
  //     const newUrl = window.location.href.split('?')[0];
  //     window.history.replaceState({}, document.title, newUrl);
  //     // Proceed to fetch data or handle authenticated user logic
  //     setLoading(true);
  //     fetchData();
  //   } else {
  //     // If no session_id, redirect to the login page with session_id as a query parameter
  //     window.location.href = `https://100014.pythonanywhere.com/?redirect_url=http://localhost:5173/`;
  //   }
  // };

  // const fetchData = async () => {
  //   // Define the API URL
  //   setLoading(true);
  //   const apiUrl = "http://127.0.0.1:8000/api/v1/main/";
  //   axios.defaults.withCredentials = true;

  //   try {
  //     const res = await axios.get(apiUrl);
  //     if (res.status === 200) {
  //       const data = res.data;
  //       const saveUserInfo = JSON.stringify(data);
  //       localStorage.setItem("userInfo", saveUserInfo);
  //       console.log(data);
  //       // setProduct(data.portfolio_info[0].product)
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <div className="w-[100vw] h-[90vh]">
      {/* {loading && <Loading />} */}
      <div className="flex flex-col justify-between md:flex-row">
        <div className="w-full px-2 py-8 text-center xl:px-6">
          <h1 className="text-2xl xl:text-[30px] font-semibold text-customBlue">
            Automate Your Social Media with Samanta
          </h1>
          <p className="text-customDarkpuprle font-semibold text-[18px] md:text-[20px] py-4 xl:py-6">
            Easily Manage all your Social and get Efficient Results
          </p>

          <div>
            <p className="text-[#6b2722] font-semibold italic text-[18px] md:text-[22px]">
              Step by Step
            </p>
            <p className="text-customGray font-semibold text-[18px] md:text-[22px] pb-6">
              Ordering Process
            </p>
          </div>

          <div className="flex justify-between xl:gap-10">
            <Link
              to="/topic"
              data-tooltip-target="tooltip-defaultT"
              data-tooltip-placement="bottom"
            >
              <div
                id="tooltip-defaultT"
                role="tooltip"
                className="w-[300px] absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-customGray rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                Generate Topics for your article by filling the form accordingly
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
              <img src={step1} alt="Topic" className=""/>
            </Link>

            <Link to="/article" data-tooltip-target="tooltip-defaultA"
              data-tooltip-placement="bottom">
                <div
                id="tooltip-defaultA"
                role="tooltip"
                className="w-[300px] absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-customGray rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                After generating and ranking Topics, create the article by cliking the create article and choose how you want to create your article with the option we have.
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
              <img
                src={step2}
                alt="article"
                className=""
              />
            </Link>
            <Link to="/post-list" data-tooltip-target="tooltip-defaultP"
              data-tooltip-placement="bottom">
                <div
                id="tooltip-defaultP"
                role="tooltip"
                className="w-[300px] absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-customGray rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                After creating Article, select the post you want to post by clicking on the view posts and send. You canaslo make any neccessary changes like editing the article and images.
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
              <img
                src={step3}
                alt="post"
                className=""
              />
            </Link>
            <Link to="/unscheduled" data-tooltip-target="tooltip-defaultS"
              data-tooltip-placement="bottom">
            <div
                id="tooltip-defaultS"
                role="tooltip"
                className="w-[300px] absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-customGray rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                After sending the artcile from the post details page, You can now see the article here, then you can either choose to post or schedule. Select the social media account you want to publish the post then send.
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
              <img
                src={step4}
                alt="schedule"
                className=""
                title=" "
              />
            </Link>
            <Link to="/comment" data-tooltip-target="tooltip-defaultC"
              data-tooltip-placement="bottom">
            <div
                id="tooltip-defaultC"
                role="tooltip"
                className="w-[300px] absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-customGray rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                Get the list of all the posts you have and alos the list of comments from each and every posts
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
              <img
                src={step5}
                alt="comment"
                className=""
              />
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={LadyPixel}
            alt="ladyPixel"
            className="w-[200px] md:w-[300px] xl:w-[500px] xl:mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
