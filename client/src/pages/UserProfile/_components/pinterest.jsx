import { FaPinterest } from "react-icons/fa";
import UserWrapper from "../UserWrapper";
import { Form } from "./form";

const Pinterest = () => {
  return (
    <UserWrapper>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaPinterest className='text-3xl text-red-600 md:text-5xl' />

        <Form name='pinterest' />
      </div>
    </UserWrapper>
  );
};

export default Pinterest;
