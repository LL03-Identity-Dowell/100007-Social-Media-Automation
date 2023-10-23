export const Form = () => {
  return (
    <form className='flex flex-col items-center justify-center gap-6'>
      <input
        type='number'
        placeholder='Enter Page ID'
        className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0  outline-offset-0 text-[#333]'
      />
      <input
        type='text'
        placeholder='Enter Page Link'
        className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0 '
      />
      <input
        type='number'
        placeholder='Enter no. of posts per day'
        className='w-[600px] border-t-0 placeholder:font-bold placeholder:text-xl h-14 border-r-0 border-l-0 border-b-2 bg-transparent outline-none ring-0 outline-offset-0 '
      />
      <button
        type='submit'
        className='h-12 font-bold text-white rounded-sm w-28 bg-customBlue'
      >
        Done
      </button>
    </form>
  );
};
