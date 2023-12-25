import UserWrapper from "./UserWrapper";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const PostDetailDropdown = ({ close }) => {
  const [input1List, setInput1List] = useState([]);
  const [input2List, setInput2List] = useState([]);
  const [input3List, setInput3List] = useState([]);

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  const [getStatus, setGetStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [atLeastOneCheckboxSelected, setAtLeastOneCheckboxSelected] =
    useState(false);

  const formRef = useRef(null);

  const handleCheckboxChange = () => {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    setAtLeastOneCheckboxSelected(checkboxes.length > 0);
  };

  useEffect(() => handleCheckboxChange, [atLeastOneCheckboxSelected]);

  const fetch = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/post-detail-dropdowns/", {
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

  useEffect(() => {
    close();
    fetch();
  }, []);

  const handleBtn1click = () => {
    setInput1List((prev) => [...prev, input1]);
    setInput1("");
  };
  const handleBtn2click = () => {
    setInput2List((prev) => [...prev, input2]);
    setInput2("");
  };
  const handleBtn3click = () => {
    setInput3List((prev) => [...prev, input3]);
    setInput3("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const qualitativeValue = Array.from(
      document.querySelectorAll(`input[name="inputCheckbox1"]:checked`)
    ).map((checkbox) => checkbox.value);

    const targetedFor = Array.from(
      document.querySelectorAll(`input[name="inputCheckbox2"]:checked`)
    ).map((checkbox) => checkbox.value);

    const artictargetedCategory = Array.from(
      document.querySelectorAll(`input[name="inputCheckbox3"]:checked`)
    ).map((checkbox) => checkbox.value);

    const data = {
      qualitative_categorization: qualitativeValue,
      targeted: targetedFor,
      targeted_category: artictargetedCategory,
    };

    if (getStatus === "update") {
      setLoading(true);
      await axios
        .put(
          "http://127.0.0.1:8000/api/v1/post-detail-dropdowns/",
          data,

          {
            withCredentials: true,
          }
        )
        .then(() => {
          setLoading(false);
          setSuccess(null);
          setSuccess("Details sent...!");
          formRef.current.reset();
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later . ");
          //console.error("Error fetching user-approval:", error);
        });
    }

    if (getStatus === "insert") {
      setLoading(true);
      await axios
        .post("http://127.0.0.1:8000/api/v1/post-detail-dropdowns/", data, {
          withCredentials: true,
        })
        .then(() => {
          setLoading(false);
          if (!success) {
            setSuccess("Details updated successfully");
          }
          formRef.current.reset();
        })
        .catch((error) => {
          setLoading(false);
          setError("Error making the request. Please try again later.");
          //console.error("Error fetching user-approval:", error);
        });
    }
  };

  return (
    <UserWrapper>
      <div className='flex flex-col items-center justify-center w-full h-full'>
        {loading && <Loading />}
        {error && <ErrorMessages>{error}</ErrorMessages>}
        {success && <SuccessMessages>{success}</SuccessMessages>}
        <div>
          <h2 className='pb-12 text-xl font-bold text-customBlue xl:text-3xl'>
            Add data for step-3 dropdowns
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center'
          ref={formRef}
        >
          <div className='flex flex-row flex-wrap items-center justify-center gap-y-14 gap-x-10'>
            <label htmlFor='' className='flex flex-col items-center space-y-4'>
              <p className='text-lg font-bold text-customBlue'>
                Qualitiative Catrgorization
              </p>
              <div className='flex items-center h-10'>
                <input
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  type='text'
                  className='w-80 outline-1'
                  placeholder='Enter one qualitiative category'
                />
                <button
                  type='button'
                  disabled={!input1}
                  className={`bg-customBlue text-white p-2.5 px-3 rounded-r-[20px] ${
                    !input1 && "opacity-90"
                  }`}
                  onClick={handleBtn1click}
                >
                  Add
                </button>
              </div>
              <ul className='flex h-10 gap-2'>
                {input1List.map((each, index) => (
                  <li
                    key={index}
                    className='flex items-center list-none gap-x-2 text-[#333]'
                  >
                    <input
                      type='checkbox'
                      onChange={handleCheckboxChange}
                      className='w-3 h-3'
                      value={each}
                      name='inputCheckbox1'
                    />
                    <label className='text-sm'>{each}</label>
                    <button
                      onClick={() => {
                        setInput1List((prev) =>
                          prev.filter((item) => item !== each)
                        );
                        handleCheckboxChange();
                      }}
                      type='button'
                    >
                      <FaTimes />
                    </button>
                    {input1List.length === index + 1 ? "" : ","}
                  </li>
                ))}
              </ul>
            </label>
            <label htmlFor='' className='flex flex-col items-center space-y-4'>
              <p className='text-lg font-bold text-customBlue'>Targetted For</p>
              <div className='flex items-center h-10'>
                <input
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  type='text'
                  className='w-80 outline-1'
                  placeholder='Enter one target for'
                />
                <button
                  type='button'
                  disabled={!input2}
                  className={`bg-customBlue text-white p-2.5 px-3 rounded-r-[20px] ${
                    !input2 && "opacity-90"
                  }`}
                  onClick={handleBtn2click}
                >
                  Add
                </button>
              </div>
              <ul className='flex h-10 gap-2'>
                {input2List.map((each, index) => (
                  <li
                    key={index}
                    className='flex items-center list-none gap-x-2 text-[#333]'
                  >
                    <input
                      type='checkbox'
                      onChange={handleCheckboxChange}
                      className='w-3 h-3'
                      value={each}
                      name='inputCheckbox2'
                    />
                    <label className='text-sm'>{each}</label>
                    <button
                      onClick={() => {
                        setInput1List((prev) =>
                          prev.filter((item) => item !== each)
                        );
                        handleCheckboxChange();
                      }}
                      type='button'
                    >
                      <FaTimes />
                    </button>
                    {input2List.length === index + 1 ? "" : ","}
                  </li>
                ))}
              </ul>
            </label>
            <label htmlFor='' className='flex flex-col items-center space-y-4'>
              <p className='text-lg font-bold text-customBlue'>
                Targetted Category
              </p>
              <div className='flex items-center h-10'>
                <input
                  value={input3}
                  onChange={(e) => setInput3(e.target.value)}
                  type='text'
                  className='w-80 outline-1'
                  placeholder='Enter one target category'
                />
                <button
                  type='button'
                  disabled={!input3}
                  className={`bg-customBlue text-white p-2.5 px-3 rounded-r-[20px] ${
                    !input3 && "opacity-90"
                  }`}
                  onClick={handleBtn3click}
                >
                  Add
                </button>
              </div>
              <ul className='flex h-10 gap-2'>
                {input3List.map((each, index) => (
                  <li
                    key={index}
                    className='flex items-center list-none gap-x-2 text-[#333]'
                  >
                    <input
                      type='checkbox'
                      onChange={handleCheckboxChange}
                      className='w-3 h-3'
                      value={each}
                      name='inputCheckbox3'
                    />
                    <label className='text-sm'>{each}</label>
                    <button
                      onClick={() => {
                        setInput1List((prev) =>
                          prev.filter((item) => item !== each)
                        );
                        handleCheckboxChange();
                      }}
                      type='button'
                    >
                      <FaTimes />
                    </button>
                    {input3List.length === index + 1 ? "" : ","}
                  </li>
                ))}
              </ul>
            </label>
          </div>
          <button
            type='submit'
            className={`px-10 py-2 text-white rounded-xl bg-customBlue ${
              !atLeastOneCheckboxSelected && "opacity-90 cursor-not-allowed"
            } opacity-100`}
            disabled={!atLeastOneCheckboxSelected}
          >
            Save
          </button>
        </form>
      </div>
    </UserWrapper>
  );
};

export default PostDetailDropdown;
