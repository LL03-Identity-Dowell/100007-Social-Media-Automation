import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/Loading";
import { SuccessMessages } from "../../components/Messages";
import { ErrorMessages } from "../../components/Messages";
import { Link } from "react-router-dom";
import EditHashtag from "./EditHashtag";

const Hashtags = ({ close }) => {
  const [inputHashtagText, setinputHashtagText] = useState("");
  const [inputHashtagList, setinputHashtagList] = useState([]);
  const [checkedHashtagList, setcheckedHashtagList] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [checkedHashtags, setCheckedHashtags] = useState([]);
  const [isFetched, setIsFetched] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState();
  const [groupInput, setGroupInput] = useState("");

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
      .get(`${import.meta.env.VITE_APP_BASEURL}/group-hashtags/`, {
        withCredentials: true,
      })
      .then((response) => {
        let data = response.data.group_hastag_list;
        console.log(data);

        setIsFetched(data);
      })
      .catch((error) => {
        setError("Server error, Please try again later");
        //console.error("Error fetching user-approval:", error);
      });
  };

  const handleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      group_name: groupInput,
      hashtags: checkedHashtags.join(","),
    };

    axios
      .post(
        `${import.meta.env.VITE_APP_BASEURL}/group-hashtags/`,
        data,

        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
        setSuccess(res.data.detail);
        setGroupInput("");
        setinputHashtagList([]);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError("Error making the request. Please try again later.");
      });
  };

  return (
    <>
      <div className={`w-full px-4 md:px-8`}>
        {loading && <Loading />}
        {success && <SuccessMessages>{success}</SuccessMessages>}
        {error && <ErrorMessages>{error}</ErrorMessages>}
        <div className="flex justify-between gap-12 flex-col items-center w-full">
          <div className="w-full md:w-[60%]">
            <label
              htmlFor="hashtags"
              className="text-xl font-bold text-customBlue"
            >
              Enter Hashtag Group
            </label>
            <button
              className="float-right border rounded-xl bg-customTextBlue cursor-pointer text-white py-1 px-2 text-xs"
              onClick={handleEditing}
            >
              Edit group
            </button>

            {/* Group Modal */}
            {isEditing && <EditHashtag close={handleEditing} />}

            <form
              onSubmit={handleGroupSubmit}
              className="flex flex-col w-full mt-6"
            >
              {/* <select
                name=""
                id=""
                className="w-full outline-1 rounded-lg text-customGray"
                onChange={(e) => setGroups(e.target.value)}
              >
                <option>...</option>
                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="Food">Food</option>
              </select> */}
              <div className="">
                <input
                  type="text"
                  id="hashtags"
                  // value={inputHashtagText}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder="Enter Hashtags Group.."
                  className="w-full outline-1 rounded-lg"
                />
              </div>

              <div className="flex w-full mt-4 border">
                <span className="p-2 text-lg text-gray-600 bg-gray-400 rounded-l-md">
                  #
                </span>
                <input
                  type="text"
                  id="hashtags"
                  value={inputHashtagText}
                  onChange={handleHashtagInputChange}
                  placeholder="Enter Hashtags (eg. Fashion)"
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
                          onChange={() => handleCheckboxHashtagChange(index)}
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
                className={`mt-2 bg-customBlue text-white py-2 rounded-lg w-full hover:bg-customTextBlue text-center  ${
                  isSaveDisabled
                    ? "bg-customBlue cursor-not-allowed opacity-90"
                    : "cursor-pointer"
                } `}
                disabled={isSaveDisabled}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hashtags;
