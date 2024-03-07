import {
  facebook,
  instagram,
  linkedin,
  pinterest,
  xTwitter,
} from '/src/assets';

const PostedTo = ({ socials }) => {
  if (!socials) return;

  return (
    <ul className='flex items-center gap-3 mr-10'>
      {socials?.map((each) => {
        return (
          <li key={each}>
            {each === 'twitter' && (
              <img
                src={xTwitter}
                className='w-6 h-6 p-1 bg-black rounded-full'
                alt='twitter'
              />
            )}
            {each === 'linkedin' && (
              <img
                src={linkedin}
                className='w-6 h-6 p-1 rounded-full bg-[#0000ff]'
                alt='linkedin'
              />
            )}
            {each === 'youtube' && <div className='small-youtube-logo '></div>}
            {each === 'instagram' && (
              <img
                src={instagram}
                className='w-6 h-6 p-1 rounded-full bg-[#b003c7]'
                alt='facebook'
              />
            )}
            {each === 'facebook' && (
              <img
                src={facebook}
                className='w-6 h-6 p-1 rounded-full bg-customBlue'
                alt='facebook'
              />
            )}
            {each === 'pinterest' && (
              <img
                src={pinterest}
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
