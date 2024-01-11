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
      .get(`${import.meta.env.VITE_APP_WEBSITEBASEURL}/hash-tags-and-mentions/`, {
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
          `${import.meta.env.VITE_APP_WEBSITEBASEURL}/update-hash-tags-and-mentions/`,
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
    <div className='bg-pens bg-cover bg-center h-[90vh]'>
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className='bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400'>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div>
            <h2 className='pb-12 text-2xl font-bold text-customBlue xl:text-3xl'>
              Hashtags and Mentions
            </h2>
          </div>
          <form className='w-full px-6' onSubmit={handleSubmit}>
            <div className='flex flex-col w-full gap-6 ml-10 lg:flex-row lg:gap-10'>
              <div className='w-full text-center'>
                <label
                  htmlFor='hashtags'
                  className='text-lg font-bold text-customBlue'
                >
                  Hashtags
                </label>
                <div className='flex w-full mt-4 border'>
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
                      checkedHashtagList.length <= 0 && "opacity-90 cursor-none"
                    }`}
                    onClick={handleAddHashtagInput}
                  >
                    Add
                  </button>
                </div>
                <div className='mt-3'>
                  <ul className='flex flex-wrap'>
                    {inputHashtagList.map((name, index) => (
                      <li key={index} className='mb-4 mr-4'>
                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            checked={checkedHashtagList[index]}
                            onChange={() => handleCheckboxHashtagChange(index)}
                            className='w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                          />
                          {name}
                          <button
                            onClick={() => handleRemoveHashtagInput(index)}
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
              <div className='w-full text-center'>
                <label
                  htmlFor='mentions'
                  className='text-lg font-bold text-customBlue'
                >
                  Mentions
                </label>
                <div className='flex w-full mt-4 border'>
                  <span className='p-2 text-lg text-gray-600 bg-gray-400 rounded-l-md'>
                    @
                  </span>
                  <input
                    type='text'
                    id='mentions'
                    value={inputMentionsText}
                    onChange={handleMentionsInputChange}
                    placeholder='Enter Mentions..'
                    className='w-80 outline-1'
                  />
                  <button
                    className={`px-2 py-0 text-white bg-customBlue rounded-r-2xl ${
                      checkedMentionsList.length <= 0 &&
                      "opacity-90 cursor-none"
                    }`}
                    onClick={handleAddMentionsInput}
                  >
                    Add
                  </button>
                </div>
                <div className='mt-3'>
                  <ul className='flex flex-wrap'>
                    {inputMentionsList.map((name, index) => (
                      <li key={index} className='mb-4 mr-4'>
                        <input
                          type='checkbox'
                          checked={checkedMentionsList[index]}
                          onChange={() => handleCheckboxMentionsChange(index)}
                        />{" "}
                        {name}
                        <button
                          onClick={() => handleRemoveMentionsInput(index)}
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
      {/* className="flex items-center gap-3 px-4 py-2 text-white rounded-md bg-customTextBlue" */}
    </div>
  );
};

export default HashtagsMentions;
