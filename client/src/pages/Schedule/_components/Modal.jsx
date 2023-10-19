import * as Dialog from "@radix-ui/react-dialog";

const Modal = ({ children, title }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {title === "post" ? (
          <button
            type='button'
            className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-customBlue'
          >
            Post Now
          </button>
        ) : (
          <button
            type='button'
            className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-[#5c6388]'
          >
            Schedule
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#e6e8e9] p-10 space-y-8 focus:outline-none shadow-md w-7/12'>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
