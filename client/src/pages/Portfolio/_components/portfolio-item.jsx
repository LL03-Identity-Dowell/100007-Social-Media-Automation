import SocialArray from "./social-array";

const PortfolioItem = ({ id, name }) => {
  return (
    <li className='space-y-3'>
      <h3 className='text-3xl font-semibold text-customBlue'>{name}</h3>
      <SocialArray />
    </li>
  );
};

export default PortfolioItem;
