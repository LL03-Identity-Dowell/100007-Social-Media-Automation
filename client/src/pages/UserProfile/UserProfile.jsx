import React, { useEffect } from "react";
import { FaMailBulk, FaMap, FaMapMarkedAlt, FaUser, FaUserCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserProfile = ({ close }) => {
  useEffect(() => {
    close();
  }, []);
  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div className="flex justify-center items-center flex-col">
            <h2 className="text-customBlue font-bold text-2xl xl:text-4xl pb-3">
            Welcome!
            </h2>
            <h4 className="text-customBlue font-semibold text-2xl xl:text-3xl pb-6">
            UserName
            </h4>
            
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center mt-6 md:mt-10 gap-4 md:gap-14 xl:gap-16 ">
            <Link to="/" className=" text-customBlue hover:text-customTextBlue flex items-center flex-col">
                <FaUser className="text-[100px]"/>
                <h5 className="font-bold pt-4">View Client's Profile</h5>
            </Link>
            <Link to="/social-media-channels" className=" text-customBlue hover:text-customTextBlue flex items-center flex-col">
                <FaMailBulk className="text-[100px]"/>
                <h5 className="font-bold pt-4">Social Media Channels</h5>
            </Link>
            <Link to="/" className=" text-customBlue hover:text-customTextBlue flex items-center flex-col">
                <FaMapMarkedAlt className="text-[100px]"/>
                <h5 className="font-bold pt-4">Targeted Cities</h5>
            </Link>
            <Link to="/user-approval" className=" text-customBlue hover:text-customTextBlue flex items-center flex-col">
                <FaUserCheck className="text-[100px]"/>
                <h5 className="font-bold pt-4">Approval by clients</h5>
            </Link>
            <Link to="/" className=" text-customBlue hover:text-customTextBlue flex items-center flex-col">
                <FaUser className="text-[100px]"/>
                <h5 className="font-bold pt-4">View Team</h5>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
