import {
  facebook,
  instagram,
  linkedin,
  pinterest,
  xTwitter,
} from "/src/assets";

const SocialIcons = ({ socialArray }) => {
  return (
    <ul className='flex justify-center gap-8 mb-4'>
      {socialArray?.map((each) => (
        <li key={each}>
          {each === "facebook" && (
            <label
              htmlFor='facebook'
              className='flex flex-row-reverse items-center'
            >
              <img
                src={facebook}
                className='w-14 h-[65px] ml-1 p-2 rounded-md bg-customBlue'
                alt='facebook'
              />
              <input
                name='facebook'
                className='w-3 h-3'
                type='checkbox'
                id='facebook'
              />
            </label>
          )}
          {each === "twitter" && (
            <label
              htmlFor='twitter'
              className='flex flex-row-reverse items-center'
            >
              <img
                src={xTwitter}
                className='w-14 h-[65px] ml-1 p-2 rounded-md bg-black'
                alt='twitter'
              />
              <input
                name='twitter'
                className='w-3 h-3'
                type='checkbox'
                id='twitter'
              />
            </label>
          )}
          {each === "instagram" && (
            <label
              htmlFor='instagram'
              className='flex flex-row-reverse items-center'
            >
              <img
                src={instagram}
                className='w-14 h-[65px] ml-1 p-2 rounded-md bg-[#b003c7]'
                alt='facebook'
              />
              <input
                name='instagram'
                className='w-3 h-3'
                type='checkbox'
                id='instagram'
              />
            </label>
          )}
          {each === "linkedin" && (
            <label
              htmlFor='linkedin'
              className='flex flex-row-reverse items-center'
            >
              <img
                src={linkedin}
                className='w-14 h-[65px] ml-1 p-2 rounded-md bg-[#0000ff]'
                alt='linkedin'
              />
              <input
                name='linkedin'
                className='w-3 h-3'
                type='checkbox'
                id='linkedin'
              />
            </label>
          )}
          {each === "youtube" && (
            <label
              htmlFor='youtube'
              className='flex flex-row-reverse items-center'
            >
              <div className='medium-youtube-logo '></div>
              <input
                name='youtube'
                className='w-3 h-3'
                type='checkbox'
                id='youtube'
              />
            </label>
          )}
          {each === "pinterest" && (
            <label
              htmlFor='pinterest'
              className='flex flex-row-reverse items-center'
            >
              <img
                src={pinterest}
                className='w-14 h-[65px] ml-1 p-2 rounded-md bg-[#e60023]'
                alt='pinterest'
              />
              <input
                name='pinterest'
                className='w-3 h-3'
                type='checkbox'
                id='pinterest'
              />
            </label>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SocialIcons;
