import { FaInstagram } from 'react-icons/fa';
import { UserWrapperSocials } from './UserWrapperSocials';
import { Form } from './form';

const Instagram = () => {
  return (
    <UserWrapperSocials>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaInstagram className='text-3xl text-pink-600 md:text-5xl' />
        <Form name='instagram' />
      </div>
    </UserWrapperSocials>
  );
};

export default Instagram;
