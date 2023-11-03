import { useState, useRef } from "react";
import UserWrapper from "./UserWrapper";
import axios from "axios";

import Loading from "/src/components/Loading.jsx";
import { ErrorMessages, SuccessMessages } from "/src/components/Messages";

const cityListArr = [
  {
    id: 63,
    name: "Aarhus",
    country: "19",
  },
  {
    id: 31,
    name: "Abu Dhabi",
    country: "56",
  },
  {
    id: 121,
    name: "Abuja",
    country: "41",
  },
  {
    id: 49,
    name: "Accra",
    country: "27",
  },
  {
    id: 54,
    name: "ADDIS ABABA",
    country: "23",
  },
  {
    id: 37,
    name: "Ahmedabad",
    country: "29",
  },
  {
    id: 50,
    name: "Alexandria",
    country: "21",
  },
  {
    id: 62,
    name: "Antwerp",
    country: "5",
  },
  {
    id: 82,
    name: "Atlanta",
    country: "57",
  },
  {
    id: 105,
    name: "Auckland",
    country: "40",
  },
  {
    id: 24,
    name: "Bangkok",
    country: "54",
  },
  {
    id: 70,
    name: "Barcelona",
    country: "51",
  },
  {
    id: 119,
    name: "Bariloche",
    country: "74",
  },
  {
    id: 12,
    name: "Beijing",
    country: "10",
  },
  {
    id: 108,
    name: "Bengaluru",
    country: "29",
  },
  {
    id: 42,
    name: "Benin city",
    country: "41",
  },
  {
    id: 116,
    name: "Birmingham",
    country: "68",
  },
  {
    id: 93,
    name: "Bogotá",
    country: "17",
  },
  {
    id: 115,
    name: "Bradford",
    country: "68",
  },
  {
    id: 102,
    name: "Brisbane",
    country: "3",
  },
  {
    id: 58,
    name: "Brussels",
    country: "5",
  },
  {
    id: 64,
    name: "Budapest",
    country: "28",
  },
  {
    id: 19,
    name: "Bundang",
    country: "50",
  },
  {
    id: 44,
    name: "Cairo",
    country: "21",
  },
  {
    id: 83,
    name: "California",
    country: "57",
  },
  {
    id: 103,
    name: "Canberra",
    country: "3",
  },
  {
    id: 46,
    name: "Cape Town",
    country: "49",
  },
  {
    id: 117,
    name: "Caseros, Buenos Aires",
    country: "74",
  },
  {
    id: 6,
    name: "Chennai",
    country: "29",
  },
  {
    id: 81,
    name: "Chicago",
    country: "57",
  },
  {
    id: 106,
    name: "Christchurch",
    country: "40",
  },
  {
    id: 29,
    name: "Colombo",
    country: "52",
  },
  {
    id: 98,
    name: "Columbus",
    country: "57",
  },
  {
    id: 61,
    name: "Copenhagen",
    country: "19",
  },
  {
    id: 100,
    name: "Dallas",
    country: "57",
  },
  {
    id: 5,
    name: "Delhi",
    country: "29",
  },
  {
    id: 88,
    name: "Denver",
    country: "57",
  },
  {
    id: 28,
    name: "Dhaka",
    country: "4",
  },
  {
    id: 30,
    name: "Dubai",
    country: "56",
  },
  {
    id: 110,
    name: "Dummy City",
    country: "23",
  },
  {
    id: 47,
    name: "Durban",
    country: "49",
  },
  {
    id: 65,
    name: "Florence",
    country: "33",
  },
  {
    id: 90,
    name: "Florianópolis",
    country: "7",
  },
  {
    id: 55,
    name: "Frankfurt",
    country: "26",
  },
  {
    id: 53,
    name: "Giza",
    country: "21",
  },
  {
    id: 72,
    name: "Granada",
    country: "51",
  },
  {
    id: 13,
    name: "Guangzhou",
    country: "10",
  },
  {
    id: 86,
    name: "Guayaquil",
    country: "20",
  },
  {
    id: 27,
    name: "Hanoi",
    country: "58",
  },
  {
    id: 26,
    name: "HCM city",
    country: "58",
  },
  {
    id: 59,
    name: "Helsinki",
    country: "24",
  },
  {
    id: 25,
    name: "Hongkong",
    country: "10",
  },
  {
    id: 96,
    name: "Houston",
    country: "57",
  },
  {
    id: 7,
    name: "Hyderabad",
    country: "29",
  },
  {
    id: 41,
    name: "Ibadan",
    country: "41",
  },
  {
    id: 67,
    name: "Istanbul",
    country: "55",
  },
  {
    id: 97,
    name: "Jacksonville ",
    country: "57",
  },
  {
    id: 17,
    name: "Jakarta",
    country: "30",
  },
  {
    id: 45,
    name: "Johannesburg",
    country: "49",
  },
  {
    id: 109,
    name: "Kampala",
    country: "64",
  },
  {
    id: 40,
    name: "Kano",
    country: "41",
  },
  {
    id: 8,
    name: "Kolkata",
    country: "29",
  },
  {
    id: 76,
    name: "krakow",
    country: "44",
  },
  {
    id: 20,
    name: "Kuala Lumpur",
    country: "35",
  },
  {
    id: 48,
    name: "Kumasi",
    country: "27",
  },
  {
    id: 39,
    name: "Lagos",
    country: "41",
  },
  {
    id: 35,
    name: "Lahore",
    country: "42",
  },
  {
    id: 99,
    name: "Las Vegas",
    country: "57",
  },
  {
    id: 68,
    name: "Lisbon",
    country: "45",
  },
  {
    id: 57,
    name: "London",
    country: "22",
  },
  {
    id: 71,
    name: "Madrid",
    country: "51",
  },
  {
    id: 114,
    name: "Manchester",
    country: "68",
  },
  {
    id: 22,
    name: "Manila",
    country: "43",
  },
  {
    id: 104,
    name: "Melbourne",
    country: "3",
  },
  {
    id: 85,
    name: "Mexico City",
    country: "37",
  },
  {
    id: 78,
    name: "Milan",
    country: "33",
  },
  {
    id: 3,
    name: "Mumbai",
    country: "29",
  },
  {
    id: 43,
    name: "Nairobi",
    country: "34",
  },
  {
    id: 79,
    name: "Naples",
    country: "33",
  },
  {
    id: 80,
    name: "New York",
    country: "57",
  },
  {
    id: 56,
    name: "Paris",
    country: "25",
  },
  {
    id: 21,
    name: "Penang",
    country: "35",
  },
  {
    id: 94,
    name: "Pheonix",
    country: "57",
  },
  {
    id: 34,
    name: "Phnom Penh",
    country: "8",
  },
  {
    id: 52,
    name: "Port Harcourt",
    country: "41",
  },
  {
    id: 51,
    name: "Port Louis",
    country: "36",
  },
  {
    id: 73,
    name: "Prague",
    country: "18",
  },
  {
    id: 23,
    name: "Quezon city",
    country: "43",
  },
  {
    id: 75,
    name: "Ravenna",
    country: "33",
  },
  {
    id: 36,
    name: "Rawalpindi",
    country: "42",
  },
  {
    id: 91,
    name: "Rio de Janeiro",
    country: "7",
  },
  {
    id: 66,
    name: "Rome",
    country: "33",
  },
  {
    id: 95,
    name: "San Diego",
    country: "57",
  },
  {
    id: 87,
    name: "San Francisco",
    country: "46",
  },
  {
    id: 113,
    name: "Santa Rosa ",
    country: "74",
  },
  {
    id: 92,
    name: "Santiago",
    country: "9",
  },
  {
    id: 89,
    name: "Seattle",
    country: "57",
  },
  {
    id: 69,
    name: "Seville",
    country: "51",
  },
  {
    id: 11,
    name: "Shanghai",
    country: "10",
  },
  {
    id: 32,
    name: "Sharjah",
    country: "56",
  },
  {
    id: 15,
    name: "Shenzhen",
    country: "10",
  },
  {
    id: 4,
    name: "Singapore",
    country: "47",
  },
  {
    id: 60,
    name: "Stockholm",
    country: "53",
  },
  {
    id: 18,
    name: "Surabaya",
    country: "30",
  },
  {
    id: 101,
    name: "Sydney",
    country: "3",
  },
  {
    id: 16,
    name: "Taipei",
    country: "10",
  },
  {
    id: 112,
    name: "Tandil",
    country: "74",
  },
  {
    id: 33,
    name: "Thimphu",
    country: "6",
  },
  {
    id: 10,
    name: "Tianjin",
    country: "10",
  },
  {
    id: 120,
    name: "Toronto",
    country: "63",
  },
  {
    id: 111,
    name: "Trelew",
    country: "74",
  },
  {
    id: 77,
    name: "valencia",
    country: "51",
  },
  {
    id: 74,
    name: "Venice",
    country: "33",
  },
  {
    id: 118,
    name: "Virrey del Pino",
    country: "74",
  },
  {
    id: 38,
    name: "Visakhapatnam",
    country: "29",
  },
  {
    id: 84,
    name: "Washington",
    country: "57",
  },
  {
    id: 107,
    name: "Wellington",
    country: "40",
  },
  {
    id: 14,
    name: "Yangon",
    country: "38",
  },
];

const TargetCities = () => {
  const [cityList, setCityList] = useState(cityListArr);
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
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/v1/targeted_cities/update/`,
        citiesArray,
        {
          withCredentials: true,
        }
      );

      setSuccess("Successfully updated cities");
      setError("");
      formRef.current.reset();
    } catch (error) {
      setError("Error updating the cities");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setInputValue(e.target.value);
    const filteredCities = cityListArr.filter((each) =>
      each.value.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setCityList(filteredCities);
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
              setCityList(cityListArr);
            }}
          >
            <div className='icons8-cancel'></div>
          </button>
        </div>

        {cityList.length !== 0 ? (
          <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col'>
            <ul className='h-[400px] w-9/12 mx-auto overflow-y-scroll flex flex-col  gap-y-0.5'>
              {cityList.map((each) => (
                <label
                  key={each.id}
                  className='city-label cursor-pointer w-full py-2.5 px-10 text-xl text-[#333] bg-transparent'
                  htmlFor={each.id}
                >
                  {each.value}
                  <input
                    id={each.id}
                    className='hidden'
                    type='checkbox'
                    name={each.value}
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
