import  { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const HashtagsMentions = ({ close }) => {
  const [inputHashtagText, setinputHashtagText] = useState("");
  const [inputHashtagList, setinputHashtagList] = useState([]);
  const [checkedHashtagList, setcheckedHashtagList] = useState([]);

  const [inputMentionsText, setinputMentionsText] = useState("");
  const [inputMentionsList, setinputMentionsList] = useState([]);
  const [checkedMentionsList, setcheckedMentionsList] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

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
      setinputMentionsList([...inputMentionsList, "#" + inputMentionsText]);
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

    updateSaveButtonState(updatedChecked, checkedMentionsList);
  };

  const handleCheckboxMentionsChange = (index) => {
    const updatedChecked = [...checkedMentionsList];
    updatedChecked[index] = !updatedChecked[index];
    setcheckedMentionsList(updatedChecked);

    updateSaveButtonState(checkedHashtagList, updatedChecked);
  };

  const updateSaveButtonState = (hashtagChecked, mentionsChecked) => {
    const areAnyChecked = hashtagChecked.some((value) => value) || mentionsChecked.some((value) => value);
    setIsSaveDisabled(!areAnyChecked);
  };

  const handleGetRequest = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/hash-tags-and-mentions/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("can't make get request");
      } else {
        // request is ok
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    close();
  }, []);

  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-fill">
          <div>
            <h2 className="text-customBlue text-2xl xl:text-3xl pb-12">
              Hashtags and Mentions
            </h2>
          </div>

          <form onSubmit={handleAddInput} className="w-50 px-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
              <div className="text-center w-full">
                <label
                  htmlFor="hashtags"
                  className="text-customBlack text-lg "
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
                    onClick={handleAddHashtagInput}
                    className="bg-blue-800 text-white rounded-r-2xl px-2"
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
                <label
                  htmlFor="mentions"
                  className="text-customBlack text-lg "
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
                    onClick={handleAddMentionsInput}
                    className="bg-blue-800 text-white rounded-r-2xl px-2"
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
                onClick={handleGetRequest}
                className={`bg-blue-800 px-4 py-2 text-white rounded-md flex items-center gap-3 ${isSaveDisabled ? "bg-blue-300 cursor-not-allowed" : ""
                  }`}
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

export default HashtagsMentions;
