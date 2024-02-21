import { Cross2Icon } from "@radix-ui/react-icons";
import { useRef } from "react";

export const Banner = () => {
  const ref = useRef();

  const hideBanner = () => {
    ref.current.removeAttribute("open");
  };

  return (
    <dialog
      ref={ref}
      open
      className='pb-4 rounded-md shadow bg-customBlue opacity-95'
    >
      <button
        className='cursor-pointer absolute right-[-7px] top-[-6px] '
        onClick={hideBanner}
      >
        <Cross2Icon className='p-0 m-0 text-white bg-red-600 rounded-full size-4' />
      </button>

      <p className='px-4 pt-4 text-white'>
        Words should be less than 250 for Pinterest and Twitter.
      </p>
    </dialog>
  );
};
