import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";

function Topic({ show }) {
  const [inputs, setInputs] = useState({
    category: "",
    product: "",
    topic: "",
    article: "",
    theme: "",
    purpose: "",
    verb: "",
    adjectives: "",
    success: "",
    error: "",
    loading: false,
  });

  useEffect(() => {
    show();
  }, []);

  const handelChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      category: inputs.category,
      product: inputs.product,
      topic: inputs.topic,
      article: inputs.article,
      theme: inputs.theme,
      purpose: inputs.purpose,
      verb: inputs.verb,
      adjectives: inputs.adjectives,
    };
    setInputs({
      ...inputs,
      success: "Topic created successful..!",
      // error: "Error creating topic..!",
      loading: true
    });
    console.log(data);

    setTimeout(() => {
      setInputs({
        category: "",
        product: "",
        topic: "",
        article: "",
        theme: "",
        purpose: "",
        verb: "",
        adjectives: "",
        loading: false,
      });

    }, 2000)
  };

  return (
    <div>
      {inputs.loading && <Loading />}
      {inputs.success && <SuccessMessages>{inputs.success}</SuccessMessages>}
      {inputs.success && <ErrorMessages>{inputs.error}</ErrorMessages>}
      <div className="flex flex-col justify-center items-center pb-10">

        <div>
          <h1 className="font-bold text-customGray text-xl md:text-3xl py-4">
            What is your Topic About?
          </h1>
        </div>

        {/* Sentence preview */}
        <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Sample Topic Output:</span> The Livinglab was testing workflow ai digital documentation.
          </div>
        </div>

        <form
          className="w-full mt-4 grid gap-4 md:gap-10"
          onSubmit={handleSubmit}
        >
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
                value={inputs.category}
                onChange={handelChange}
                name="category"
                required
                className="block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Search..."
              >
                <option >...</option>
                <option value="list1" >List1</option>
                <option value="list2">List2</option>
                <option value="list3">List3</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px]">
              <label htmlFor="category" className="text-lg font-semibold">
                Product/Services <span className="text-red-600">*</span>
              </label>
              <p className="md:text-lg">
                What is the Product/Services you provide.
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              <input
                value={inputs.product}
                onChange={handelChange}
                name="product"
                required
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
                value={inputs.topic}
                onChange={handelChange}
                name="topic"
                required
                className="block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Search..."
              >
                <option>...</option>
                <option value="list1">List1</option>
                <option value="list2">List2</option>
                <option value="list3">List3</option>
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
              <div className="flex items-center mb-4">
                <input
                  value="a"
                  onChange={handelChange}
                  required
                  id="article"
                  type="radio"
                  name="article"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="article"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  a
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  value="an"
                  onChange={handelChange}
                  required
                  id="article"
                  type="radio"
                  name="article"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="article"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  an
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  onChange={handelChange}
                  id="article"
                  type="radio"
                  value="the"
                  name="article"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="article"
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
              <div className="flex items-center mb-4">
                <input
                  value="singular"
                  onChange={handelChange}
                  required
                  id="theme"
                  type="radio"
                  name="theme"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="theme"
                  className="ml-2 text-lg font-medium text-customGray dark:text-gray-500"
                >
                  Singular
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  onChange={handelChange}
                  id="theme"
                  type="radio"
                  value="plural"
                  name="theme"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="theme"
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
                Specify your purpose from thr drop down and iunput your
                discriptive purpose in the input field below. (e.g, Digital
                Documentation)
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              <input
                value={inputs.purpose}
                onChange={handelChange}
                name="purpose"
                required
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
                value={inputs.verb}
                onChange={handelChange}
                name="verb"
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
                You can use comma to seperate the adjectives (e.g, Optimise,
                inform)
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              <input
                value={inputs.adjectives}
                onChange={handelChange}
                name="adjectives"
                required
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Type your adjectives here.."
              />
            </div>
          </div>

          {/* Sentence preview */}
          <div class="flex items-center justify-center">
            <div className="flex items-center p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
              <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Your sample output:</span> --------------------------------
              </div>
            </div>
          </div>

          <div className="flex justify-end md:items-center gap-2 md:gap-8 flex-col md:flex-row mr-6 md:mr-0 w-full ">
            <div className="w-full md:w-[300px] ">
              <button className="bg-customYellow rounded py-2 px-6 md:mr-8">
                Submit
              </button>
            </div>
          </div>
        </form>


      </div>
    </div>
  );
}

export default Topic;
