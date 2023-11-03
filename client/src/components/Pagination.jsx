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
    <div className='flex items-center w-4/6 gap-x-1 md:max-w-max'>
      <button
        className='hover:bg-[#333]/20  p-2 rounded-full md:text-base text-xs'
        onClick={prevPage}
      >
        Previous
      </button>
      <ul className='flex gap-x-1 md:gap-x-5'>
        {listOfNextPages.map((item) => {
          if (item <= totalPage) {
            return (
              <li className='flex items-center justify-center ' key={item}>
                <button
                  onClick={() => setPageNumber(item)}
                  className={`${
                    currentPage === item && "bg-customBlue text-white"
                  } rounded-full md:w-10 aspect-square w-6 text-xs md:text-base hover:bg-[#333]/20`}
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
          className='hover:bg-[#333]/20  p-2 rounded-full md:text-base text-xs'
        >
          Next
        </button>
      </ul>
    </div>
  );
};
