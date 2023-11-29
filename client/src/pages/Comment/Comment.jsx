import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

import { DummyData } from "./Data";

function Comment({ show }) {
  
  useEffect(() => {
    show();
    
  }, []);

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
        <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
          <h2 className="text-3xl md:text-4xl ">Comments</h2>
        </div>
        <div className="comments">
          {DummyData.map((item) => (
            <div className="w-[90%] m-auto " key={item.id}>
              <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue dark:text-white font-bold ">
                {item.title}
              </p>
              <div className="flex flex-col md:flex-row justify-between items-baseline py-0">
                <p className="lg:px-6 lg:pt-4 px-2 text-md lg:text-lg w-full line-clamp-4 leading-loose">
                  {item.text}
                </p>
              </div>
              <Link to={`/comment/${item.id}`}>
              <div className=" lg:pt-2 flex justify-end md:mr-6 mt-2 md:mt-0 ">
                <ExtraSmallBtn title={"View Comments"} />
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comment;
