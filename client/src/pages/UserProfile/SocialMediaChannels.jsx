import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaYoutube,
  FaArrowRight 
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserWrapper from "./UserWrapper";
import axios from "axios";

import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";



const SocialMediaChannels = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [linkedSocials, setLinkedSocials] = useState([]);
  const [visible, setVisible] = useState(false)
  const [activateLink, setActivateLink] = useState({
    activate: "Activate",
    info: "Click to activate"
  });

  useEffect(() => {
    checkUserAyrshareSocialLinking();
    checkUserSocialMedia();
    
  }, [])

  const checkUserSocialMedia = () => {
     setLoading(true)
    axios.get(`http://127.0.0.1:8000/api/v1/social_media_channels/`, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false)
          let resData = response.data;
          let linked_accounts = resData.linked_accounts;
          console.log(linked_accounts);
          if(!linked_accounts){
            setLinkedSocials([]);
          }else if (linked_accounts){
            setLinkedSocials(linked_accounts);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching Social Media:", error);
          
        });
  }

  const checkUserAyrshareSocialLinking = () => {
    
    // setLoading(true)
    axios.get(`http://127.0.0.1:8000/api/v1/link/`, {
          withCredentials: true,
        })
        .then((response) => {
          // setLoading(false)
          let resData = response.data;
          console.log(resData)
        })
        .catch((error) => {
          // setLoading(false);
          if(error.response.status == 400 && error.response.statusText == "Bad Request" && error.response.data.includes("Profile title already exists")){
            setActivateLink({
              activate: "Link Social Media Accounts",
              info: "Clck to Link"
            })
            
          }
          
          console.log(error.response.data);
        });

     
  }
 


  return (
    <UserWrapper>
      <div className='flex flex-col items-center justify-center w-full h-full'>
        {loading && <Loading />}
        {error && <ErrorMessages>{error}</ErrorMessages>}
        {success && <SuccessMessages>{success}</SuccessMessages>}
        <div>
          <h2 className='pb-12 text-2xl font-bold text-customBlue xl:text-4xl'>
            My Channels
          </h2>
        </div>
        <div className='flex gap-4'>
          {linkedSocials.length == 0  && <p className="text-lg"> You do not have any social media account linked </p>}
          
          {linkedSocials.includes("facebook") && <Link to='/social-media-channels/facebook'>
            <FaFacebook className='text-3xl text-blue-700 md:text-5xl' />
          </Link>}

          {linkedSocials.includes("twitter") && <Link to='/social-media-channels/twitter'>
            <FaTwitter className='text-3xl text-blue-500 md:text-5xl' />
          </Link>}

          {linkedSocials.includes("instagram") && <Link to='/social-media-channels/instagram'>
            <FaInstagram className='text-3xl text-pink-600 md:text-5xl' />
          </Link>}

          {linkedSocials.includes("linkedin") && <Link to='/social-media-channels/linkedin'>
            <FaLinkedin className='text-3xl text-blue-800 md:text-5xl' />
          </Link>}

          {linkedSocials.includes("youtube") && <Link to='/social-media-channels/youtube'>
            <FaYoutube className='text-3xl text-red-700 md:text-5xl' />
          </Link>}

          {linkedSocials.includes("pinterest") && <Link to='/social-media-channels/pinterest'>
            <FaPinterest className='text-3xl text-red-600 md:text-5xl' />
          </Link>}

        </div>
        <div className='flex items-center justify-center mt-6 md:mt-8'>
          <Link  onClick={() => setVisible(true)}
            to=""
            className='flex items-center gap-3 px-10 py-2 text-white rounded-md bg-customBlue'
          >
            Connect
          </Link>
        </div>



      </div>


      {/* Modal */}
      { visible && <div id="" tabIndex="-1" aria-hidden="true" className="bg-overlay overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full">
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-customTextBlue dark:text-white">
              Social Media Accounts Linking
            </h3>
            <button type="button" onClick={() => setVisible(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5">
            <ul className="space-y-4 mb-4">
              <li>
                <Link to="http://127.0.0.1:8000/api/v1/link/" target="_blank">
                <input type="button" id="social" className="hidden peer"  />
                <label htmlFor="job-1" className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                  <div className="block">
                    <div className="w-full text-lg font-semibold">{activateLink.activate}</div>
                    <div className="w-full text-gray-500 dark:text-gray-400">{activateLink.info}</div>
                  </div>
                  <FaArrowRight  className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400" />
                </label>
                </Link>
              </li>
              {/* Add similar code for other job options */}
            </ul>
            <Link data-modal-toggle="select-modal" to="http://localhost:5173/user-profile">
                <button className="text-white inline-flex w-full justify-center bg-customBlue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Done
            </button>
            </Link>
          
          </div>
        </div>
      </div>
    </div>}

    </UserWrapper>
  );
};

export default SocialMediaChannels;
