import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorMessages, SuccessMessages } from '/src/components/Messages';
import Loading from '/src/components/Loading.jsx';

import { FaTimes } from 'react-icons/fa';

export const Form = ({ name }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectOptions, setSelectOptions] = useState();
  const [isFetched, setIsFetched] = useState('');
  const [socialLinksList, setSocialLinksList] = useState([]);
  const [IsFetchedCities, setIsFetchedCities] = useState();
  const [checkedHashtagList, setCheckedHashtagList] = useState([]);
  const [checkedCitiesList, setCheckedCitiesList] = useState([]);
  const [socialInput, setSocialInputValue] = useState('');
  const [numberOfPosts, setNumberOfPosts] = useState(0);

  console.log(selectOptions);

  const addToList = () => {
    if (socialInput) {
      setSocialLinksList((prev) => [...prev, socialInput]);
      setSocialInputValue('');
    }
  };

  const postMethod = async (data) => {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_AUTOMATIONURLL}/automation/`,
      data,
      {
        withCredentials: true,
      }
    );
    return res;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const channel = name.toLowerCase();
    const hashtags = selectOptions.hashtags.filter(
      (_, i) => checkedHashtagList[i]
    );
    const target_cities = IsFetchedCities.filter(
      (_, i) => checkedCitiesList[i]
    );

    const data = {
      number_of_posts_per_day: numberOfPosts,
      channel,
      links: socialLinksList,
      hashtags,
      target_cities,
    };

    try {
      const res = await postMethod(data);
      console.log(res.data);
      setSuccess(res?.data?.message);

      setSocialLinksList([]);
      setCheckedHashtagList(Array(selectOptions.hashtags.length).fill(false));
      setCheckedCitiesList(Array(IsFetchedCities.length).fill(false));
      setSocialInputValue('');
      setNumberOfPosts('');
    } catch (error) {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_AUTOMATIONURLL}/automation/`,

          {
            withCredentials: true,
          }
        );

        const { data } = res;
        if (data?.length === 0) {
          // setStatus('insert');
          console.log('insert');
        }
        if (data?.length > 0) {
          // setStatus('update');
          console.log('update');
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [name]);

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
          setSelectOptions(data[0]);
        })
        .catch((error) => {
          setError('Server error, Please try again later');
          console.error('Error fetching user-approval:', error);
        });

      axios
        .get(`${import.meta.env.VITE_APP_BASEURL}/fetch_user_settings_data/`, {
          withCredentials: true,
        })
        .then((response) => {
          let citiesData = response.data.data[0].target_city;

          setIsFetchedCities(citiesData);
        })
        .catch((error) => {
          setError('Server error, Please try again later');
          console.error('Error fetching user-approval:', error);
        });
    };
    fetch();
  }, []);

  const handleCheckboxHashtagChange = (index) => {
    const updatedChecked = [...checkedHashtagList];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedHashtagList(updatedChecked);
  };

  const handleCheckboxCitiesChange = (index) => {
    const updatedChecked = [...checkedCitiesList];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedCitiesList(updatedChecked);
  };

  return (
    <>
      {error !== '' && <ErrorMessages>{error}</ErrorMessages>}
      {success !== '' && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />}
      <form
        className='flex flex-col items-center justify-center gap-6'
        onSubmit={onSubmit}>
        <input
          name='number_of_posts_per_day'
          type='number'
          onChange={(e) => setNumberOfPosts(e.target.value)}
          value={numberOfPosts}
          placeholder='Enter no. of posts per day'
          className='w-full border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0  focus:ring-0 focus:border-[0 0 4px 0]'
        />

        <div className='flex flex-col w-full '>
          <div className='md:flex justify-between items-center mb-4 mt-4'>
            <div>
              <p className='text-lg text-customBlue font-semibold'>
                Social links
              </p>
              <p className='text-customDarkpuprle '>
                Include links you would like to target for this post
              </p>
            </div>

            <button
              onClick={addToList}
              type='button'
              className='float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs'>
              Add link
            </button>
          </div>
          <input
            onChange={(e) => setSocialInputValue(e.target.value)}
            value={socialInput}
            type='text'
            className='flex-grow rounded-md '
          />

          <ul className='flex flex-col mt-2 gap-y-1'>
            {socialLinksList?.map((each, index) => {
              return (
                <li
                  className='flex justify-between text-gray-600 bg-blue-200 pl-2 rounded-sm flex-[50%] '
                  key={index}>
                  <p>
                    {each.length < 78 ? each : `${each.substring(0, 78)}...`}
                  </p>
                  <button
                    type='button'
                    onClick={() =>
                      setSocialLinksList((prev) => {
                        const filtered = prev?.filter((_, i) => i !== index);
                        return filtered;
                      })
                    }
                    className='mr-8 underline text-sm font-semibold text-red-600 p-1 border-red-700 cursor-pointer rounded-md'>
                    <FaTimes />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='flex flex-col w-full '>
          <div className='md:flex justify-between items-center mb-6'>
            <div>
              <p className='text-lg text-customBlue font-semibold'>
                Select a hashtag group (Optional)
              </p>
              <p className='text-customDarkpuprle '>
                Include your favourite hashtags to this post by selecting from
                your saved groups.
              </p>
            </div>
            <Link
              to='/settings/hastags'
              className='float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs'>
              Add hastags
            </Link>
          </div>
          <select
            name=''
            id=''
            className='w-full outline-1 rounded-lg text-customGray'
            onChange={(e) => {
              const selectedGroup = isFetched.find(
                (group) => group.group_name === e.target.value
              );
              setSelectOptions(selectedGroup);
            }}>
            {isFetched &&
              isFetched
                .filter((group) => group.group_name) // Assuming group_name is the property you want
                .map((group, index) => (
                  <option key={index} value={group.group_name}>
                    {group.group_name}
                  </option>
                ))}
          </select>

          <div className='mt-3 mb-2'>
            <ul className='flex flex-wrap'>
              {selectOptions &&
                selectOptions?.hashtags?.map((name, index) => (
                  <li key={index} className='mb-4 mr-4'>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={checkedHashtagList[index]}
                        onChange={() => handleCheckboxHashtagChange(index)}
                        className='w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      {name}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <hr />

          <div>
            <div className='md:flex justify-between items-center mb-4 mt-4'>
              <div>
                <p className='text-lg text-customBlue font-semibold'>
                  Select Targeted Cities (Optional)
                </p>
                <p className='text-customDarkpuprle '>
                  Include cities you would like to target for this post
                </p>
              </div>
              <Link
                to='/target-cities'
                className='float-right border rounded-xl hover:bg-customTextBlue bg-customBlue cursor-pointer text-white py-1 px-2 text-xs'>
                Add Cities
              </Link>
            </div>

            <ul className='flex flex-wrap'>
              {IsFetchedCities &&
                IsFetchedCities.map((name, index) => (
                  <li key={index} className='mb-4 mr-4'>
                    <input
                      type='checkbox'
                      checked={checkedCitiesList[index]}
                      onChange={() => handleCheckboxCitiesChange(index)}
                      className='w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                    />{' '}
                    #{name}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <button
          type='submit'
          className='h-10 font-bold text-white rounded-sm w-28 text-center cursor-pointer bg-customBlue'>
          Done
        </button>
      </form>
    </>
  );
};
