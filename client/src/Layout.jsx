import React, { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import axios from "axios";
import useDowellLogin from "./useDowellLogin";
import BottomBar from "./components/Bottombar/BottomBar";

const Layout = ({ children, side, show, isUser }) => {
  const [product, setProduct] = useState(true);
  // const [loading, setLoading] = useState(false);
  const [sessionCheckPerformed, setSessionCheckPerformed] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    initFlowbite();
    
  }, []);
  const {loading} = useDowellLogin()
  // const clearLocalStorage = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  // };

  // // Set a timeout to clear local storage after 24 hours
  // const clearStorageTimeout = setTimeout(
  //   clearLocalStorage,
  //   24 * 60 * 60 * 1000
  // ); // 24 hours in milliseconds

  // const clearStorageOnUnload = () => {
  //   // Clear the timeout when the user is about to leave the page
  //   clearTimeout(clearStorageTimeout);
  //   // Clear local storage when the user is leaving the page
  //   clearLocalStorage();
  // };

  // useEffect(() => {
  //   // Add event listener for beforeunload
  //   window.addEventListener('beforeunload', clearStorageOnUnload);

  //   // Cleanup: remove the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('beforeunload', clearStorageOnUnload);
  //     // Also clear the timeout to prevent it from triggering after unmount
  //     clearTimeout(clearStorageTimeout);
  //   };
  // }, []);

  // useEffect(() => {
    
  //   const fetchAndRemoveSessionId = async () => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const session_id = urlParams.get("session_id");
  //     console.log(session_id);

  //     if (session_id) {
  //       // Store the session_id in both local storage and session storage
  //       localStorage.setItem("session_id", session_id);
  //       sessionStorage.setItem("session_id", session_id);

  //       // Remove the session_id from the URL without causing a page reload
  //       const newUrl = window.location.href.split("?")[0];
  //       window.history.replaceState({}, document.title, newUrl);
        
  //       // Proceed to fetch data or handle authenticated user logic
  //     } else {
  //       // If no session_id, redirect to the login page with session_id as a query parameter
       
  //       // window.location.href = `https://100014.pythonanywhere.com/?redirect_url=${window.location.origin}`;
  //       window.location.href = 'https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/'
  //     }
  //   };

  //   // fetchAndRemoveSessionId();

  //   // Check if session_id has already been processed to avoid continuous reload
  //   if (
  //     !localStorage.getItem("session_id") &&
  //     !sessionStorage.getItem("session_id")
  //   ) {
  //     fetchAndRemoveSessionId();
  //   }
  // },[]);

  useEffect(() => {
    const checkSession = async () => {
      // if (!sessionCheckPerformed && session_id) {}
      const session_id = localStorage.getItem("session_id");
          axios
            .get(`${import.meta.env.VITE_APP_BASEURL}/main/`, {
              headers: {
                Authorization: `Bearer ${session_id}`,
              },
              withCredentials: true
            })
            .then((res) => {
              const data = res.data;
          const saveUserInfo = JSON.stringify(data);
          localStorage.setItem("userInfo", saveUserInfo);
          const userProducts = data.portfolio_info;
          // Check if any product is "Social Media Automation"
          const hasSocialMediaAutomation = userProducts.some(
            (product) => product.product === "Social Media Automation"
          );
          if (!hasSocialMediaAutomation) {
            setProduct(false)
            console.log("You do not have a portfolio", userProducts);
            navigate("/portfolio_check");
        }
            })
            .catch((err) => {
            
              console.error("Error fetching data:", err);
            });
        
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="w-full ">
      {loading && <Loading />}
      {product && <Navbar user={isUser} />}
      <div
        className={
          !side ? " grid w-full " : "grid grid-cols-10 2xl:grid-cols-12"
        }
      >
        {product && (
          <>
          <div className={show && "col-auto md:col-span-1 hidden md:block"}>{side && <Sidebar />}</div>
          <div className={show && "md:hidden  absolute"}>{side && <BottomBar />}</div>
          </>
          
        )}

        <main
          className={
            !side
              ? "grid w-full "
              : "col-span-12 md:col-span-9 pt-2 pb-12 px-4 md:px-0 md:py-8 2xl:col-span-11  md:ml-16 lg:ml-0 "
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
