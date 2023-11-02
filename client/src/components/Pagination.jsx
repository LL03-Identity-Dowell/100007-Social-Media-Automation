const Pagination = ({
  pageCount,
  totalPage,
  currentPage,
  prevPage,
  nextPage,
  paginate,
}) => {
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(totalPage / pageCount); i++) {
    pageNumber.push(i);
  }

  return (
    <nav aria-label='Page navigation example'>
      <ul className='inline-flex -space-x-px text-sm'>
        <li className='page-item'>
          <a
            href='#'
            className='flex items-center justify-center h-8 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            onClick={prevPage}
          >
            Prev
          </a>
        </li>
        {pageNumber.map((number, i) => {
          return (
            <li className={`${currentPage === number ? "active" : ""}`} key={i}>
              <a
                href='#'
                className='flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                onClick={() => paginate(number)}
              >
                {number}
              </a>
            </li>
          );
        })}
        <li className='page-item'>
          <a
            href='#'
            className='flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            onClick={nextPage}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
