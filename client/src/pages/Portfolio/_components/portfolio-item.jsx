import SocialArray from "./social-array";

const PortfolioItem = ({ id, name, channels }) => {
  return (
    <li className='space-y-5' id={id} name={name}>
      <h3 className='text-3xl font-semibold text-customBlue'>{name}</h3>
      <SocialArray channels={channels} />
    </li>
  );
};

export default PortfolioItem;
