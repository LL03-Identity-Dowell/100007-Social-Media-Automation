import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/Loading";
import { SuccessMessages } from "../../components/Messages";
import { ErrorMessages } from "../../components/Messages";
import { Link } from "react-router-dom";

const Hashtags = ({ close }) => {
  const [inputHashtagText, setinputHashtagText] = useState("");
  const [inputHashtagList, setinputHashtagList] = useState([]);
  const [checkedHashtagList, setcheckedHashtagList] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [checkedHashtags, setCheckedHashtags] = useState([]);
  const [getStatus, setGetStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState();
  const [group, setGroups] = useState();
  const [isAddGroup, setIsAddGroup] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    close();
    fetch();
  }, []);

  const handleHashtagInputChange = (e) => {
    setinputHashtagText(e.target.value);
    //console.log(inputHashtagText);
  };
  
  const handleAddHashtagInput = (e) => {
    e.preventDefault();

    if (inputHashtagText) {
      setinputHashtagList([...inputHashtagList, "#" + inputHashtagText]);
      // console.log("from hashtaglist", inputHashtagList);
      setinputHashtagText("");
      setcheckedHashtagList([...checkedHashtagList, false]);
    }
  };
  
  // const handleAddInput = (e) => {
  //   handleAddHashtagInput(e);
  //   handleAddMentionsInput(e);
  // };
  const handleRemoveHashtagInput = (index) => {
    setinputHashtagList((prevList) => prevList.filter((_, i) => i !== index));
    setcheckedHashtagList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked.splice(index, 1);
      updateSaveButtonState(updatedChecked);
      return updatedChecked;
    });
  };
  
  const handleCheckboxHashtagChange = (index) => {
    const updatedChecked = [...checkedHashtagList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedHashtagList(updatedChecked);
    //console.log(checkedHashtagList);
    setCheckedHashtags(inputHashtagList.filter((_, i) => updatedChecked[i]));
    updateSaveButtonState(updatedChecked);
  };
  
  const updateSaveButtonState = (hashtagChecked) => {
    const areAnyChecked = hashtagChecked.some((value) => value);
    // ||
    // mentionsChecked.some((value) => value);
    setIsSaveDisabled(!areAnyChecked);
  };
  const fetch = () => {
    // Make a GET request to the API endpoint with the session_id
    axios
      .get(
        `${import.meta.env.VITE_APP_WEBSITEBASEURL}/hash-tags-and-mentions/`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        let data = response.data.status;
        setGetStatus(data);
      })
      .catch((error) => {
        setError("Server error, Please try again later");
        //console.error("Error fetching user-approval:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (getStatus === "update") {
      setLoading(true);
      const data = {
        hashtag_list: checkedHashtags.join(","),
        // mentions_list: checkedMentions.join(","),
      };

      setSuccess("");
      setError("");

      //console.log("from update", data);
      await axios
        .put(
          `${
            import.meta.env.VITE_APP_WEBSITEBASEURL
          }/update-hash-tags-and-mentions/`,
          data,

          {
            withCredentials: true,
          }
        )
        .then(() => {
          setLoading(false);
          setSuccess("Hashtags and mentions are updated...!");
          // setinputMentionsList([]);
          setinputHashtagList([]);
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
        });
    } else if (getStatus === "insert") {
      setLoading(true);
      const payloadBody = {
        field: {
          hashtag_list: checkedHashtags.join(),
          // mentions_list: checkedMentions.join(),
        },
      };
      //console.log("from insert", payloadBody)
      await axios
        .post(
          `${import.meta.env.VITE_APP_WEBSITEBASEURL}/hash-tags-and-mentions/`,
          payloadBody,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setLoading(false);
          if (!success) {
            setSuccess("Hashtags and mentions are sent successfully...!");
            // setinputMentionsList([]);
            setinputHashtagList([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
        });
    }
  };

  const handleGroupCheck = () => {
    if (group) {
      console.log(group);
      setIsSelected(true);
    }
  };

  const handleAddGroup = () => {
    setIsAddGroup(!isAddGroup);
  };

  return (
    <>
    <div className={`w-full px-4 md:px-8`}>
            <div className="flex justify-between gap-12 flex-col items-center w-full">
              <div className="w-full md:w-[60%]">
                <label
                  htmlFor="hashtags"
                  className="text-xl font-bold text-customBlue"
                >
                  Select Hashtag Group
                </label>
                <button
                  className="float-right border rounded-xl bg-customTextBlue cursor-pointer text-white py-1 px-2 text-xs"
                  onClick={handleAddGroup}
                >
                  Add group
                </button>
                <div
                  className={`${
                    !isAddGroup ? "hidden" : "block"
                  } bg-overlay w-full h-full fixed z-50 top-0 left-0 flex justify-center items-center `}
                >
                  <div className="bg-white w-[50%] 2xl:w-[40%] p-6 rounded-lg relative">
                    <span
                      className="border-2 border-gray-900 p-2 text-xl rounded-full absolute top-0 -right-12 cursor-pointer"
                      onClick={handleAddGroup}
                    >
                      <FaTimes />
                    </span>
                    <div className="">
                      <input
                        type="text"
                        id="hashtags"
                        // value={inputHashtagText}
                        // onChange={handleHashtagInputChange}
                        placeholder="Enter Hashtags Group.."
                        className="w-full outline-1 rounded-lg"
                      />
                    </div>
                    <button className="mt-4 bg-customGray w-full text-center text-white py-2 rounded-lg hover:bg-customTextBlue cursor-pointer">
                      Save
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full mt-6">
                  <select
                    name=""
                    id=""
                    className="w-full outline-1 rounded-lg text-customGray"
                    onChange={(e) => setGroups(e.target.value)}
                  >
                    <option value="">...</option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Food">Food</option>
                  </select>
                  <button
                    className="mt-4 bg-customGray text-center text-white py-2 rounded-lg hover:bg-customTextBlue cursor-pointer"
                    onClick={handleGroupCheck}
                  >
                    Next
                  </button>
                </div>
              </div>

              {isSelected && (
                <div className="w-full  md:w-[60%] rounded-lg">
                  <form onSubmit={handleSubmit}>
                    <label
                      htmlFor="hashtags"
                      className="text-xl font-bold text-customBlue"
                    >
                      {group}
                    </label>
                    <div className="flex w-full mt-4 border">
                      <span className="p-2 text-lg text-gray-600 bg-gray-400 rounded-l-md">
                        #
                      </span>
                      <input
                        type="text"
                        id="hashtags"
                        value={inputHashtagText}
                        onChange={handleHashtagInputChange}
                        placeholder="Enter Hashtags.."
                        className="w-full outline-1"
                      />
                      <button
                        className={`px-2 py-0 text-white bg-customBlue rounded-r-2xl ${
                          !inputHashtagText
                            ? "opacity-90 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        }`}
                        onClick={handleAddHashtagInput}
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-3">
                      <ul className="flex flex-wrap">
                        {inputHashtagList.map((name, index) => (
                          <li key={index} className="mb-4 mr-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={checkedHashtagList[index]}
                                onChange={() =>
                                  handleCheckboxHashtagChange(index)
                                }
                                className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {name}
                              <button
                                onClick={() => handleRemoveHashtagInput(index)}
                                className="ml-8 text-gray-600 cursor-pointer"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="submit"
                      className={`mt-6 bg-customBlue text-white py-2 rounded-lg w-full hover:bg-customTextBlue text-center  ${
                        isSaveDisabled ?
                        "bg-customGray cursor-not-allowed opacity-90" : "cursor-pointer"
                      } `}
                      disabled={isSaveDisabled}
                    >
                      Save
                    </button>
                  </form>

                  {/* <div className='flex w-full mt-6 border'>
                  <span className='p-2 text-lg text-gray-600 bg-gray-400 rounded-l-md'>
                    #
                  </span>
                  <input
                    type='text'
                    id='hashtags'
                    value={inputHashtagText}
                    onChange={handleHashtagInputChange}
                    placeholder='Enter Hashtags..'
                    className='w-80 outline-1'
                  />
                  <button
                    className={`px-2 py-0 text-white bg-customBlue rounded-r-2xl ${
                      !inputHashtagText
                        ? "opacity-90 cursor-not-allowed"
                        : "cursor-pointer opacity-100"
                    }`}
                    onClick={handleAddHashtagInput}
                  >
                    Add
                  </button>
                </div>
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      // checked={checkedHashtagList[index]}
                      // onChange={() => handleCheckboxHashtagChange(index)}
                      className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    #webdevs
                    <button
                      // onClick={() => handleRemoveHashtagInput(index)}
                      className="ml-8 text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      // checked={checkedHashtagList[index]}
                      // onChange={() => handleCheckboxHashtagChange(index)}
                      className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    #webdevs
                    <button
                      // onClick={() => handleRemoveHashtagInput(index)}
                      className="ml-8 text-gray-600"
                    >
                      <FaTimes />
                    </button>
                 
                  </div> */}
                </div>
              )}
            </div>
          </div>
    
    </>
  );
};

export default Hashtags;
