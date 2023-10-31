export const Pagination = ({ currentPage, setPageNumber, totalPage }) => {
  const listOfNextPages =
    currentPage === 1 || currentPage === 2
      ? [1, 2, 3, 4, 5]
      : [
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
        ];

  const prevPage = () => {
    if (currentPage > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div className='relative max-w-max'>
      <button
        className='hover:bg-[#333]/20 h-10 w-10 absolute left-[-60px] rounded-full '
        onClick={prevPage}
      >
        Prev
      </button>
      <ul className='flex gap-x-8'>
        {listOfNextPages.map((item) => {
          if (item <= totalPage) {
            return (
              <li className='flex items-center justify-center ' key={item}>
                <button
                  onClick={() => setPageNumber(item)}
                  className={`${
                    currentPage === item && "bg-customBlue text-white"
                  } rounded-full h-10 w-10  hover:bg-[#333]/20`}
                >
                  {item}
                </button>
              </li>
            );
          } else {
            return null;
          }
        })}

        <button
          onClick={nextPage}
          className='hover:bg-[#333]/20 rounded-full absolute right-[-60px] my-auto h-10 w-10'
        >
          Next
        </button>
      </ul>
    </div>
  );
};
