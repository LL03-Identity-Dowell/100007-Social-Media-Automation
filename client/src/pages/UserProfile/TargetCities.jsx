import {useState} from "react";
import UserWrapper from "./UserWrapper";

const cityListArr = [
    {
        id: "city_63",
        value: "Aarhus",
    },
    {
        id: "city_31",
        value: "Abu Dhabi",
    },
    {
        id: "city_121",
        value: "Abuja",
    },
    {
        id: "city_49",
        value: "Accra",
    },
    {
        id: "city_54",
        value: "ADDIS ABABA",
    },
    {
        id: "city_37",
        value: "Ahmedabad",
    },
    {
        id: "city_50",
        value: "Alexandria",
    },
    {
        id: "city_62",
        value: "Antwerp",
    },
    {
        id: "city_82",
        value: "Atlanta",
    },
    {
        id: "city_105",
        value: "Auckland",
    },
    {
        id: "city_24",
        value: "Bangkok",
    },
    {
        id: "city_70",
        value: "Barcelona",
    },
    {
        id: "city_119",
        value: "Bariloche",
    },
    {
        id: "city_12",
        value: "Beijing",
    },
    {
        id: "city_108",
        value: "Bengaluru",
    },
    {
        id: "city_42",
        value: "Benin city",
    },
    {
        id: "city_116",
        value: "Birmingham",
    },
    {
        id: "city_93",
        value: "Bogotá",
    },
    {
        id: "city_115",
        value: "Bradford",
    },
    {
        id: "city_102",
        value: "Brisbane",
    },
    {
        id: "city_58",
        value: "Brussels",
    },
    {
        id: "city_64",
        value: "Budapest",
    },
    {
        id: "city_19",
        value: "Bundang",
    },
    {
        id: "city_44",
        value: "Cairo",
    },
    {
        id: "city_83",
        value: "California",
    },
    {
        id: "city_103",
        value: "Canberra",
    },
    {
        id: "city_46",
        value: "Cape Town",
    },
    {
        id: "city_117",
        value: "Caseros, Buenos Aires",
    },
    {
        id: "city_6",
        value: "Chennai",
    },
    {
        id: "city_81",
        value: "Chicago",
    },
    {
        id: "city_106",
        value: "Christchurch",
    },
    {
        id: "city_29",
        value: "Colombo",
    },
    {
        id: "city_98",
        value: "Columbus",
    },
    {
        id: "city_61",
        value: "Copenhagen",
    },
    {
        id: "city_100",
        value: "Dallas",
    },
    {
        id: "city_5",
        value: "Delhi",
    },
    {
        id: "city_88",
        value: "Denver",
    },
    {
        id: "city_28",
        value: "Dhaka",
    },
    {
        id: "city_30",
        value: "Dubai",
    },
    {
        id: "city_110",
        value: "Dummy City",
    },
    {
        id: "city_47",
        value: "Durban",
    },
    {
        id: "city_65",
        value: "Florence",
    },
    {
        id: "city_90",
        value: "Florianópolis",
    },
    {
        id: "city_55",
        value: "Frankfurt",
    },
    {
        id: "city_53",
        value: "Giza",
    },
    {
        id: "city_72",
        value: "Granada",
    },
    {
        id: "city_13",
        value: "Guangzhou",
    },
    {
        id: "city_86",
        value: "Guayaquil",
    },
    {
        id: "city_27",
        value: "Hanoi",
    },
    {
        id: "city_26",
        value: "HCM city",
    },
    {
        id: "city_59",
        value: "Helsinki",
    },
    {
        id: "city_25",
        value: "Hongkong",
    },
    {
        id: "city_96",
        value: "Houston",
    },
    {
        id: "city_7",
        value: "Hyderabad",
    },
    {
        id: "city_41",
        value: "Ibadan",
    },
    {
        id: "city_67",
        value: "Istanbul",
    },
    {
        id: "city_97",
        value: "Jacksonville ",
    },
    {
        id: "city_17",
        value: "Jakarta",
    },
    {
        id: "city_45",
        value: "Johannesburg",
    },
    {
        id: "city_109",
        value: "Kampala",
    },
    {
        id: "city_40",
        value: "Kano",
    },
    {
        id: "city_8",
        value: "Kolkata",
    },
    {
        id: "city_76",
        value: "krakow",
    },
    {
        id: "city_20",
        value: "Kuala Lumpur",
    },
    {
        id: "city_48",
        value: "Kumasi",
    },
    {
        id: "city_39",
        value: "Lagos",
    },
    {
        id: "city_35",
        value: "Lahore",
    },
    {
        id: "city_99",
        value: "Las Vegas",
    },
    {
        id: "city_68",
        value: "Lisbon",
    },
    {
        id: "city_57",
        value: "London",
    },
    {
        id: "city_71",
        value: "Madrid",
    },
    {
        id: "city_114",
        value: "Manchester",
    },
    {
        id: "city_22",
        value: "Manila",
    },
    {
        id: "city_104",
        value: "Melbourne",
    },
    {
        id: "city_85",
        value: "Mexico City",
    },
    {
        id: "city_78",
        value: "Milan",
    },
    {
        id: "city_3",
        value: "Mumbai",
    },
    {
        id: "city_43",
        value: "Nairobi",
    },
    {
        id: "city_79",
        value: "Naples",
    },
    {
        id: "city_80",
        value: "New York",
    },
    {
        id: "city_56",
        value: "Paris",
    },
    {
        id: "city_21",
        value: "Penang",
    },
    {
        id: "city_94",
        value: "Pheonix",
    },
    {
        id: "city_34",
        value: "Phnom Penh",
    },
    {
        id: "city_52",
        value: "Port Harcourt",
    },
    {
        id: "city_51",
        value: "Port Louis",
    },
    {
        id: "city_73",
        value: "Prague",
    },
    {
        id: "city_23",
        value: "Quezon city",
    },
    {
        id: "city_75",
        value: "Ravenna",
    },
    {
        id: "city_36",
        value: "Rawalpindi",
    },
    {
        id: "city_91",
        value: "Rio de Janeiro",
    },
    {
        id: "city_66",
        value: "Rome",
    },
    {
        id: "city_95",
        value: "San Diego",
    },
    {
        id: "city_87",
        value: "San Francisco",
    },
    {
        id: "city_113",
        value: "Santa Rosa ",
    },
    {
        id: "city_92",
        value: "Santiago",
    },
    {
        id: "city_89",
        value: "Seattle",
    },
    {
        id: "city_69",
        value: "Seville",
    },
    {
        id: "city_11",
        value: "Shanghai",
    },
    {
        id: "city_32",
        value: "Sharjah",
    },
    {
        id: "city_15",
        value: "Shenzhen",
    },
    {
        id: "city_4",
        value: "Singapore",
    },
    {
        id: "city_60",
        value: "Stockholm",
    },
    {
        id: "city_18",
        value: "Surabaya",
    },
    {
        id: "city_101",
        value: "Sydney",
    },
    {
        id: "city_16",
        value: "Taipei",
    },
    {
        id: "city_112",
        value: "Tandil",
    },
    {
        id: "city_33",
        value: "Thimphu",
    },
    {
        id: "city_10",
        value: "Tianjin",
    },
    {
        id: "city_120",
        value: "Toronto",
    },
    {
        id: "city_111",
        value: "Trelew",
    },
    {
        id: "city_77",
        value: "valencia",
    },
    {
        id: "city_74",
        value: "Venice",
    },
    {
        id: "city_118",
        value: "Virrey del Pino",
    },
    {
        id: "city_38",
        value: "Visakhapatnam",
    },
    {
        id: "city_84",
        value: "Washington",
    },
    {
        id: "city_107",
        value: "Wellington",
    },
    {
        id: "city_14",
        value: "Yangon",
    },
];

const TargetCities = () => {
    const [cityList, setCityList] = useState(cityListArr);
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
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
                <div className='flex items-center justify-between h-14 mb-2.5 gap-30 w-full'>
                    <button
                        type='button'
                        className='search-container-btns'
                        id='search-btn'
                    >
                        <div className='icons8-search'/>
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
                    <form onSubmit={handleSubmit} className='flex flex-col'>
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
