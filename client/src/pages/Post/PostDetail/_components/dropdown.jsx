import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

const Dropdown = ({ editPost, savePost, handleSubmit }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className='IconButton' aria-label='Customise options'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='30'
            height='30'
            fill='#1B3474'
            className='bi bi-three-dots-vertical'
            viewBox='0 0 16 16'
          >
            <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z' />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='DropdownMenuContent'
          sideOffset={5}
          align='start'
          side='left'
          alignOffset={50}
        >
          <button
            className='block w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-400'
            onClick={() => {
              editPost();
              setOpen(false);
            }}
          >
            Edit Post
          </button>
          <button
            className='block w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-400'
            onClick={() => {
              savePost();
              setOpen(false);
              handleSubmit();
            }}
          >
            Save Post
          </button>
          <button className='block w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-400'>
            Delete Post
          </button>
          <button className='block w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-400'>
            Copy Post
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
