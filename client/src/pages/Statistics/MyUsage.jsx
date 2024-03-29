import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCoins, FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";

function MyUsage({ close }) {
  const [totalCredits, setTotalCredits] = useState();
  const [totalArticle, setTotalArticle] = useState();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userInfo"));
    setTotalCredits(user?.credit);
    close();
    const fetchArticle = ()=>{
      axios.get(
        `${import.meta.env.VITE_APP_BASEURL}/list-articles/`,
        { withCredentials: true }
      ).then(res=>{
        setTotalArticle(res.data.total_items)
      }).catch(err=>{
        console.log(err);
      })
    }
    fetchArticle()
  }, []);


  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div className="flex justify-center items-center flex-col">
            <h2 className="text-customBlue font-bold text-2xl xl:text-4xl pb-6">
              Current Plan: Startup
            </h2>
            <a
              href="https://ll05-ai-dowell.github.io/100105-DowellApiKeySystem/" target="_blank"
              className="bg-customBlue px-4 py-2 text-white rounded-md "
            >
              Upgrade
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center mt-6 md:mt-10 gap-4 md:gap-8">
            <div className="bg-customBlue rounded-md py-6 px-12 flex flex-col justify-center items-center text-white w-[250px]">
              <FaCoins className="text-8xl " />
              <h3 className="text-lg py-4 font-bold whitespace-nowrap">Current Balance (credits)</h3>
              <h6 className="font-bold">{totalCredits}</h6>
            </div>
            <div className="bg-customBlue rounded-md py-6 px-10 flex flex-col justify-center items-center text-white w-[250px]">
              <FaFile className="text-8xl " />
              <h3 className="text-lg py-4 font-bold">Generated Content</h3>
              <h6 className="font-bold">{totalArticle}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyUsage;
