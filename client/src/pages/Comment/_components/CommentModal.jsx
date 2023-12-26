import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useRef } from "react";
import SocialIcons from "./SocialIcons";
import axios from "axios";

const CommentModal = ({ id, socials, setError, setSuccess, setLoading }) => {
  const socialArray = socials?.map((each) => each.platform);
  const [open, setOpen] = useState(false);

  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      platforms: Array.from(formData.entries())
        .filter(
          ([key, value]) =>
            e.currentTarget[key].type === "checkbox" && value === "on"
        )
        .map(([key]) => key),
      comment: formData.get("comment") || "",
    };

    const url = `http://127.0.0.1:8000/api/v1/comments/create/${id}/`;
    await axios
      .post(url, data, {
        withCredentials: true,
      })
      .then(() => {
        setOpen(false);
        setTimeout(() => {
          setSuccess("successfully posted");
        }, 1000);
        setError("");
        formRef.current.reset();
      })
      .catch(() => {
        setError("Server error, Please try again later");
        setSuccess("");
      });
    setLoading(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type='button'
          className='px-4 py-1 text-white bg-gray-500 rounded-md'
        >
          Create comment
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-white/60 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-[#e6e8e9] p-4 md:p-11 space-y-10 focus:outline-none shadow-md w-11/12 md:w-[650px] bg-[#edeeeefb]'>
          <Dialog.Close asChild>
            <button
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <h2 className='m-0 text-[32px] font-bold text-center text-customBlue modal-title'>
            Enter your new comment
          </h2>
          <form
            ref={formRef}
            className='px-5 border-none '
            onSubmit={handleSubmit}
          >
            <textarea
              placeholder='Enter your new comment here'
              rows='4'
              name='comment'
              className='w-full text-xl text-gray-700 placeholder:text-xl placeholder:opacity-50'
            ></textarea>

            <SocialIcons socialArray={socialArray} />

            <div className='mt-2 text-center'>
              <button
                type='submit'
                className='px-2 py-2 text-center text-white rounded-md w-36 bg-customBlue hover:opacity-90'
              >
                Post comment
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommentModal;
