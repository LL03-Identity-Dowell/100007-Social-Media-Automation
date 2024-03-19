import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";
import axios from "axios";

const PotfolioOwner = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    close();

    const fetch = ()=>{
        setLoading(true);
        axios
          .get(`${import.meta.env.VITE_APP_BASEURL}/fetch_image/`, {
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
            // setImages(data);
            setSuccess(data.message);
          })
          .catch((error) => {
            setLoading(false);
            setError("Server error, Please try again later");
            console.error("Error fetching post:", error);
          });
    }
    fetch()
  }, []);

  return (
    <div className="bg-pens bg-cover bg-center h-[100vh] ">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl md:text-3xl text-customBlue font-bold text-center pt-8 pb-4">
            Owner's Portfolio
          </h1>
          <p className="">Connect social media accounts for your members</p>
        </div>
        <form action="" className="flex justify-between items-center flex-col md:flex-row px-2 md:px-6 mt-10 gap-4">
          <div className="bg-gray-50 py-4 px-4 rounded-lg w-full md:w-[350px] shadow-xl">
            <div>
              <h3 className="font-semibold text-customBlue pb-2">Title</h3>
            </div>
            <div className="flex justify-between items-center pt-2 ">
              <div className="flex gap-2">
              <FaFacebook className="text-2xl text-blue-700" />
              <FaTwitter className="text-2xl text-blue-500 " />
              <FaInstagram className="text-2xl text-pink-600 " />
              <FaLinkedin className="text-2xl text-blue-800 " />
              <FaYoutube className="text-2xl text-red-700 " />
              <FaPinterest className="text-2xl text-red-600 " />

              </div>
              <button type="button" className="bg-customBlue text-white py-1 px-2 rounded-lg cursor-pointer">Connect</button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default PotfolioOwner;
