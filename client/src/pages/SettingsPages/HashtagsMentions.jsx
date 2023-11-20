import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/Loading";
import { SuccessMessages } from "../../components/Messages";
import { ErrorMessages } from "../../components/Messages";

const HashtagsMentions = ({ close }) => {
  const [inputHashtagText, setinputHashtagText] = useState("");
  const [inputHashtagList, setinputHashtagList] = useState([]);
  const [checkedHashtagList, setcheckedHashtagList] = useState([]);
  const [inputMentionsText, setinputMentionsText] = useState("");
  const [inputMentionsList, setinputMentionsList] = useState([]);
  const [checkedMentionsList, setcheckedMentionsList] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [checkedHashtags, setCheckedHashtags] = useState([]);
  const [checkedMentions, setCheckedMentions] = useState([]);
  const [getStatus, setGetStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState();

  const handleHashtagInputChange = (e) => {
    setinputHashtagText(e.target.value);
    //console.log(inputHashtagText);
  };
  const handleMentionsInputChange = (e) => {
    setinputMentionsText(e.target.value);
    //console.log(inputMentionsText);
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
  const handleAddMentionsInput = (e) => {
    e.preventDefault();

    if (inputMentionsText) {
      setinputMentionsList([...inputMentionsList, "@" + inputMentionsText]);
      //console.log(inputMentionsList);
      setinputMentionsText("");
      setcheckedMentionsList([...checkedMentionsList, false]);
    }
  };
  const handleAddInput = (e) => {
    handleAddHashtagInput(e);
    handleAddMentionsInput(e);
  };
  const handleRemoveHashtagInput = (index) => {
    setinputHashtagList((prevList) => prevList.filter((_, i) => i !== index));
    setcheckedHashtagList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked.splice(index, 1);
      updateSaveButtonState(updatedChecked, checkedMentionsList);
      return updatedChecked;
    });
  };
  const handleRemoveMentionsInput = (index) => {
    setinputMentionsList((prevList) => prevList.filter((_, i) => i !== index));
    setcheckedMentionsList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked.splice(index, 1);
      updateSaveButtonState(checkedHashtagList, updatedChecked);
      return updatedChecked;
    });
  };
  const handleCheckboxHashtagChange = (index) => {
    const updatedChecked = [...checkedHashtagList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedHashtagList(updatedChecked);
    //console.log(checkedHashtagList);
    setCheckedHashtags(inputHashtagList.filter((_, i) => updatedChecked[i]));
    updateSaveButtonState(updatedChecked, checkedMentionsList);
  };
  const handleCheckboxMentionsChange = (index) => {
    const updatedChecked = [...checkedMentionsList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedMentionsList(updatedChecked);
    //console.log(checkedMentionsList);
    setCheckedMentions(inputMentionsList.filter((_, i) => updatedChecked[i]));
    updateSaveButtonState(checkedHashtagList, updatedChecked);
  };
  const updateSaveButtonState = (hashtagChecked, mentionsChecked) => {
    const areAnyChecked =
      hashtagChecked.some((value) => value) ||
      mentionsChecked.some((value) => value);
    setIsSaveDisabled(!areAnyChecked);
  };
  const fetch = () => {
    // Make a GET request to the API endpoint with the session_id
    axios
      .get("http://127.0.0.1:8000/api/v1/hash-tags-and-mentions/", {
        withCredentials: true,
      })
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
        mentions_list: checkedMentions.join(","),
      };

      //console.log("from update", data);
      await axios
        .put(
          "http://127.0.0.1:8000/api/v1/update-hash-tags-and-mentions/",
          data,

          {
            withCredentials: true,
          }
        )
        .then(() => {
          setLoading(false);
          setSuccess(null);
          setTimeout(() => {
            setSuccess("Hashtags and mentions are updated...!");
          }, 1);
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
          //console.error("Error fetching user-approval:", error);
        });
    } else if (getStatus === "insert") {
      setLoading(true);
      const payloadBody = {
        field: {
          hashtag_list: checkedHashtags.join(),
          mentions_list: checkedMentions.join(),
        },
      };
      //console.log("from insert", payloadBody)
      await axios
        .post(
          "http://127.0.0.1:8000/api/v1/hash-tags-and-mentions/",
          payloadBody,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setLoading(false);
          if (!success) {
            setSuccess("Hashtags and mentions are sent successfully...!");
          }
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
          //console.error("Error fetching user-approval:", error);
        });
    }
  };

  useEffect(() => {
    close();
    fetch();
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
              Hashtags and Mentions
            </h2>
          </div>
          <form className="w-full px-6" onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
              <div className="text-center w-full">
                <label
                  htmlFor="hashtags"
                  className="text-customBlue text-lg font-bold"
                >
                  Hashtags
                </label>
                <div className="mt-4 w-full border flex">
                  <span className="bg-gray-400 p-2 text-lg text-gray-600 rounded-l-md">
                    #
                  </span>
                  <input
                    type="text"
                    id="hashtags"
                    value={inputHashtagText}
                    onChange={handleHashtagInputChange}
                    placeholder="Enter Hashtags.."
                    className="border-none bg-white w-full outline-2 outline-blue-400 "
                  />
                  <button
                    className="bg-customTextBlue text-white rounded-r-2xl px-2"
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
                            className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                          />
                          {name}
                          <button
                            onClick={() => handleRemoveHashtagInput(index)}
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
              <div className="text-center w-full">
                <label
                  htmlFor="mentions"
                  className="text-customBlue text-lg font-bold"
                >
                  Mentions
                </label>
                <div className="mt-4 w-full border flex">
                  <span className="bg-gray-400 p-2 text-lg text-gray-600 rounded-l-md">
                    @
                  </span>
                  <input
                    type="text"
                    id="mentions"
                    value={inputMentionsText}
                    onChange={handleMentionsInputChange}
                    placeholder="Enter Mentions.."
                    className="border-none bg-white w-full"
                  />
                  <button
                    className="bg-customTextBlue text-white rounded-r-2xl px-2"
                    onClick={handleAddMentionsInput}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3">
                  <ul className="flex flex-wrap">
                    {inputMentionsList.map((name, index) => (
                      <li key={index} className="mb-4 mr-4">
                        <input
                          type="checkbox"
                          checked={checkedMentionsList[index]}
                          onChange={() => handleCheckboxMentionsChange(index)}
                        />{" "}
                        {name}
                        <button
                          onClick={() => handleRemoveMentionsInput(index)}
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
      {/* className="bg-customTextBlue px-4 py-2 text-white rounded-md flex items-center gap-3" */}
    </div>
  );
};

export default HashtagsMentions;
