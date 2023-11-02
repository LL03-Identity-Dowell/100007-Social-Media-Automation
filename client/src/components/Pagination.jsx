import "bootstrap/dist/css/bootstrap.css";

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
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <a href="#" className="page-link" onClick={prevPage}>
            Prev
          </a>
        </li>
        {pageNumber.map((number, i) => {
          return (
            <li
              className={`page-item ${currentPage === number ? "active" : ""}`}
              key={i}
            >
              <a
                href="#"
                className="page-link"
                onClick={() => paginate(number)}
              >
                {number}
              </a>
            </li>
          );
        })}
        <li className="page-item">
          <a href="#" className="page-link" onClick={nextPage}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
