import { FaLinkedin } from 'react-icons/fa';
import {UserWrapperSocials} from './UserWrapperSocials';
import { Form } from './form';

const Linkedin = () => {
  return (
    <UserWrapperSocials>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaLinkedin className='text-3xl text-blue-800 md:text-5xl' />
        <Form name='linkedIn' />
      </div>
    </UserWrapperSocials>
  );
};

export default Linkedin;
