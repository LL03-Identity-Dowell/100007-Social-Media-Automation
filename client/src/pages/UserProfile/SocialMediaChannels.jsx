import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const SocialMediaChannels = () => {
  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div>
            <h2 className="text-customBlue font-bold text-2xl xl:text-4xl pb-12">
            My Channels
            </h2>
          </div>
          <div className="flex gap-4">
            <FaFacebook className="text-5xl text-blue-700"/> 
            <FaTwitter className="text-5xl text-blue-500"/> 
            <FaInstagram className="text-5xl text-pink-600"/> 
            <FaLinkedin className="text-5xl text-blue-800"/>
            <FaYoutube className="text-5xl text-red-700"/>
            <FaPinterest className="text-5xl text-red-600"/>
          </div>
          <div className="flex justify-center items-center mt-6 md:mt-8">
            <Link
              to="/"
              className="bg-customBlue px-10 py-2 text-white rounded-md  flex items-center gap-3"
            >
              Connect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaChannels;
