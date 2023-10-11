import React, { useEffect } from "react";

function Topic({ show }) {
  useEffect(() => {
    show();
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center pb-10">
        <div>
          <h1 className="font-bold text-customGray text-xl md:text-3xl py-4">
            What is your Topic About?
          </h1>
        </div>
        <form className="w-full mt-4 grid gap-4 md:gap-10">

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px] ">
              <label htmlFor="category" className="text-lg font-semibold">
                Category <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                Please select the category that suits you.
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                <span className="w-[65px] border-r border-gray-300 py-4">
                  Choose
                </span>
              </div>
              <select
                className="block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Search..."
              >
                <option value="">List1</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Product/Services <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                What is the Product/Services
                you provide.
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              
              <input
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Type your product and services here.."
              />
            </div>
          </div>

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Topic <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                Specify your Topic from the drop down and input your discritive
                topic in the input feild below
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                <span className="w-[65px] border-r border-gray-300 py-4">
                  Choose
                </span>
              </div>
              <select
                className="block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Search..."
              >
                <option value="">List1</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Article <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                Choose the article you want to use for your title
              </p>
            </div>
            <div className=" w-[90%] md:w-[50%] xl:w-[40%] flex gap-8">
              <div class="flex items-center mb-4">
                <input
                  id="article"
                  type="radio"
                  value=""
                  name="article"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="article"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  a
                </label>
              </div>
              <div class="flex items-center mb-4">
                <input
                  id="article"
                  type="radio"
                  value=""
                  name="article"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="article"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  an
                </label>
              </div>
              <div class="flex items-center mb-4">
                <input
                  id="article"
                  type="radio"
                  value=""
                  name="article"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="article"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  the
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Theme <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                Choose whether youyr topic should be in singular or plural
              </p>
            </div>
            <div className="w-[90%] md:w-[50%] xl:w-[40%] flex gap-8">
              <div class="flex items-center mb-4">
                <input
                  id="theme"
                  type="radio"
                  value=""
                  name="theme"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="theme"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  Singular
                </label>
              </div>
              <div class="flex items-center mb-4">
                <input
                  id="theme"
                  type="radio"
                  value=""
                  name="theme"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="theme"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  Plural
                </label>
              </div>
            </div>
          </div>

          <hr />

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Purpose <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                Specify your purpose from thr drop down and iunput your discriptive purpose in the input field below. (e.g, Digital Documentation)
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              
              <input
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Type your purpose here.."
              />
            </div>
          </div>

          <hr />

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Verb <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                You can use comma to seperate the verbs (e.g, Optimise, inform)
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              
              <input
                required
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Type your verb here.."
              />
            </div>
          </div>

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
              Adjectives <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                You can use comma to seperate the adjectives (e.g, Optimise, inform)
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              
              <input
                required
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Type your adjectives here.."
              />
            </div>
          </div>

          <div className="flex justify-end md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px] ">
              <button className="bg-customYellow rounded py-2 px-6 md:mr-8">Submit</button>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Topic;
