import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  SocialComponentForPost,
  SocialComponentForSchedule,
} from "./SocialComponent";
import { useState } from "react";

export const PostModal = ({
  article,
  setError,
  setLoading,
  setSuccessMessage,
  socialArr,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-customBlue'
        >
          Post Now
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-[#e6e8e9] p-10 space-y-8 focus:outline-none shadow-md w-7/12 bg-[#edeeeefb]'>
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <Dialog.Title className=' text-center text-[#1b3476] m-0 text-3xl font-bold'>
            Where do you want to post?
          </Dialog.Title>
          <SocialComponentForPost
            article={article}
            setError={setError}
            setLoading={setLoading}
            setSuccessMessage={setSuccessMessage}
            setOpen={setOpen}
            socialArr={socialArr}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const ScheduleModal = ({
  article,
  setError,
  setLoading,
  setSuccessMessage,
  socialArr,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-[#5c6388]'
        >
          Schedule
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-[#e6e8e9] p-10 space-y-8 focus:outline-none shadow-md w-7/12 bg-[#edeeeefb]'>
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <Dialog.Title className=' text-center text-[#1b3476] m-0 text-3xl font-semibold'>
            Where do you want to post?
          </Dialog.Title>
          <SocialComponentForSchedule
            article={article}
            setError={setError}
            setLoading={setLoading}
            setSuccessMessage={setSuccessMessage}
            setOpen={setOpen}
            socialArr={socialArr}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
