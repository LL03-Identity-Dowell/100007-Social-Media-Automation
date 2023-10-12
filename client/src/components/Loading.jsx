import React from "react";
import { spinner } from "../assets";

const Loading = () => {
  return <div className=" w-full h-[100vh] flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-50">
    <img src={spinner} alt="spinner" className="w-[200px]"/>
  </div>;
};

export default Loading;
