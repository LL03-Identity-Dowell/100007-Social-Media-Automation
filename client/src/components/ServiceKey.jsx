import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation } from "react-router";

export const ServiceKey = ({ isMessages, check }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handelClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    console.log(check, location);
    if (location) {
        setIsOpen(check);  
    }
    
    setInterval(() => {
        setIsOpen(check);
        
    }, 10000);
   
  }, [location]);

  return (
    <div
      className={
        !isOpen
          ? "hidden"
          : "fixed top-0 h-[100vh] flex justify-center items-center w-full z-50 bg-overlay"
      }
    >
      <div className="relative">
        <span
          className="border-2 border-gray-900 p-2 text-xs rounded-full absolute md:top-0 md:-right-12 right-4 top-2 cursor-pointer"
          onClick={handelClose}
        >
          <FaTimes />
        </span>
        <div className="bg-white py-8 px-10 rounded-lg">{isMessages}</div>
      </div>
    </div>
  );
};
