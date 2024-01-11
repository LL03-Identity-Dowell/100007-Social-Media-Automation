import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/Loading";
import { SuccessMessages } from "../../components/Messages";
import { ErrorMessages } from "../../components/Messages";

const CategoriesTopic = ({ close }) => {
  const [inputCategoryText, setinputCategoryText] = useState("");
  const [inputCategoryList, setinputCategoryList] = useState([]);
  const [checkedCategoryList, setcheckedCategoryList] = useState([]);
  const [inputTopicsText, setinputTopicsText] = useState("");
  const [inputTopicsList, setinputTopicsList] = useState([]);
  const [checkedTopicsList, setcheckedTopicsList] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTopics, setCheckedTopics] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState();
  const [topicStatus, setTopicStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState();

  //Categories
  const handleCategoryInputChange = (e) => {
    setinputCategoryText(e.target.value);
  };

  const handleAddCategoryInput = (e) => {
    e.preventDefault();

    if (inputCategoryText) {
      setinputCategoryList([...inputCategoryList, " " + inputCategoryText]);
      setinputCategoryText("");
      setcheckedCategoryList([...checkedCategoryList, false]);
    }
  };

  const handleRemoveCategoryInput = (index) => {
    setinputCategoryList((prevList) => prevList.filter((_, i) => i !== index));
    setcheckedCategoryList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked.splice(index, 1);
      updateSaveButtonState(updatedChecked, checkedTopicsList);
      return updatedChecked;
    });
  };

  const handleCheckboxCategoryChange = (index) => {
    const updatedChecked = [...checkedCategoryList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedCategoryList(updatedChecked);
    setCheckedCategories(inputCategoryList.filter((_, i) => updatedChecked[i]));
    updateSaveButtonState(updatedChecked, checkedTopicsList);
  };

  //Topics
  const handleTopicsInputChange = (e) => {
    setinputTopicsText(e.target.value);
  };

  const handleAddTopicsInput = (e) => {
    e.preventDefault();

    if (inputTopicsText) {
      setinputTopicsList([...inputTopicsList, " " + inputTopicsText]);
      setinputTopicsText("");
      setcheckedTopicsList([...checkedTopicsList, false]);
    }
  };

  const handleRemoveTopicsInput = (index) => {
    setinputTopicsList((prevList) => prevList.filter((_, i) => i !== index));
    setcheckedTopicsList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked.splice(index, 1);
      updateSaveButtonState(checkedCategoryList, updatedChecked);
      return updatedChecked;
    });
  };

  const handleCheckboxTopicsChange = (index) => {
    const updatedChecked = [...checkedTopicsList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedTopicsList(updatedChecked);
    setCheckedTopics(inputTopicsList.filter((_, i) => updatedChecked[i]));
    updateSaveButtonState(checkedCategoryList, updatedChecked);
  };

  //Save Button
  const updateSaveButtonState = (categoryChecked, topicsChecked) => {
    const areAnyChecked =
      categoryChecked.some((value) => value) ||
      topicsChecked.some((value) => value);
    setIsSaveDisabled(!areAnyChecked);
  };

  const fetchCategories = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_WEBSITEBASEURL}/category/`
    );
    //console.log("categories", response.data);
    setCategoryStatus(response.data);
  };

  const fetchTopics = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_WEBSITEBASEURL}/topic/`
    );
    console.log("topics", response.data);
    setTopicStatus(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryStatus) {
      setLoading(true);
      const data = {
        name: checkedCategories.join(","),
      };
      await axios
        .post(`${import.meta.env.VITE_APP_WEBSITEBASEURL}/category/`, data, {
          withCredentials: true,
        })
        .then((response) => {
          // console.log(response);
          setLoading(false);
          setSuccess(null);
          setTimeout(() => {
            setSuccess("Saved successfully!");
          }, 1);
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
        });
    }

    if (topicStatus) {
      setLoading(true);
      const data = {
        name: checkedTopics.join(","),
      };
      await axios
        .post(`${import.meta.env.VITE_APP_WEBSITEBASEURL}/topic/`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false);
          setSuccess(null);
          setTimeout(() => {
            setSuccess("Saved successfully!");
          }, 1);
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
        });
    }
  };

  useEffect(() => {
    close();
    fetchCategories();
    fetchTopics();
  }, []);

  return (
    <div className='bg-pens bg-cover bg-center h-[90vh]'>
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className='bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400'>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div>
            <h2 className='pb-12 text-2xl font-bold text-customBlue xl:text-3xl'>
              Categories and Topic
            </h2>
          </div>
          <form className='w-full px-6' onSubmit={handleSubmit}>
            <div className='flex flex-col w-full gap-6 ml-14 lg:flex-row lg:gap-10'>
              <div className='w-full text-center'>
                <label
                  htmlFor='categories'
                  className='text-lg font-bold text-customBlue'
                >
                  Categories
                </label>
                <div className='flex w-full mt-4 border'>
                  <input
                    type='text'
                    id='categories'
                    value={inputCategoryText}
                    placeholder='Enter Categories..'
                    className='w-80 outline-1'
                    onChange={handleCategoryInputChange}
                  />
                  <button
                    className='px-2 text-white bg-customBlue rounded-r-2xl opacity-90'
                    onClick={handleAddTopicsInput}
                  >
                    Add
                  </button>
                </div>
                <div className='mt-3'>
                  <ul className='flex flex-wrap'>
                    {inputCategoryList.map((name, index) => (
                      <li key={index} className='mb-4 mr-4'>
                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            checked={checkedCategoryList[index]}
                            onChange={() => handleCheckboxCategoryChange(index)}
                            className='w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                          />
                          {name}
                          <button
                            onClick={() => handleRemoveCategoryInput(index)}
                            className='ml-8 text-gray-600'
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className='w-full text-center '>
                <label
                  htmlFor='topic'
                  className='text-lg font-bold text-customBlue'
                >
                  Topic
                </label>
                <div className='flex w-full mt-4 border'>
                  <input
                    type='text'
                    id='topic'
                    value={inputTopicsText}
                    placeholder='Enter Topic..'
                    className='w-80 outline-1'
                    onChange={handleTopicsInputChange}
                  />
                  <button
                    className='px-2 py-0 text-white bg-customBlue rounded-r-2xl opacity-90 cursor-none"
                    '
                    onClick={handleAddTopicsInput}
                  >
                    Add
                  </button>
                </div>
                <div className='mt-3'>
                  <ul className='flex flex-wrap'>
                    {inputTopicsList.map((name, index) => (
                      <li key={index} className='mb-4 mr-4'>
                        <input
                          type='checkbox'
                          checked={checkedTopicsList[index]}
                          onChange={() => handleCheckboxTopicsChange(index)}
                        />{" "}
                        {name}
                        <button
                          onClick={() => handleRemoveTopicsInput(index)}
                          className='ml-8 text-gray-600'
                        >
                          <FaTimes />
                        </button>
                        &nbsp;&nbsp;
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center mt-6 md:mt-16'>
              <button
                type='submit'
                className={`bg-customBlue px-10 py-2 text-white rounded-xl flex items-center gap-3  ${
                  isSaveDisabled &&
                  "bg-customBlue cursor-not-allowed opacity-90"
                } `}
                disabled={isSaveDisabled}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTopic;
