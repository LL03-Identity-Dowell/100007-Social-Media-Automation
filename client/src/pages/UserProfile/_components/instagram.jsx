import { FaInstagram } from "react-icons/fa";
import UserWrapper from "../UserWrapper";
import { Form } from "./form";

const Instagram = () => {
  return (
    <UserWrapper>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaInstagram className='text-3xl text-pink-600 md:text-5xl' />
        <Form name='instagram' />
      </div>
    </UserWrapper>
  );
};

export default Instagram;
