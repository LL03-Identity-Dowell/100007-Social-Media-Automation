import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../../components/Loading";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../../components/Messages";
import axios from "axios";

const HashtagAndMentions = ({ onclick, data }) => {
  const [selectOptions, setSelectOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFetched, setIsFetched] = useState("");
  const [isFetchedMentions, setIsFetchedMentions] = useState();
  const [IsFetchedCities, setIsFetchedCities] = useState();
  const [checkedMentionsList, setCheckedMentionsList] = useState([]);
  const [checkedHashtagList, setCheckedHashtagList] = useState([]);
  const [checkedCitiesList, setCheckedCitiesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = () => {
      axios
        .get(`${import.meta.env.VITE_APP_BASEURL}/group-hashtags/`, {
          withCredentials: true,
        })
        .then((response) => {
          let data = response.data.group_hastag_list;
          // console.log(data);

          setIsFetched(data);
        })
        .catch((error) => {
          setError("Server error, Please try again later");
          //console.error("Error fetching user-approval:", error);
        });

      axios
        .get(`${import.meta.env.VITE_APP_BASEURL}/fetch_user_settings_data/`, {
          withCredentials: true,
        })
        .then((response) => {
          let mentionsData = response.data.data[0].mentions_list;
          let citiesData = response.data.data[0].target_city;
          let wordsArray = mentionsData.split(',');

        
          setIsFetchedMentions(wordsArray);
          setIsFetchedCities(citiesData)
        })
        .catch((error) => {
          setError("Server error, Please try again later");
          //console.error("Error fetching user-approval:", error);
        });
    };
    fetch();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // data.group_name= selectOptions.group_name,
    // data.hashtags= ,

    if (selectOptions && selectOptions.hashtags) {
      data.hashtags = selectOptions.hashtags.filter((_, i) => checkedHashtagList[i]);
    }

    data.mentions = isFetchedMentions.filter((_, i) => checkedMentionsList[i]);
    data.target_city = IsFetchedCities.filter((_, i) => checkedCitiesList[i]);

    const selectedHashtags = data.hashtags.map((hashtag) => `${hashtag}`).join(" ");
    const selectedMentions = data.mentions.map((mention) => `${mention}`).join(" ");
    const selectedCities = data.target_city.map((city) => `#${city}`).join(" ");

    data.paragraphs += ` ${selectedHashtags} ${selectedMentions} ${selectedCities}`;

    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/save_post/`, data, {
        withCredentials: true,
      })
      .then((response) => {
        setError(null);
        setLoading(false);
        let resData = response.data;
        setSuccess(resData.message);
        setTimeout(() => {
          navigate("/unscheduled");
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error submitting post:", error);
      });
  };

  const handleCheckboxHashtagChange = (index) => {
    const updatedChecked = [...checkedHashtagList];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedHashtagList(updatedChecked);
  };

  const handleCheckboxMentionsChange = (index) => {
    const updatedChecked = [...checkedMentionsList];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedMentionsList(updatedChecked);
  };
  const handleCheckboxCitiesChange = (index) => {
    const updatedChecked = [...checkedCitiesList];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedCitiesList(updatedChecked);
  };
  

  return (
    <div>
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      <div
        className={`bg-overlay w-full h-full fixed z-40 top-0 left-0 flex justify-center items-center `}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white md:w-[50%]  2xl:w-[40%] md:p-6 px-4 pt-10 pb-4 rounded-lg relative"
        >
          <span
            className="border-2 border-gray-900 p-2 text-xs md:text-xl rounded-full absolute md:top-0 md:-right-12 right-4 top-2 cursor-pointer"
            onClick={onclick}
          >
            <FaTimes />
          </span>
          <div className="flex flex-col w-full ">
            <div className="md:flex justify-between items-center mb-6">
              <div>
                <p className="text-lg text-customBlue font-semibold">
                  Select a hashtag group (Optional)
                </p>
                <p className="text-customDarkpuprle ">
                  Include your favourite hashtags to this post by selecting from your
                  saved groups.
                </p>
              </div>
              <Link
                to="/settings/hastags"
                className="float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs"
              >
                Add hastags
              </Link>
            </div>
            {/* {
              isFetched ? () : "Please add a hastag"
            } */}
            <select
              name=""
              id=""
              className="w-full outline-1 rounded-lg text-customGray"
              onChange={(e) => {
                const selectedGroup = isFetched.find(
                  (group) => group.group_name === e.target.value
                );
                setSelectOptions(selectedGroup);
              }}
            >
              {isFetched &&
                isFetched
                  .filter((group) => group.group_name) // Assuming group_name is the property you want
                  .map((group, index) => (
                    <option key={index} value={group.group_name}>
                      {group.group_name}
                    </option>
                  ))}
            </select>

            <div className="mt-3 mb-2">
              <ul className="flex flex-wrap">
                {selectOptions &&
                  selectOptions.hashtags.map((name, index) => (
                    <li key={index} className="mb-4 mr-4">
                      <div className="flex items-center">
                      <input
                      type="checkbox"
                      checked={checkedHashtagList[index]}
                      onChange={() => handleCheckboxHashtagChange(index)}
                      className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                        {name}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

              <hr />
              
            <div>
            <div className="md:flex justify-between items-center mb-4 mt-4">
              <div>
                <p className="text-lg text-customBlue font-semibold">
                  Select Mention(s) (Optional)
                </p>
                <p className="text-customDarkpuprle ">
                  Include mentions to this post 
                </p>
              </div>
              <Link
                to="/settings/mentions"
                className="float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs"
              >
                Add Mentions
              </Link>
            </div>

              <ul className="flex flex-wrap">
                {isFetchedMentions &&
                  isFetchedMentions.map((name, index) => (
                    <li key={index} className='mb-4 mr-4'>
                        <input
                        type="checkbox"
                        checked={checkedMentionsList[index]}
                        onChange={() => handleCheckboxMentionsChange(index)}
                        className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />{" "}
                        {name}
                        
                      </li>
                  ))}
              </ul>
            </div>

              <hr />

            <div>
            <div className="md:flex justify-between items-center mb-4 mt-4">
              <div>
                <p className="text-lg text-customBlue font-semibold">
                  Select Targeted Cities (Optional)
                </p>
                <p className="text-customDarkpuprle ">
                  Include cities you would like to target for this post 
                </p>
              </div>
              <Link
                to="/target-cities"
                className="float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs"
              >
                Add Cities
              </Link>
            </div>

              <ul className="flex flex-wrap">
                {IsFetchedCities &&
                  IsFetchedCities.map((name, index) => (
                    <li key={index} className='mb-4 mr-4'>
                        <input
                        type="checkbox"
                        checked={checkedCitiesList[index]}
                        onChange={() => handleCheckboxCitiesChange(index)}
                        className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />{" "}
                        #{name}
                        
                      </li>
                  ))}
              </ul>
            </div>

            <button
              type="submit"
              className="mt-4 bg-customBlue text-center text-white py-2 rounded-lg hover:bg-customTextBlue cursor-pointer"
              //   onClick={}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HashtagAndMentions;
