import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const HashtagAndMentions = ({ onclick, onsubmit }) => {
  const [selectOptions, setSelectOptions] = useState();

  console.log(selectOptions);
  return (
    <div>
      <div
        className={`bg-overlay w-full h-full fixed z-50 top-0 left-0 flex justify-center items-center `}
      >
        <form
          onSubmit={onsubmit}
          className="bg-white w-[50%] 2xl:w-[40%] p-6 rounded-lg relative"
        >
          <span
            className="border-2 border-gray-900 p-2 text-xl rounded-full absolute top-0 -right-12 cursor-pointer"
            onClick={onclick}
          >
            <FaTimes />
          </span>
          <div className="flex flex-col w-full ">
            <div className="md:flex justify-between items-center mb-6">
              <div>
                <p className="text-lg text-customBlue font-semibold">
                  Select a hastag group (Optional)
                </p>
                <p className="text-customDarkpuprle ">Include your favourite hashtags to this post by selecting your saved group.</p>
              </div>
              <Link
                to="/settings/hastags"
                className="float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs"
              >
                Add hastags
              </Link>
            </div>
            <select
              name=""
              id=""
              className="w-full outline-1 rounded-lg text-customGray"
              onChange={(e) => setSelectOptions(e.target.value)}
            >
              <option>...</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Food">Food</option>
            </select>
            <button
              className="mt-4 bg-customBlue text-center text-white py-2 rounded-lg hover:bg-customTextBlue cursor-pointer"
              //   onClick={}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HashtagAndMentions;
