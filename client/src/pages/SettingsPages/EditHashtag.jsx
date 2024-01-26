import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const EditHashtag = ({ close }) => {
  const [inputHashtagText, setinputHashtagText] = useState("");
  const [inputHashtagList, setinputHashtagList] = useState([]);
  const [checkedHashtagList, setcheckedHashtagList] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [checkedHashtags, setCheckedHashtags] = useState([]);
  const [selectOptions, setSelectOptions] = useState("");
  const [isFetched, setIsFetched] = useState("");
  const [getStatus, setGetStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [groupInput, setGroupInput] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState();
  const [hashtagList, setHashtagList] = useState([]);

  useEffect(() => {
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
    fetch();

    if (
      selectOptions &&
      selectOptions.hashtags &&
      Array.isArray(selectOptions.hashtags)
    ) {
      setHashtagList(selectOptions.hashtags);
    }
  }, [selectOptions.group_name]);

  const handleHashtagInputChange = (e) => {
    setinputHashtagText(e.target.value);
    //console.log(inputHashtagText);
  };

  const handleAddHashtagInput = (e) => {
    e.preventDefault();
    const newHashtag = inputHashtagText.trim();
    if (inputHashtagText && !hashtagList.includes(inputHashtagText)) {
      const formattedHashtag = newHashtag.startsWith("#")
        ? newHashtag
        : `#${newHashtag}`;
      setHashtagList((prevList) => [...prevList, formattedHashtag]);
      // Clear the input field
      setinputHashtagText("");
    }
  };

  const handleRemoveHashtagInput = (index) => {
    const updatedList = [...hashtagList];
    updatedList.splice(index, 1);
    setHashtagList(updatedList);
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    setLoading(true);

    const data = {
      group_name: groupInput,
      hashtags: hashtagList,
    };
    console.log(data);
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

  //   const handleEditing = () => {
  //     setIsEditing(!isEditing);
  //   };
  return (
    <div>
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div
        className={`bg-overlay w-full h-full fixed z-50 top-0 left-0 flex justify-center items-center `}
      >
        <form
          onSubmit={handleGroupSubmit}
          className="bg-white md:w-[50%] w-full 2xl:w-[40%] p-6 rounded-lg relative flex flex-col justify-center items-center"
        >
          <div className="text-left w-full text-lg font-bold">
            <h3>Edit hastag group</h3>
          </div>
          <span
            className="border-2 border-gray-900 p-2 text-xs md:text-xl rounded-full absolute md:top-0 md:-right-12 right-4 top-2 cursor-pointer"
            onClick={close}
          >
            <FaTimes />
          </span>
          <div className="w-full pt-8">
            {selectOptions ? (
              <input
                type="text"
                id="hashtags"
                value={selectOptions ? selectOptions.group_name : ""} // Set the input value
                onChange={(e) => {
                  setGroupInput(e.target.value);
                  // Optionally, update selectOptions here if you want instant updates
                  setSelectOptions({
                    ...selectOptions,
                    group_name: e.target.value,
                  });
                }}
                placeholder="Enter Hashtags Group.."
                className="w-full outline-1 rounded-lg"
              />
            ) : (
              <select
                name=""
                id=""
                className="w-full outline-1 rounded-lg text-customGray"
                value={selectOptions ? selectOptions.group_name : ""} // Set the selected value
                onChange={(e) => {
                  const selectedGroup = isFetched.find(
                    (group) => group.group_name === e.target.value
                  );
                  setSelectOptions(selectedGroup);
                }}
              >
                {isFetched &&
                  isFetched
                    .filter((group) => group.group_name) // Assuming group_name is the property you want
                    .map((group, index) => (
                      <option key={index} value={group.group_name}>
                        {group.group_name}
                      </option>
                    ))}
              </select>
            )}
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
                {hashtagList.map((name, index) => (
                  <li key={index} className="mb-4 mr-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        // checked={checkedHashtagList[index]}
                        // onChange={() => handleCheckboxHashtagChange(index)}
                        className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      {name}
                      <button
                        type="button"
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
          </div>
          <button
            type="submit"
            className="mt-4 bg-customBlue w-full text-center text-white py-2 rounded-lg hover:bg-customTextBlue cursor-pointer"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHashtag;
