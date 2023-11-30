import React, { useEffect } from "react";

function ViewComments({ show }) {
  useEffect(() => {
    show();
  }, []);

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      <div className="w-[90%] m-auto p-4  text-left text-gray-500 dark:text-gray-400 ">
        <div className="text-3xl md:text-4xl text-center text-customTextBlue">
          Comments
        </div>
        <div className="mt-4 p-2 flex flex-row">
          <img src="" className="border rounded-full h-12 w-12" alt="" />
          <div className="py-4 pl-1 pr-2 ml-1 w-full ">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni,
              repellendus adipisci! Fugiat consequatur repellat optio deleniti
              explicabo modi repudiandae eveniet voluptate aliquam eligendi
              veritatis, est dolor quos laboriosam ipsa recusandae!explicabo
              modi repudiandae eveniet voluptate aliquam eligendi veritatis, est
              dolor quos laboriosam ipsa recusandae!
            </p>

            <div id="display-comments" className=" p-2 mt-4 flex flex-row">
              <img src="" className="border rounded-full h-8 w-8" alt="" />
              <div className="ml-2 px-2 w-full">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
            <div id="display-comments" className=" p-2 mt-4 flex flex-row">
              <img src="" className="border rounded-full h-8 w-8" alt="" />
              <div className="ml-2 px-2 w-full">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
            <div id="display-comments" className=" p-2 mt-4 flex flex-row">
              <img src="" className="border rounded-full h-8 w-8" alt="" />
              <div className="ml-2 px-2 w-full">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
            <div id="display-comments" className=" p-2 mt-4 flex flex-row">
              <img src="" className="border rounded-full h-8 w-8" alt="" />
              <div className="ml-2 px-2 w-full">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewComments;
