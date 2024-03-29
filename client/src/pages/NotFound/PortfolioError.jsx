import React from "react";
import { Social_media_automation } from "../../assets";

const PortfolioError = () => {
  return (
    
        <div className="fixed flex flex-col justify-center items-center z-100 top-0 bottom-0 left-0 right-0 h-screen">
      <div className="flex flex-col md:flex-row items-center " >
          <div className="flex flex-col justify-center items-center ">
              <img src={Social_media_automation} alt="Social Media" className="w-[70%] "/>
          </div>
          <div className="text-center px-6 md:px-0">
              <p className="text-2xl font-bold mb-4"> <span className="text-red-500">Oops!</span> You Don't Have A Portofolio</p>
              <a className="text-lg bg-yellow-300 rounded-md text-customGray px-6 py-2" href="https://100093.pythonanywhere.com/">Create One Here</a>
          </div>

      </div>
  </div>
      
  );
};

export default PortfolioError;
