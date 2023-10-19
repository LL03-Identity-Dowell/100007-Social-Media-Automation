import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const HashtagsMentions = ({ close }) => {
  const [inputHashtagText, setinputHashtagText] = useState("");
  const [inputHashtagList, setinputHashtagList] = useState([]);
  const [checkedHashtagList, setcheckedHashtagList] = useState([]);

  const [inputMentionsText, setinputMentionsText] = useState("");
  const [inputMentionsList, setinputMentionsList] = useState([]);
  const [checkedMentionsList, setcheckedMentionsList] = useState([]);

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
      return updatedChecked;
    });
  };
  const handleRemoveMentionsInput = (index) => {
    setinputMentionsList((prevList) => prevList.filter((_, i) => i !== index));
    setcheckedMentionsList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked.splice(index, 1);
      return updatedChecked;
    });
  };

  const handleCheckboxHashtagChange = (index) => {
    setcheckedHashtagList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked[index] = !updatedChecked[index];
      return updatedChecked;
    });
  };
  const handleCheckboxMentionsChange = (index) => {
    setcheckedMentionsList((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked[index] = !updatedChecked[index];
      return updatedChecked;
    });
  };

  useEffect(() => {
    close();
  }, []);

  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div>
            <h2 className="text-customBlue font-bold text-2xl xl:text-3xl pb-12">
              Hashtags and Mentions
            </h2>
          </div>

          <form onSubmit={handleAddInput} className="w-full px-6">
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
                  <button className="bg-customTextBlue text-white rounded-r-2xl px-2">
                    Add
                  </button>
                </div>
                <div >
                  <ul>
                    {inputHashtagList.map((name, index) => (
                      <li key={index}>
                        <input
                          type="checkbox"
                          checked={checkedHashtagList[index]}
                          onChange={() => handleCheckboxHashtagChange(index)}
                        />{" "}
                        {name}{" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={() => handleRemoveHashtagInput(index)}>
                          <FaTimes />
                        </button>
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
                  <button className="bg-customTextBlue text-white rounded-r-2xl px-2">
                    Add
                  </button>
                </div>
                <div>
                  <ul>
                    {inputMentionsList.map((name, index) => (
                      <li key={index}>
                        <input
                          type="checkbox"
                          checked={checkedMentionsList[index]} // Use the checked state
                          onChange={() => handleCheckboxMentionsChange(index)} // Handle checkbox change
                        />{" "}
                        {name}{" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button
                          onClick={() => handleRemoveMentionsInput(index)}
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mt-6 md:mt-16">
              <button className="bg-customTextBlue px-4 py-2 text-white rounded-md flex items-center gap-3">
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
