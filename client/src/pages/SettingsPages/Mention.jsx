import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";

const Mention = ({close}) => {
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

    useEffect(() => {
        close();
        fetch();
      }, []);

      const handleMentionsInputChange = (e) => {
        setinputMentionsText(e.target.value);
        //console.log(inputMentionsText);
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
      // const handleAddInput = (e) => {
      //   handleAddHashtagInput(e);
      //   handleAddMentionsInput(e);
      // };
      const handleRemoveMentionsInput = (index) => {
        setinputMentionsList((prevList) => prevList.filter((_, i) => i !== index));
        setcheckedMentionsList((prevChecked) => {
          const updatedChecked = [...prevChecked];
          updatedChecked.splice(index, 1);
          updateSaveButtonState( updatedChecked);
          return updatedChecked;
        });
      };
      const handleCheckboxMentionsChange = (index) => {
        const updatedChecked = [...checkedMentionsList];
        updatedChecked[index] = !updatedChecked[index];
        setcheckedMentionsList(updatedChecked);
        //console.log(checkedMentionsList);
        setCheckedMentions(inputMentionsList.filter((_, i) => updatedChecked[i]));
        updateSaveButtonState( updatedChecked);
      };
      const updateSaveButtonState = (hashtagChecked, mentionsChecked) => {
        const areAnyChecked = hashtagChecked.some((value) => value);
        // ||
        // mentionsChecked.some((value) => value);
        setIsSaveDisabled(!areAnyChecked);
      };
      const fetch = () => {
        
        // Make a GET request to the API endpoint with the session_id
        axios
          .get(
            `${import.meta.env.VITE_APP_BASEURL}/mentions/`,
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
            mentions_list: checkedMentions.join(","),
          };
    
          setSuccess("");
          setError("");
    
          //console.log("from update", data);
          await axios
            .put(
              `${
                import.meta.env.VITE_APP_BASEURL
              }/update-mentions/`,
              data,
    
              {
                withCredentials: true,
              }
            )
            .then(() => {
              setLoading(false);
              setSuccess(" mentions are updated...!");
              setinputMentionsList([]);
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
              mentions_list: checkedMentions.join(),
            },
          };
          //console.log("from insert", payloadBody)
          await axios
            .post(
              `${import.meta.env.VITE_APP_BASEURL}/mentions/`,
              payloadBody,
              {
                withCredentials: true,
              }
            )
            .then(() => {
              setLoading(false);
              if (!success) {
                setSuccess("Hashtags and mentions are sent successfully...!");
                setinputMentionsList([]);
                setinputHashtagList([]);
              }
            })
            .catch((error) => {
              setLoading(false);
              setError("Error making the request. Please try again later.");
            });
        }
      };
  return (
    <div className="w-full  md:w-[60%]">
        {loading && <Loading/>}
        {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
       <form className='w-full px-6' onSubmit={handleSubmit}>
            <div className='flex flex-col w-full gap-6  lg:flex-row lg:gap-10'>
              
              <div className='w-full '>
                {/* <label
                  htmlFor='mentions'
                  className='text-lg font-bold text-customBlue'
                >
                  Mentions
                </label> */}
                <div className='flex w-full mt-4 '>
                  <span className='p-2 text-lg text-gray-600 bg-gray-400 rounded-l-md'>
                    @
                  </span>
                  <input
                    type='text'
                    id='mentions'
                    value={inputMentionsText}
                    onChange={handleMentionsInputChange}
                    placeholder='Enter Mentions..'
                    className='w-full outline-1'
                  />
                  <button
                    className={`px-2 py-0 text-white bg-customBlue rounded-r-2xl ${
                      !inputMentionsText
                        ? "opacity-90 cursor-not-allowed"
                        : "cursor-pointer opacity-100"
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
            <div className='flex items-center justify-center w-full mt-2'>
              <button
                type='submit'
                className={` bg-customBlue text-white py-2 rounded-lg w-full hover:bg-customTextBlue text-center  ${
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
  );
};

export default Mention;
