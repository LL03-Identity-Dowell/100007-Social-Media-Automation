import React, { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";

function Topic({ show }) {
  const [loading, setLoading] = useState(false);
  const [userCategory, setUserCategory] = useState([])
  const [userTopic, setUserTopic] = useState([])
  const [topicName, setTopicName] = useState("")
  const [inputs, setInputs] = useState({
    category: "",
    product: "",
    topic: "",
    article: "",
    theme: "",
    purpose: "",
    verb: "",
    adjective: "",
    success: "",
    error: "",
    loading: false,
  });

  useEffect(() => {
    show();
    fetchCategoryTopic();
  }, []);


  const fetchCategoryTopic = () => {
    // Create two Axios GET requests
    const categoryReq = axios.get("http://127.0.0.1:8000/website/api/v1/category/", { withCredentials: true, });
    const topicReq = axios.get("http://127.0.0.1:8000/website/api/v1/topic/", { withCredentials: true, });

    Promise.all([categoryReq, topicReq])
      .then(([categoryRes, topicRes]) => {
        setUserCategory(categoryRes.data);
        setUserTopic(topicRes.data);
      })
      .catch(error => {
        console.error('Error retrieving Category or Topic:', error);
      });
  }

  // console.log(userCategory);

  const handelChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });

    let yourTopicElement = document.getElementById("id_topic");
    var selectedOption = yourTopicElement.options[yourTopicElement.selectedIndex];
    var yourTopic = selectedOption.text;
    setTopicName(yourTopic);
    // const obj = e.target
    // console.log(obj);
  };

  function capitalizeFirstLetter(word) {
    if (word.length === 0) {
      return word; // Return the word as-is if it's empty
    }

    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);

    return firstLetter + restOfWord;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setInputs({
      ...inputs,
      loading: true
    });

    const data = {
      target_product: inputs.product,
      category: inputs.category,
      topic: inputs.topic,
      object: inputs.purpose,
      verb: inputs.verb,
      adjective: inputs.adjective,
      object_determinant: inputs.article,
      subject_number: inputs.theme,
    };
    console.log(data);

    axios
      .post(`http://127.0.0.1:8000/website/api/v1`, data, {
        withCredentials: true,
      })
      .then((response) => {
        setInputs({
          ...inputs,
          loading: false
        });

        let resData = response.data;
        console.log(resData);

        setInputs({
          ...inputs,
          success: "Topic created successful..!",
        });

        // setSuccess(resData.message)
        // setTimeout(() => {
        //   navigate("/unscheduled");
        // }, 2000);

      })
      .catch((error) => {
        setInputs({
          ...inputs,
          error: "Error creating topic..!",
          loading: false
        });
        console.error("Error creating topic:", error);
      });


    // setInputs({
    //   ...inputs,
    //   success: "Topic created successful..!",
    //   // error: "Error creating topic..!",
    //   loading: true
    // });


    // setTimeout(() => {
    //   setInputs({
    //     category: "",
    //     product: "",
    //     topic: "",
    //     article: "",
    //     theme: "",
    //     purpose: "",
    //     verb: "",
    //     adjective: "",
    //     loading: false,
    //   });

    // }, 2000)
  };

  return (
    <div>
      {inputs.loading && <Loading />}
      {inputs.success && <SuccessMessages>{inputs.success}</SuccessMessages>}
      {inputs.error && <ErrorMessages>{inputs.error}</ErrorMessages>}
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
                {
                  userCategory.map((category, index) => (
                    <option value={category.id} key={index}>{category.name}</option>
                  ))
                }

                {/* <option value="list2">List2</option>
                <option value="list3">List3</option> */}
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
                id="id_topic"
                value={inputs.topic}
                onChange={handelChange}
                name="topic"
                topicname
                required
                className="block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Search..."
              >
                <option>...</option>
                {
                  userTopic.map((topic, index) => (
                    <option value={topic.id} key={index}>{topic.name}</option>
                  ))
                }

                {/* <option value="list1">List1</option>
                <option value="list2">List2</option>
                <option value="list3">List3</option> */}
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
                Choose whether your topic should be in singular or plural
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
                Specify your purpose from the drop down and iunput your
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
                Input verb (e.g, Optimise, inform)
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
                Input adjectives (e.g, Optimise,
                inform)
              </p>
            </div>
            <div className="relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden">
              <input
                value={inputs.adjective}
                onChange={handelChange}
                name="adjective"
                required
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4"
                placeholder="Type your adjectives here.."
              />
            </div>
          </div>

          {/* Sentence preview */}
          <div className="flex items-center justify-center">
            <div className="flex items-center p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
              <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Your sample output:</span> {capitalizeFirstLetter(inputs.article)} {topicName} (was/had/is) {inputs.verb} (-ing/-ed) (the/a/an) {inputs.adjective} {inputs.purpose}
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
