import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import Carosuel from "./carousel";
const CarosuelModal = ({ setSelectedImage }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          className='absolute px-3 py-1 text-sm font-semibold bg-gray-400 rounded-md cursor-pointer top-2 right-2 text-customBlue hover:opacity-90'
        >
          Edit Photo
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-white/60 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-xl bg-[#e6e8e9] md:py-4 md:pb-10 md:px-10 focus:outline-none shadow-md w-11/12 md:w-10/12 bg-[#f4f7f7fb] z-50 p-4'>
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[20px] right-[20px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>

          <div className='flex items-center justify-around mt-6 mb-4'>
            <h2 className='m-0 text-[32px] font-bold text-center text-customBlue modal-title'>
              Select an image
            </h2>
            <div className='flex items-center'>
              <input type='search' name='search-images' className='h-10 ' />
              <img
                src='/search-icon.svg'
                className='w-11 h-11 ml-[-2px] cursor-pointer'
                alt='search icon'
              />
            </div>
          </div>
          <div className='p-0 m-0'>
            <Carosuel setImage={setImage} image={image} />
          </div>
          <div className='mt-3 mb-4 text-center image_details'>
            <p className='mx-3 image_paragraph'>
              The Dowell UX Livinglab is an innovative research and development
              laboratory that focuses on the use of technology to improve the
              quality of life.
            </p>
            <p id='imageURL' className='mx-3 image_paragraph'>
              <strong>URL: </strong>Pexels.com
            </p>
            <p id='imageAuthor' className='mx-3 image_paragraph'>
              <strong>Author: </strong>Pexels
            </p>
            <p id='authorURL' className='mx-3 image_paragraph '>
              <strong>Author URL: </strong>Pexels.com
            </p>
          </div>
          <div className='flex items-center w-full space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600'>
            <button
              onClick={() => {
                setSelectedImage(image);
                setOpen(false);
              }}
              type='button'
              className='text-white bg-customBlue hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800 mx-auto cursor-pointer'
              disabled={image === ""}
            >
              Update Post
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CarosuelModal;
