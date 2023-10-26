import { FaYoutube } from "react-icons/fa";
import UserWrapper from "../UserWrapper";
import { Form } from "./form";

const Youtube = () => {
  return (
    <UserWrapper>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaYoutube className='text-3xl text-red-700 md:text-5xl' />

        <Form name='youtube' />
      </div>
    </UserWrapper>
  );
};

export default Youtube;
