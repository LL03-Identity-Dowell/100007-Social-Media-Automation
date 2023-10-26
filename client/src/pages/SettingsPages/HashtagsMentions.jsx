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
  };
  const handleMentionsInputChange = (e) => {
    setinputMentionsText(e.target.value);
  };
  const handleAddHashtagInput = (e) => {
    e.preventDefault();

    if (inputHashtagText) {
      setinputHashtagList([...inputHashtagList, "#" + inputHashtagText]);
      setinputHashtagText("");
      setcheckedHashtagList([...checkedHashtagList, false]);
    }
  };
  const handleAddMentionsInput = (e) => {
    e.preventDefault();

    if (inputMentionsText) {
      setinputMentionsList([...inputMentionsList, "@" + inputMentionsText]);
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
    setCheckedHashtags(inputHashtagList.filter((_, i) => updatedChecked[i]));
    updateSaveButtonState(updatedChecked, checkedMentionsList);
  };
  const handleCheckboxMentionsChange = (index) => {
    const updatedChecked = [...checkedMentionsList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedMentionsList(updatedChecked);
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
        console.error("Error fetching user-approval:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (getStatus === "update") {
      setLoading(true);
      const payloadBody = {
        update_field: {
          hashtag_list: checkedHashtags.join(),
          mentions_list: checkedMentions.join(),
        },
      };
      axios
        .put(
          "http://127.0.0.1:8000/api/v1/update-hash-tags-and-mentions/",
          payloadBody,
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
          console.error("Error fetching user-approval:", error);
        });
    } else if (getStatus === "insert") {
      setLoading(true);
      const payloadBody = {
        field: {
          hashtag_list: checkedHashtags.join(),
          mentions_list: checkedMentions.join(),
        },
      };

      axios
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
          console.error("Error fetching user-approval:", error);
        });
    }
  };

  useEffect(() => {
    close();
    fetch();
  }, []);

  return (
    <div
      className="bg-pens h-screen bg-cover bg-center "
      // style={{
      //   backgroundPosition: "center calc(50% + 135px)",
      //   overflow: "hidden",
      // }}
    >
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}

      <div className="bg-overlay mx-auto my-6 h-[576px] shadow-lg shadow-gray-400 max-w-[900px]  ">
        <div className="flex justify-center items-center flex-col h-full w-fill mt-[-6px] ">
          <div>
            <div className="text-customBlue text-2xl   ">
              <>Add Hashtags and Mentions</>
            </div>
          </div>

          <form onSubmit={handleAddInput} className="w-50 px-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full pt-10">
              <div className="text-center w-full">
                <div className="mb-3">
                  <label
                    htmlFor="hashtags"
                    className="text-customBlack text-sm  "
                  >
                    Hashtags
                  </label>
                </div>

                <div className="mt-2 w-full border flex max-h-8">
                  <span className="bg-gray-400 px-1 text-lg text-gray-600 rounded-l-sm ">
                    #
                  </span>

                  <input
                    type="text"
                    id="hashtags"
                    value={inputHashtagText}
                    onChange={handleHashtagInputChange}
                    placeholder="Enter Hashtags.."
                    className="border-none bg-white w-full outline-2 outline-blue-400 p-1"
                  />
                  <button
                    onClick={handleAddHashtagInput}
                    className="bg-blue-800 bg-customBlue text-white rounded-r-2xl px-3"
                  >
                    Add
                  </button>
                </div>

                <div>
                  <ul className="flex flex-wrap">
                    {inputHashtagList.map((name, index) => (
                      <li key={index} className="mb-4 mr-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checkedHashtagList[index]}
                            onChange={() => handleCheckboxHashtagChange(index)}
                            className="mr-2"
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
                <div className="mb-3">
                  <label
                    htmlFor="mentions"
                    className="text-customBlack text-sm "
                  >
                    Mentions
                  </label>
                </div>
                <div className="mt-2 w-full border flex max-h-8">
                  <span className="bg-gray-400 px-1 text-lg text-gray-600 rounded-l-sm ">
                    @
                  </span>
                  <input
                    type="text"
                    id="mentions"
                    value={inputMentionsText}
                    onChange={handleMentionsInputChange}
                    placeholder="Enter Mentions.."
                    className="border-none bg-white w-full outline-2 outline-blue-400 p-1"
                  />
                  <button
                    onClick={handleAddMentionsInput}
                    className="bg-blue-800 bg-customBlue text-white rounded-r-2xl px-3"
                  >
                    Add
                  </button>
                </div>
                <div>
                  <ul className="flex flex-wrap">
                    {inputMentionsList.map((name, index) => (
                      <li key={index}>
                        <input
                          type="checkbox"
                          checked={checkedMentionsList[index]}
                          onChange={() => handleCheckboxMentionsChange(index)}
                        />{" "}
                        {name}{" "}
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
                onClick={handleSubmit}
                className={`${
                  isSaveDisabled ? "bg-blue-300 cursor-not-allowed" : ""
                }bg-blue-800 px-10 py-1 text-white rounded-3xl flex items-center gap-3   `}
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

export default HashtagsMentions;
