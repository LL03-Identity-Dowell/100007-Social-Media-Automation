const PostedTo = ({ socials }) => {
  if (!socials) return;

  const socialArray = socials?.map((each) => each.platform);
  return (
    <ul className='flex items-center gap-3 mr-10'>
      {socialArray.map((each) => {
        return (
          <li key={each}>
            {each === "twitter" && (
              <img
                src='/x-twitter.svg'
                className='w-6 h-6 p-1 bg-black rounded-full'
                alt='twitter'
              />
            )}
            {each === "linkedin" && (
              <img
                src='/linkedin.svg'
                className='w-6 h-6 p-1 rounded-full bg-[#0000ff]'
                alt='linkedin'
              />
            )}
            {each === "youtube" && <div className='small-youtube-logo '></div>}
            {each === "instagram" && (
              <img
                src='/instagram.svg'
                className='w-6 h-6 p-1 rounded-full bg-[#b003c7]'
                alt='facebook'
              />
            )}
            {each === "facebook" && (
              <img
                src='/facebook.svg'
                className='w-6 h-6 p-1 rounded-full bg-customBlue'
                alt='facebook'
              />
            )}
            {each === "pinterest" && (
              <img
                src='/pinterest.svg'
                className='bg-[#e60023] w-6 h-6 p-1 rounded-full'
                alt='pinterest'
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default PostedTo;
