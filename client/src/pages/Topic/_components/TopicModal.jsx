import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Wrapper } from './Wrapper';

export const TopicModal = ({ name }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='h-10 font-bold text-white rounded-sm w-28 text-center cursor-pointer bg-customBlue'>
          Automate
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content
          className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[100vh] w-[60vw] max-w-[450px] md:max-w-[60vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'
          style={{ zIndex: 9999 }}>
          <Wrapper name={name} />
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
