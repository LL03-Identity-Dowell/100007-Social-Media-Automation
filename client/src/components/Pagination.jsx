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
    <div className='flex justify-center pb-6 text-sm text-gray-800 lg:mt-3'>
      <button
        className='px-2 py-1 border border-gray-300 rounded-l-sm'
        onClick={prevPage}
      >
        Previous
      </button>
      <ul className='flex font-normal'>
        {listOfNextPages.map((item) => {
          if (item <= totalPage) {
            return (
              <li className='' key={item}>
                <button
                  onClick={() => setPageNumber(item)}
                  className={`px-2 rounded-sm border border-gray-300  py-1 ${
                    currentPage === item && "bg-customBlue text-white"
                  } `}
                >
                  {item}
                </button>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>

      <button
        onClick={nextPage}
        className='px-2 py-1 border border-gray-300 rounded-r-sm'
      >
        Next
      </button>
    </div>
  );
};
