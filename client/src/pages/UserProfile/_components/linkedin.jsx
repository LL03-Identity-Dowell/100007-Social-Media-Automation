import { FaLinkedin } from "react-icons/fa";
import UserWrapper from "../UserWrapper";
import { Form } from "./form";

const Linkedin = () => {
  return (
    <UserWrapper>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaLinkedin className='text-3xl text-blue-800 md:text-5xl' />
        <Form name='linkedIn' />
      </div>
    </UserWrapper>
  );
};

export default Linkedin;
