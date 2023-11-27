import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import UserWrapper from "./UserWrapper";
import axios from "axios";

const SocialMediaChannels = () => {

axios.get(`http://127.0.0.1:8000/api/v1/social_media_channels/`, {
          withCredentials: true,
        })
        .then((response) => {
          // setLoading(false)
          let resData = response.data;
          console.log(resData)
          // setSuccess("Topics created successfully!");
          // setTimeout(() => {
          //   handleSentenceNavigate(resData)
          // }, 2000);
        })
        .catch((error) => {
          // setLoading(false);
          // setError("Error creating topics..!");
          console.error("Error fetching Social Media:", error);
        });

      // setTimeout(() => {
      //   setError("");
      // }, 4000)


  return (
    <UserWrapper>
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <div>
          <h2 className='pb-12 text-2xl font-bold text-customBlue xl:text-4xl'>
            My Channels
          </h2>
        </div>
        <div className='flex gap-4'>
          <Link to='/social-media-channels/facebook'>
            <FaFacebook className='text-3xl text-blue-700 md:text-5xl' />
          </Link>
          <Link to='/social-media-channels/twitter'>
            <FaTwitter className='text-3xl text-blue-500 md:text-5xl' />
          </Link>
          <Link to='/social-media-channels/instagram'>
            <FaInstagram className='text-3xl text-pink-600 md:text-5xl' />
          </Link>
          <Link to='/social-media-channels/linkedin'>
            <FaLinkedin className='text-3xl text-blue-800 md:text-5xl' />
          </Link>
          <Link to='/social-media-channels/youtube'>
            <FaYoutube className='text-3xl text-red-700 md:text-5xl' />
          </Link>
          <Link to='/social-media-channels/pinterest'>
            <FaPinterest className='text-3xl text-red-600 md:text-5xl' />
          </Link>
        </div>
        <div className='flex items-center justify-center mt-6 md:mt-8'>
          <Link
            to='/'
            className='flex items-center gap-3 px-10 py-2 text-white rounded-md bg-customBlue'
          >
            Connect
          </Link>
        </div>
      </div>
    </UserWrapper>
  );
};

export default SocialMediaChannels;
