import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import axios from "axios";

const PotfolioOwner = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    close();

    const fetch = () => {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_APP_BASEURL}/link/profiles/`, {
          withCredentials: true,
        })
        .then((response) => {
          setError(null);
          setLoading(false);
          let data = response.data;
          console.log(data);
          // if (data.length <= 0) {
          //   setIsEmpty("You don't have any images to select from")
          // }
          setPortfolioData(data);
          setSuccess(data.message);
        })
        .catch((error) => {
          setLoading(false);
          setError("Server error, Please try again later");
          console.error("Error fetching post:", error);
        });
    };
    fetch();
  }, []);

  const handleConnect = (profileKey) => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_APP_BASEURL}/link/profile/${profileKey}/`, {
        withCredentials: true,
      })
      .then((response) => {
        setError(null);
        setLoading(false);
        let data = response.data;
        console.log(data.url);
        const redirectUrl = data.url
        window.open(redirectUrl, "_blank");
       
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error fetching post:", error);
      });
  };

  return (
    <div className="bg-pens bg-cover bg-center h-[100vh] ">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl md:text-3xl text-customBlue font-bold text-center pt-8 pb-4">
            Connect/Add Social Media Accounts
          </h1>
          <p className="">Connect social media accounts for your members</p>
        </div>
        <form
          action=""
          className="grid md:grid-cols-3 px-2 md:px-6 mt-10 gap-4"
        >
          {portfolioData &&
            portfolioData.map((item, index) => (
              <div
                className="bg-gray-50 py-4 px-4 rounded-lg w-full shadow-xl"
                key={index}
              >
                <div>
                  <h3 className="font-semibold text-customBlue pb-2">
                    {item.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center pt-2 ">
                  <div className="flex gap-2">
                    {!item.aryshare_details && (
                      <p className="text-sm text-red-600">No accounts linked</p>
                    )}

                    {item.aryshare_details &&
                      item.aryshare_details.social_platforms &&
                      item.aryshare_details.social_platforms.includes(
                        "facebook"
                      ) && (
                        <FaFacebook className="text-3xl text-blue-700 md:text-5xl" />
                      )}
                    {item.aryshare_details &&
                      item.aryshare_details.social_platforms &&
                      item.aryshare_details.social_platforms.includes(
                        "instagram"
                      ) && <FaInstagram className="text-2xl text-pink-600 " />}
                    {item.aryshare_details &&
                      item.aryshare_details.social_platforms &&
                      item.aryshare_details.social_platforms.includes(
                        "linkedin"
                      ) && <FaLinkedin className="text-2xl text-blue-800 " />}
                    {item.aryshare_details &&
                      item.aryshare_details.social_platforms &&
                      item.aryshare_details.social_platforms.includes(
                        "youtube"
                      ) && <FaYoutube className="text-2xl text-red-700 " />}
                    {item.aryshare_details &&
                      item.aryshare_details.social_platforms &&
                      item.aryshare_details.social_platforms.includes(
                        "twitter"
                      ) && <FaTwitter className="text-2xl text-blue-500 " />}
                    {item.aryshare_details &&
                      item.aryshare_details.social_platforms &&
                      item.aryshare_details.social_platforms.includes(
                        "pinterest"
                      ) && <FaPinterest className="text-2xl text-red-600 " />}
                  </div>
                  <button
                    type="button"
                    onClick={()=>handleConnect(item.profileKey)}
                    className="bg-customBlue text-white py-1 px-2 rounded-lg cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
        </form>
      </div>
    </div>
  );
};

export default PotfolioOwner;
