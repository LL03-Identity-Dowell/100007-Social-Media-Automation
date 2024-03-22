import { FaTwitter } from 'react-icons/fa';
import {UserWrapperSocials} from './UserWrapperSocials';
import { Form } from './form';

const Twitter = () => {
  return (
    <UserWrapperSocials>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaTwitter className='text-3xl text-blue-500 md:text-5xl' />
        <Form name='twitter' />
      </div>
    </UserWrapperSocials>
  );
};

export default Twitter;
