import React, { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import axios from "axios";

const Layout = ({ children, side, show, isUser }) => {
  const [product, setProduct] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionCheckPerformed, setSessionCheckPerformed] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    initFlowbite();
  }, []);

  axios.defaults.withCredentials = true;
  const clearLocalStorage = () => {
    localStorage.clear();
  };

  // Set a timeout to clear local storage after 24 hours
  const clearStorageTimeout = setTimeout(clearLocalStorage, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

  const clearStorageOnUnload = () => {
    // Clear the timeout when the user is about to leave the page
    clearTimeout(clearStorageTimeout);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', clearStorageOnUnload);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', clearStorageOnUnload);
      // Also clear the timeout to prevent it from triggering after unmount
      clearTimeout(clearStorageTimeout);
    };
  }, []);

  
  useEffect(() => {
    const fetchAndRemoveSessionId = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get("session_id");

      if (session_id) {
        // Store the session_id in both local storage and session storage
        localStorage.setItem("session_id", session_id);
        sessionStorage.setItem("session_id", session_id);
        
        // Remove the session_id from the URL without causing a page reload
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);

        // Proceed to fetch data or handle authenticated user logic
        setLoading(true);
        fetchData(session_id);
      } else {
        // If no session_id, redirect to the login page with session_id as a query parameter
        window.location.href = `https://100014.pythonanywhere.com/?redirect_url=http://localhost:5173/`;
      }
    };

    // fetchAndRemoveSessionId();

    // Check if session_id has already been processed to avoid continuous reload
    if (!localStorage.getItem("session_id") && !sessionStorage.getItem("session_id")) {
      fetchAndRemoveSessionId();
    }
  }, );


  useEffect(() => {
    const checkSession = async () => {
      const session_id = localStorage.getItem('session_id');
      if (!sessionCheckPerformed && session_id) {
        setSessionCheckPerformed(true);

        try {
         
            setLoading(true);
            axios.get('http://127.0.0.1:8000/api/v1/main/', {
            headers: {
              'Authorization': `Bearer ${session_id}`, 
            }
        })
            .then(res=>{
              const data = res.data;
              const saveUserInfo = JSON.stringify(data);
              localStorage.setItem("userInfo", saveUserInfo);
              const userProducts = data.portfolio_info;
              // Check if any product is "Social Media Automation"
              const hasSocialMediaAutomation = userProducts.some(product => product.product === "Social Media Automation");
          
              if (!hasSocialMediaAutomation) {
                setLoading(false);
                setProduct(false);
                console.log("You do not have a portfolio", userProducts);
                navigate('/portfolio_check');
              } 
              
              setLoading(false);
            }).catch(err=>{
              setLoading(false);
              console.error("Error fetching data:", err);
            })
            
            
            
          } catch (error) {
          setLoading(false);
          console.error('Error fetching data:', error);
          // Handle error, e.g., redirect to an error page
        }
      }
    };

    checkSession();
  }, [navigate, sessionCheckPerformed]);

  
  return (
    <div className="w-full ">
            {loading && <Loading />}
      {product && <Navbar user={isUser} />}
      <div
        className={
          !side ? " grid w-full " : "grid grid-cols-10 2xl:grid-cols-12"
        }
      >
        <div className={show && "col-span-1"}>{side && <Sidebar />}</div>

        <main
          className={
            !side
              ? "grid w-full"
              : "col-span-9 py-8 2xl:col-span-11 ml-8 md:ml-16 lg:ml-0 "
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
