import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  SocialComponentForPost,
  SocialComponentForSchedule,
} from './SocialComponent';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PostModal = ({
  article,
  setError,
  setLoading,
  setSuccessMessage,
  socialArr,
}) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const productKey = localStorage.getItem('productKey');
    if (productKey) {
      navigate('/');
    }
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          className='w-24 h-10 text-sm text-center text-white rounded-md hover:opacity-95 bg-customBlue '>
          Post Now
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-[#e6e8e9] md:p-11 px-2 py-6 space-y-10 focus:outline-none shadow-md md:w-[80%] xl:w-[70%] w-full bg-[#edeeeefb]'>
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <h2 className='m-0 md:text-3xl text-xl font-bold text-center text-customBlue modal-title'>
            Where do you want to post?
          </h2>
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
  const navigate = useNavigate();

  useEffect(() => {
    const productKey = localStorage.getItem('productKey');
    if (productKey) {
      navigate('/');
    }
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-[#5c6388] text-center'>
          Schedule
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-[#e6e8e9] md:p-11 px-2 py-6 space-y-10 focus:outline-none shadow-md md:w-[80%] xl:w-[70%] w-full bg-[#edeeeefb]'>
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <h2 className='m-0 md:text-3xl text-xl font-bold text-center text-customBlue modal-title'>
            Where do you want to post?
          </h2>
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
