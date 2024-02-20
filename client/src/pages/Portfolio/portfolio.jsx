import UserWrapper from "../UserProfile/UserWrapper";
import PortfolioItem from "./_components/portfolio-item";

const portfolioList = [
  {
    name: "Portfolio 1",
    id: 1,
  },
  {
    name: "Portfolio 2",
    id: 2,
  },
  {
    name: "Portfolio 3",
    id: 3,
  },
  {
    name: "Portfolio 4",
    id: 4,
  },
];

const Portfolio = () => {
  return (
    <UserWrapper>
      <div className='flex items-center justify-center h-full text-center'>
        <form action=''>
          <ul className='mb-4 space-y-8'>
            {portfolioList.map((portfolio) => (
              <PortfolioItem name={portfolio.name} key={portfolio.id} />
            ))}
          </ul>
          <button
            type='submit'
            className='px-2 py-2 text-center text-white rounded-md w-36 bg-customBlue hover:opacity-90'
          >
            Submit
          </button>
        </form>
      </div>
    </UserWrapper>
  );
};

export default Portfolio;
