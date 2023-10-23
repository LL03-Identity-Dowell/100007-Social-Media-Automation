import { useState, useEffect } from "react";
import UserWrapper from "./UserWrapper";
import axios from "axios";
import Loading from "../../components/Loading";
import { SuccessMessages, ErrorMessages } from "../../components/Messages";

const TargetCities = () => {
  const [cityList, setCityList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSelected, setIsSelected] = useState({
    name : []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [isError, setIsError] = useState("");
  const data = cityList;

  const fetchCities = async () => {
    setIsLoading(true);
    await axios
      .get("http://127.0.0.1:8000/api/v1/targeted_cities/", {
        withCredentials: true,
      })
      .then((response) => {
        setCityList(response.data.cities);
        setStatus(response.data.status);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchCities();
  }, []);

  //Get values of cities selected by user
  const handleSelect = (e) => {
    let newCities = [];
    let checkedValues = e.target.name
    newCities = checkedValues
    // let checkedValues = document.querySelectorAll("input[type='checkbox']:checked");
    // checkedValues.forEach((item) => {
    //   newCities.push(item.name);
    // });
    setIsSelected(newCities);
    //console.log(isSelected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = isSelected;

    if (status === "update") {
      setIsLoading(true);
      await axios
        .put("http://127.0.0.1:8000/api/v1/targeted_cities/update/", data, {
          withCredentials: true,
        })
        .then((response) => {
          setIsLoading(false);
          setIsSuccess(response.data.detail);
        })
        .catch((error) => {
          setIsError("Fail to update targeted cities please try again");
        });
    } else if (status === "insert") {
      setIsLoading(true);
      await axios
        .post("http://127.0.0.1:8000/api/v1/targeted_cities/create/", data, {
          withCredentials: true,
        })
        .then((response) => {
          setIsLoading(false);
          setIsSuccess(response.data.detail);
        })
        .catch((error) => {
          setIsError("Fail to save targeted cities please try again");
        });
    }
  };

  return (
    <UserWrapper>
      {isSuccess && <SuccessMessages children={isSuccess} />}
      {isError && <ErrorMessages children={isError} />}
      <div className="w-[70%] mx-auto  h-[600px] pt-14 pb-3.5">
        <div className="flex items-center justify-between h-14 mb-2.5 gap-30 w-full">
          <button
            type="button"
            className="search-container-btns"
            id="search-btn"
          >
            <div className="icons8-search" />
          </button>
          <input
            type="search"
            onChange={(e) => setInputValue(e.target.value)}
            className="w-9/12 h-full border border-[1px solid bg-customBlue] outline-none rounded-[30px] text-xl font-bold bg-transparent px-10 placeholder:font-normal text-[#333] placeholder:text-2xl"
            placeholder="List of the Cities"
            value={inputValue}
          />
          <button
            id="cancel-button"
            type="reset"
            className="search-container-btns"
            onClick={() => {
              setInputValue("");
            }}
          >
            <div className="icons8-cancel"></div>
          </button>
        </div>

        {inputValue === null ? (
          <div className="w-full h-[400px] flex justify-center  ">
            <h1 className="text-2xl font-bold text-[#333] self-center">
              No matching city found.
            </h1>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <ul className="h-[400px] w-9/12 mx-auto overflow-y-scroll flex flex-col  gap-y-0.5">
              {isLoading ? (
                <Loading />
              ) : (
                data
                  .filter((city) => {
                    return inputValue === ""
                      ? city
                      : city.name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      ? city
                      : null;
                  })
                  .map((city) => (
                    <label
                      key={city.id}
                      className="city-label cursor-pointer w-full py-2.5 px-10 text-xl text-[#333] bg-transparent"
                      htmlFor={city.id}
                    >
                      {city.name}
                      <input
                        id={city.id}
                        className="hidden"
                        type="checkbox"
                        name={city.name}
                        onChange={handleSelect}
                      />
                    </label>
                  ))
              )}
            </ul>
            <button
              type="submit"
              className="self-center w-32 mt-3 text-base font-semibold text-white rounded-md h-11 bg-customBlue"
            >
              save
            </button>
          </form>
        )}
      </div>
    </UserWrapper>
  );
};

export default TargetCities;
