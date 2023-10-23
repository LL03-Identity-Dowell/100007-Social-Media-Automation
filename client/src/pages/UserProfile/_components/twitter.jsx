import { FaTwitter } from "react-icons/fa";
import UserWrapper from "../UserWrapper";
import { Form } from "./form";

const Twitter = () => {
  return (
    <UserWrapper>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaTwitter className='text-3xl text-blue-500 md:text-5xl' />

        <Form />
      </div>
    </UserWrapper>
  );
};

export default Twitter;
