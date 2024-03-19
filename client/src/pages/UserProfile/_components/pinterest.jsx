import { FaPinterest } from 'react-icons/fa';
import {UserWrapperSocials} from './UserWrapperSocials';
import { Form } from './form';

const Pinterest = () => {
  return (
    <UserWrapperSocials>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaPinterest className='text-3xl text-red-600 md:text-5xl' />

        <Form name='pinterest' />
      </div>
    </UserWrapperSocials>
  );
};

export default Pinterest;
