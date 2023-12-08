import { useState, useRef, useEffect } from "react";
import UserWrapper from "./UserWrapper";
import axios from "axios";

import Loading from "/src/components/Loading.jsx";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";

const url = "http://127.0.0.1:8000/api/v1/targeted_cities/";

const TargetCities = () => {
  const [cityList, setCityList] = useState([]);
  const [filteredCityList, setFilteredCityList] = useState([]);
  const [status, setStatus] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const citiesArray = Array.from(formData.entries())
      .filter(([key, value]) => value === "on")
      .map(([key]) => key);

    setLoading(true);
    if (status === "update") {
      try {
        const res = await axios.put(
          `http://127.0.0.1:8000/api/v1/targeted_cities/update/`,
          citiesArray,
          {
            withCredentials: true,
          }
        );

        const data = await res.json();

        setSuccess(data.detail);
        setError("");
        formRef.current.reset();
      } catch (error) {
        setError("Error updating the cities");
        setSuccess("");
      } finally {
        setLoading(false);
      }
    } else if (status === "insert") {
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/v1/targeted_cities/create/`,
          citiesArray,
          {
            withCredentials: true,
          }
        );

        const data = await res.json();

        setSuccess(data.detail);
        setError("");
        formRef.current.reset();
      } catch (error) {
        setError("Error inserting the cities");
        setSuccess("");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          const { data } = response;
          setFilteredCityList(data.cities);
          setCityList(data.cities);
          setStatus(data.status);
        })
        .catch(() => {
          setError("Failed to fetch city list");
          setSuccess("");
        });
      setLoading(false);
    };

    fetchComments();
  }, []);

  const onChange = (e) => {
    setInputValue(e.target.value);
    const filteredCities = cityList?.filter((each) =>
      each.name.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setFilteredCityList(filteredCities);
  };

  return (
    <UserWrapper>
      <div className='w-[70%] mx-auto  h-[600px] pt-14 pb-3.5'>
        {error !== "" && <ErrorMessages>{error}</ErrorMessages>}
        {success !== "" && <SuccessMessages>{success}</SuccessMessages>}
        {loading ? <Loading /> : null}
        <div className='flex items-center justify-between h-14 mb-2.5 gap-30 w-full'>
          <button
            type='button'
            className='search-container-btns'
            id='search-btn'
          >
            <div className='icons8-search' />
          </button>
          <input
            type='search'
            onChange={onChange}
            className='w-9/12 h-full border border-[1px solid bg-customBlue] outline-none rounded-[30px] text-xl font-bold bg-transparent px-10 placeholder:font-normal text-[#333] placeholder:text-2xl'
            placeholder='List of the Cities'
            value={inputValue}
          />
          <button
            id='cancel-button'
            type='reset'
            className='search-container-btns'
            onClick={() => {
              setInputValue("");
              setCityList(cityList);
            }}
          >
            <div className='icons8-cancel'></div>
          </button>
        </div>

        {filteredCityList?.length !== 0 ? (
          <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col'>
            <ul className='h-[400px] w-9/12 mx-auto overflow-y-scroll flex flex-col  gap-y-0.5'>
              {filteredCityList?.map((each) => (
                <label
                  key={each.id}
                  className='city-label cursor-pointer w-full py-2.5 px-10 text-xl text-[#333] bg-transparent'
                  htmlFor={each.id}
                >
                  {each.name}
                  <input
                    id={each.id}
                    className='hidden'
                    type='checkbox'
                    name={each.name}
                  />
                </label>
              ))}
            </ul>
            <button
              type='submit'
              className='self-center w-32 mt-3 text-base font-semibold text-white rounded-md h-11 bg-customBlue'
            >
              save
            </button>
          </form>
        ) : (
          <div className='w-full h-[400px] flex justify-center '>
            <h1 className='text-2xl font-bold text-[#333] self-center'>
              No matching city found.
            </h1>
          </div>
        )}
      </div>
    </UserWrapper>
  );
};

export default TargetCities;
