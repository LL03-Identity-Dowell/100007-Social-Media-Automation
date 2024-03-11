import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const dowellLoginUrl =
  "https://100014.pythonanywhere.com/?redirect_url=" + window.location.origin;

// const dowellLogoutUrl =
//   "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
//   window.location.origin



export default function useDowellLogin() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(true);
  const [sessionCheckPerformed, setSessionCheckPerformed] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const session_id = urlParams.get("session_id");
  const navigate = useNavigate();

  //   const localSession = sessionStorage.getItem("session_id")
  //     ? JSON.parse(sessionStorage.getItem("session_id"))
  //     : null;

  const getUserInfoOther = async (session_id) => {
    const session = {
      session_id,
    };
  
    const res = await axios({
      method: "post",
      url: "https://100093.pythonanywhere.com/api/userinfo/",
      data: session,
    });
    console.log(res.data);
  
    localStorage.setItem("userInfo", JSON.stringify(res.data));
  };


  axios.defaults.withCredentials = true;
  useEffect(() => {
    // const session_id = searchParams.get("session_id");
    // const id = searchParams.get("id");

    if (session_id) {
      getUserInfoOther(session_id)

      localStorage.setItem("session_id", session_id);
      // sessionStorage.setItem("session_id", session_id);

      const newUrl = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, newUrl);
      //   getUserInfo(session_id);
      const checkSession = async () => {
        if (!sessionCheckPerformed && session_id) {
          setSessionCheckPerformed(true);
          const session = {
            session_id,
          };
          setLoading(true);
          const res = await axios({
            method: "post",
            url: "https://100014.pythonanywhere.com/api/userinfo/",
            data: session,
          });
            console.log(res);
          const data = res.data;
          // const saveUsername = data.userinfo.username;
          // const saveUserInfo = JSON.stringify(saveUsername);
          // console.log(saveUsername);
          // localStorage.setItem("username", saveUsername);
          const userProducts = data.portfolio_info;
          // Check if any product is "Social Media Automation"
          const hasSocialMediaAutomation = userProducts.some(
            (product) => product.product === "Social Media Automation"
          );
          if (!hasSocialMediaAutomation) {
            setLoading(false);
            setProduct(false);
            console.log("You do not have a portfolio", userProducts);
            navigate("/portfolio_check");
          }
          setLoading(false);
        }
      };
      checkSession();
    }
    //  else {
    //   window.location.replace(dowellLoginUrl)
    // }

    if (
      !localStorage.getItem("session_id") 
    ) {
      window.location.replace(dowellLoginUrl);
    }
  }, [navigate]);

  return { loading, product };
}
