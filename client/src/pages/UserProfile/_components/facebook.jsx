import { FaFacebook } from "react-icons/fa";
import UserWrapper from "../UserWrapper";
import { Form } from "./form";

const Fackbook = () => {
  return (
    <UserWrapper>
      <div className='flex flex-col items-center w-full h-full justify-evenly '>
        <FaFacebook className='text-3xl text-blue-700 md:text-5xl' />

        <Form />
      </div>
    </UserWrapper>
  );
};

export default Fackbook;
