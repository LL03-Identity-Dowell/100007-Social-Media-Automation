import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import CSRFToken from "../../components/CSRFToken";

function Topic({ show }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCategory, setUserCategory] = useState([]);
  const [userTopic, setUserTopic] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [inputs, setInputs] = useState({
    category: "",
    product: "",
    topic: "",
    article: "",
    theme: "",
    purpose: "",
    verb: "",
    adjective: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    show();
    fetchCategoryTopic();
  }, []);

  const fetchCategoryTopic = () => {
    // /Create two Axios GET requests
    const categoryReq = axios.get(
      `${import.meta.env.VITE_APP_WEBSITEBASEURL}/category/`,
      { withCredentials: true }
    );
    const topicReq = axios.get(`${import.meta.env.VITE_APP_WEBSITEBASEURL}/topic/`, {
      withCredentials: true,
    });

    Promise.all([categoryReq, topicReq])
      .then(([categoryRes, topicRes]) => {
        setUserCategory(categoryRes.data);
        setUserTopic(topicRes.data);
      })
      .catch((error) => {
        console.error("Error retrieving Category or Topic:", error);
      });
  };

  const handelChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });

    let yourTopicElement = document.getElementById("id_topic");
    var selectedOption =
      yourTopicElement.options[yourTopicElement.selectedIndex];
    var yourTopic = selectedOption.text;
    setTopicName(yourTopic);
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

    if (!inputs.category || !inputs.topic) {
      setError("Required field(s) missing please fill");
      setTimeout(() => {
        setError("");
        return;
      }, 4000);
    } else {
      setLoading(true);

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

      axios
        .post(`${import.meta.env.VITE_APP_WEBSITEBASEURL}/generate/`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false);
          let resData = response.data;
          setSuccess("Topics created successfully!");
          setTimeout(() => {
            handleSentenceNavigate(resData);
          }, 2000);
        })
        .catch((error) => {
          setLoading(false);
          setError("Error creating topics..!");
          console.error("Error creating topics:", error);
        });

      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  // handle navigation to Ramk page with sentence data
  const handleSentenceNavigate = (sentenceData) => {
    navigate("/rank", { state: { data: sentenceData } });
  };

  return (
    <div>
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className='flex flex-col items-center justify-center pb-10'>
        <div>
          <h1 className='py-4 text-xl font-bold text-customGray md:text-3xl'>
            What is your Topic About?
          </h1>
        </div>

        {/* Sentence preview */}
        <div
          className='flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400'
          role='alert'
        >
          <svg
            className='flex-shrink-0 inline w-4 h-4 mr-3'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
          </svg>
          <span className='sr-only'>Info</span>
          <div>
            <span className='font-medium'>Sample Topic Output:</span> The
            Livinglab was testing workflow ai digital documentation.
          </div>
        </div>

        <form
          className='grid w-full gap-4 mt-4 md:gap-10'
          onSubmit={handleSubmit}
        >
          {/* <CSRFToken/> */}
          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px] '>
              <label htmlFor='category' className='text-lg font-semibold'>
                Category <span className='text-red-600'>*</span>
              </label>
              <p className='md:text-lg'>
                Please select the category that suits you.
              </p>
            </div>

            <div className='relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden'>
              <div className='absolute left-0 flex items-center pl-3 pointer-events-none bottom-8'>
                <span className='w-[65px] border-r border-gray-300 py-4'>
                  Choose
                </span>
              </div>
              <select
                value={inputs.category}
                onChange={handelChange}
                name='category'
                required
                className='block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4'
                placeholder='Search...'
              >
                <option>...</option>
                {userCategory.map((category, index) => (
                  <option value={category.id} key={index}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className='flex flex-row-reverse pt-2'>
                <Link
                  to='/settings/categoriesandtopic'
                  className='bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 items-center justify-center'
                >
                  Add more
                </Link>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Product/Services <span className='text-red-600'>*</span>
              </label>
              <p className='md:text-lg'>
                What is the Product/Services you provide?
              </p>
            </div>
            <div className='relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden'>
              <input
                value={inputs.product}
                onChange={handelChange}
                name='product'
                required
                type='text'
                className='block w-full p-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4'
                placeholder='Type your product and services here..'
              />
            </div>
          </div>

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Topic <span className='text-red-600'>*</span>
              </label>
              <p className='md:text-lg'>
                Specify your Topic from the drop down.
              </p>
            </div>
            <div className='relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden'>
              <div className='absolute left-0 flex items-center pl-3 pointer-events-none bottom-8 '>
                <span className='w-[65px] border-r border-gray-300 py-4'>
                  Choose
                </span>
              </div>
              <select
                id='id_topic'
                value={inputs.topic}
                onChange={handelChange}
                name='topic'
                required
                className='block w-full p-2 pl-[100px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4'
                placeholder='Search...'
              >
                <option>...</option>
                {userTopic.map((topic, index) => (
                  <option value={topic.id} key={index}>
                    {topic.name}
                  </option>
                ))}
              </select>

              <div className='flex flex-row-reverse pt-2'>
                <Link
                  to='/settings/categoriesandtopic'
                  className='bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 items-center justify-center'
                >
                  Add more
                </Link>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Article (optional) <span className='text-red-600'></span>
              </label>
              <p className='md:text-lg'>
                Choose the article you want to use for your title.
              </p>
            </div>
            <div className=' w-[90%] md:w-[50%] xl:w-[40%] flex gap-8'>
              <div className='flex items-center mb-4'>
                <input
                  value='a'
                  onChange={handelChange}
                  id='article'
                  type='radio'
                  name='article'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='article'
                  className='ml-2 text-lg font-medium text-customGray dark:text-gray-500'
                >
                  a
                </label>
              </div>
              <div className='flex items-center mb-4'>
                <input
                  value='an'
                  onChange={handelChange}
                  id='article'
                  type='radio'
                  name='article'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='article'
                  className='ml-2 text-lg font-medium text-customGray dark:text-gray-500'
                >
                  an
                </label>
              </div>
              <div className='flex items-center mb-4'>
                <input
                  onChange={handelChange}
                  id='article'
                  type='radio'
                  value='the'
                  name='article'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='article'
                  className='ml-2 text-lg font-medium text-customGray dark:text-gray-500'
                >
                  the
                </label>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Theme (optional) <span className='text-red-600'></span>
              </label>
              <p className='md:text-lg'>
                Choose whether your topic should be in singular or plural.
              </p>
            </div>
            <div className='w-[90%] md:w-[50%] xl:w-[40%] flex gap-8'>
              <div className='flex items-center mb-4'>
                <input
                  value='singular'
                  onChange={handelChange}
                  id='theme'
                  type='radio'
                  name='theme'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='theme'
                  className='ml-2 text-lg font-medium text-customGray dark:text-gray-500'
                >
                  Singular
                </label>
              </div>
              <div className='flex items-center mb-4'>
                <input
                  onChange={handelChange}
                  id='theme'
                  type='radio'
                  value='plural'
                  name='theme'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='theme'
                  className='ml-2 text-lg font-medium text-customGray dark:text-gray-500'
                >
                  Plural
                </label>
              </div>
            </div>
          </div>

          <hr />

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Purpose <span className='text-red-600'>*</span>
              </label>
              <p className='md:text-lg'>
                Input your descriptive purpose in the input field below. (e.g,
                Digital Documentation)
              </p>
            </div>
            <div className='relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden'>
              <input
                value={inputs.purpose}
                onChange={handelChange}
                name='purpose'
                required
                type='text'
                className='block w-full p-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4'
                placeholder='Type your purpose here..'
              />
            </div>
          </div>

          <hr />

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Verb <span className='text-red-600'>*</span>
              </label>
              <p className='md:text-lg'>Input verb (e.g, Optimise, inform)</p>
            </div>
            <div className='relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden'>
              <input
                value={inputs.verb}
                onChange={handelChange}
                name='verb'
                required
                type='text'
                className='block w-full p-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4'
                placeholder='Type your verb here..'
              />
            </div>
          </div>

          <div className='flex flex-col justify-center w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px]'>
              <label htmlFor='category' className='text-lg font-semibold'>
                Adjectives (optional) <span className='text-red-600'></span>
              </label>
              <p className='md:text-lg'>
                Specify an adjective modifying the object.
              </p>
            </div>
            <div className='relative w-[90%] md:w-[50%] xl:w-[40%] overflow-hidden'>
              <input
                value={inputs.adjective}
                onChange={handelChange}
                name='adjective'
                type='text'
                className='block w-full p-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:py-4'
                placeholder='Type your adjectives here..'
              />
            </div>
          </div>

          {/* Sentence preview */}
          <div className='flex items-center justify-center'>
            <div
              className='flex items-center p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400'
              role='alert'
            >
              <svg
                className='flex-shrink-0 inline w-4 h-4 mr-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
              </svg>
              <span className='sr-only'>Info</span>
              <div>
                <span className='font-medium'>Your sample output:</span>{" "}
                {capitalizeFirstLetter(inputs.article ? inputs.article : "-")}{" "}
                {topicName} (was/had/is) {inputs.verb} (-ing/-ed) (the/a/an){" "}
                {inputs.adjective} {inputs.purpose}
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-end w-full gap-2 mr-6 md:items-center md:gap-8 md:flex-row md:mr-0 '>
            <div className='w-full md:w-[300px] '>
              <button className='px-6 py-2 text-white rounded bg-customBlue md:mr-8'>
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
