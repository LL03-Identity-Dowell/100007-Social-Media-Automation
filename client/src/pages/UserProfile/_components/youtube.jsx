import { FaYoutube } from "react-icons/fa";
import { Form } from "./form";
import { UserWrapperSocials } from "./UserWrapperSocials";

const Youtube = () => {
  return (
    <UserWrapperSocials>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaYoutube className='text-3xl text-red-700 md:text-5xl' />

        <Form name='youtube' />
      </div>
    </UserWrapperSocials>
  );
};

export default Youtube;
