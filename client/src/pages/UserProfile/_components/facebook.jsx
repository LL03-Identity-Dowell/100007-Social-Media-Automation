import { FaFacebook } from 'react-icons/fa';
import { UserWrapperSocials } from './UserWrapperSocials';
import { Form } from './form';

const Fackbook = () => {
  return (
    <UserWrapperSocials>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaFacebook className='text-3xl text-blue-700 md:text-5xl' />

        <Form name='facebook' />
      </div>
    </UserWrapperSocials>
  );
};

export default Fackbook;
