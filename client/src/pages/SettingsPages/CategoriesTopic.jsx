import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa";

const CategoriesTopic = ({ close }) => {
  useEffect(() => {
    close();
  }, []);
  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div>
            <h2 className="text-customBlue font-bold text-2xl xl:text-3xl pb-12">
              Categories and Topic
            </h2>
          </div>
          <form className="w-full px-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
              <div className="text-center w-full">
                <label
                  htmlFor="categories"
                  className="text-customBlue text-lg font-bold"
                >
                  Categories
                </label>
                <div className="mt-4 w-full border flex">
                  <input
                    type="text"
                    id="categories"
                    placeholder="Enter Categories.."
                    className="border-none bg-white w-full outline-2 outline-blue-400 "
                  />
                  <button className="bg-customTextBlue text-white rounded-r-2xl px-2">
                    Add
                  </button>
                </div>
              </div>
              <div className="text-center w-full">
                <label
                  htmlFor="topic"
                  className="text-customBlue text-lg font-bold"
                >
                  Topic
                </label>
                <div className="mt-4 w-full border flex">
                  <input
                    type="text"
                    id="topic"
                    placeholder="Enter Topic.."
                    className="border-none bg-white w-full"
                  />
                  <button className="bg-customTextBlue text-white rounded-r-2xl px-2">
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mt-6 md:mt-16">
              <button className="bg-customTextBlue px-4 py-2 text-white rounded-md flex items-center gap-3">
                Save <FaCheck />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTopic;
