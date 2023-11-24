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
  const [getStatus, setGetStatus] = useState();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    //console.log("checkedCategories", checkedCategories);
    //console.log("Join", checkedCategories.join(','))

    // setLoading(true);
    const data = {
      name: checkedCategories.join(","),
      //topics_list: checkedTopics.join(","),
    };

    await axios
      .post(
        "http://127.0.0.1:8000/website/api/v1/category/",
        data,

        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("response", response);
        // setLoading(false);
        // setSuccess(null);
        // setTimeout(() => {
        //   setSuccess("Categories and Topics are updated...!");
        // }, 1);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error making the request. Please try again later.");
      });

      // await axios
      // .post(
      //   "http://127.0.0.1:8000/website/api/v1/topic/",
      //   data,

      //   {
      //     withCredentials: true,
      //   }
      // )
      // .then((response) => {
      //   console.log(response);
      //   setLoading(false);
      //   setSuccess(null);
      //   setTimeout(() => {
      //     setSuccess("Categories and Topics are updated...!");
      //   }, 1);
      // })
      // .catch((error) => {
      //   setLoading(false);
      //   setError("Error making the request. Please try again later.");
      // });
  };

  useEffect(() => {
    close();
  }, []);

  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div>
            <h2 className="text-customBlue font-bold text-2xl xl:text-3xl pb-12">
              Categories and Topic
            </h2>
          </div>
          <form className="w-full px-6" onSubmit={handleSubmit}>
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
                    value={inputCategoryText}
                    placeholder="Enter Categories.."
                    className="border-none bg-white w-full outline-2 outline-blue-400 "
                    onChange={handleCategoryInputChange}
                  />
                  <button
                    className="bg-customTextBlue text-white rounded-r-2xl px-2"
                    onClick={handleAddCategoryInput}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3">
                  <ul className="flex flex-wrap">
                    {inputCategoryList.map((name, index) => (
                      <li key={index} className="mb-4 mr-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checkedCategoryList[index]}
                            onChange={() => handleCheckboxCategoryChange(index)}
                            className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                          />
                          {name}
                          <button
                            onClick={() => handleRemoveCategoryInput(index)}
                            className="ml-8 text-gray-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="text-center w-full ">
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
                    value={inputTopicsText}
                    placeholder="Enter Topic.."
                    className="border-none bg-white w-full"
                    onChange={handleTopicsInputChange}
                  />
                  <button
                    className="bg-customTextBlue text-white rounded-r-2xl px-2"
                    onClick={handleAddTopicsInput}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3">
                  <ul className="flex flex-wrap">
                    {inputTopicsList.map((name, index) => (
                      <li key={index} className="mb-4 mr-4">
                        <input
                          type="checkbox"
                          checked={checkedTopicsList[index]}
                          onChange={() => handleCheckboxTopicsChange(index)}
                        />{" "}
                        {name}
                        <button
                          onClick={() => handleRemoveTopicsInput(index)}
                          className="ml-8 text-gray-600"
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
            <div className="flex justify-center items-center mt-6 md:mt-16">
              <button
                type="submit"
                className={`${
                  isSaveDisabled ? "bg-blue-300 cursor-not-allowed" : ""
                }bg-blue-800 px-10 py-1 text-white rounded-3xl flex items-center gap-3   `}
                disabled={isSaveDisabled}
              >
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
