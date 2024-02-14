import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Wikipidia = ({ close }) => {
  const location = useLocation();
  const { state } = location;
  const { data } = state;

  useEffect(() => {
    close();
  }, []);

  return (
    <div className="max-w-7xl mx-auto lg:w-[900px] h-[95vh] flex justify-center items-start px-4 mt-6 md:mt-12">
      <div className=" text-center ">
        <h1 className="text-3xl lg:text-4xl font-bold text-customGray text-center">
          Article Not Found
        </h1>
        <p className="text-md md:text-xl pt-6 pb-12 text-customBlue">{data}</p>
        <Link
          to="/createarticle"
          className="bg-customGray text-white py-2 md:py-3 md:px-8 px-4 rounded-md"
        >
          Go back
        </Link>
      </div>
    </div>
  );
};

export default Wikipidia;
