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
  const [name, setName] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    initFlowbite();
  }, []);
  const { loading } = useDowellLogin();
  
  useEffect(() => {
    const checkSession = async () => {
      // if (!sessionCheckPerformed && session_id) {}
      const session_id = localStorage.getItem("session_id");
      axios
        .get(`${import.meta.env.VITE_APP_BASEURL}/main/`, {
          headers: {
            Authorization: `Bearer ${session_id}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data;
          const saveUsername = data?.userinfo?.username;
          console.log(saveUsername);
          setName(saveUsername)
          const saveUseremail = data?.userinfo?.email;
          const saveUserInfo = {username: saveUsername, email: saveUseremail}
          const userInfo = JSON.stringify(saveUserInfo);
          localStorage.setItem("userInfo", userInfo);
          const userProducts = data.portfolio_info;
          // Check if any product is "Social Media Automation"
          const hasSocialMediaAutomation = userProducts.some(
            (product) => product.product === "Social Media Automation"
          );
          if (!hasSocialMediaAutomation) {
            setProduct(false);
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
    <div className='w-full '>
      {loading && <Loading />}
      {product && <Navbar user={isUser} name={name}/>}
      <div
        className={
          !side ? " grid w-full " : "grid grid-cols-10 2xl:grid-cols-12"
        }
      >
        {product && (
          <>
            <div className={show && "col-auto md:col-span-1 hidden md:block"}>
              {side && <Sidebar />}
            </div>
            <div className={show && "md:hidden  absolute"}>
              {side && <BottomBar />}
            </div>
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
