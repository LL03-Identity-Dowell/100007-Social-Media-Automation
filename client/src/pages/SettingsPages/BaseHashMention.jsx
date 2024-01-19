import React from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";

const BaseHashMention = () => {
  return (
    <div className="bg-pens bg-cover bg-center h-auto ">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex flex-col items-center justify-start  w-full h-full">
          <div className="flex gap-4 py-6 bg-white w-full justify-center">
            <NavLink
              to="/settings/hastags"
            //   className="pb-12 text-xl font-bold text-customGray xl:text-3xl active:text-customTextBlue"
            className={({ isActive }) =>
                isActive
                  ? "underline text-lg md:text-2xl font-bold text-customTextBlue"
                  : "px-6 text-customBlue text-lg md:text-2xl font-bold"
              }
            >
              # Hashtags
            </NavLink>
            <NavLink
              to="/settings/mentions"
              className={({ isActive }) =>
                isActive
                  ? "underline text-lg md:text-2xl font-bold text-customTextBlue"
                  : "px-6 text-customBlue text-lg md:text-2xl font-bold"
              }
            >
              @ Mentions
            </NavLink>
          </div>
          <div className="w-full mt-20 justify-center items-center flex">

          <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseHashMention;
