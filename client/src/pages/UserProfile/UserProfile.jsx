import { useEffect, useState } from "react";
import {
  FaMailBulk,
  FaMap,
  FaMapMarkedAlt,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import UserWrapper from "./UserWrapper";

const UserProfile = ({ close }) => {
  const [username, setUserName] = useState(null);
  useEffect(() => {
    close();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    setUserName(user?.username);
  }, []);
  return (
    <UserWrapper>
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <div className='flex flex-col items-center justify-center'>
          <h2 className='pb-3 text-2xl  text-customBlue xl:text-4xl'>
            Welcome!
          </h2>
          <h4 className='pb-6 text-2xl font-bold text-customBlue xl:text-3xl'>
            {username}
          </h4>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-4 mt-6 md:flex-row md:mt-10 md:gap-8 xl:gap-12 '>
          <Link
            to='/client-profile'
            className='flex flex-col items-center text-customBlue hover:text-customTextBlue'
          >
            <FaUser className='text-6xl md:text-[100px]' />
            <h5 className='pt-4 text-sm font-bold md:text-lg'>
              View Client&apos;s Profile
            </h5>
          </Link>
          <Link
            to='/social-media-channels'
            className='flex flex-col items-center text-customBlue hover:text-customTextBlue'
          >
            <FaMailBulk className='text-6xl md:text-[100px]' />
            <h5 className='pt-4 text-sm font-bold md:text-lg'>
              Social Media Channels
            </h5>
          </Link>
          <Link
            to='/target-cities'
            className='flex flex-col items-center text-customBlue hover:text-customTextBlue'
          >
            <FaMapMarkedAlt className='text-6xl md:text-[100px]' />
            <h5 className='pt-4 text-sm font-bold md:text-lg'>
              Targeted Cities
            </h5>
          </Link>
          <Link
            to='/user-approval'
            className='flex flex-col items-center text-customBlue hover:text-customTextBlue'
          >
            <FaUserCheck className='text-6xl md:text-[100px]' />
            <h5 className='pt-4 text-sm font-bold md:text-lg'>
              Approval by clients
            </h5>
          </Link>
          {/* <Link
            to='/'
            className='flex flex-col items-center text-customBlue hover:text-customTextBlue'
          >
            <FaUser className='text-6xl md:text-[100px]' />
            <h5 className='pt-4 text-sm font-bold md:text-lg'>View Team</h5>
          </Link> */}
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserProfile;
