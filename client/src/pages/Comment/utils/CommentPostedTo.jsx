import { instagram, linkedin, xTwitter } from "../../../assets";

const CommentPostedTo = () => {
  return (
    <div className='flex items-center gap-x-1'>
      <img
        src={xTwitter}
        className='size-5  p-1 bg-black rounded-full'
        alt='twitter'
      />

      <img
        src={linkedin}
        className='size-5  p-1 rounded-full bg-[#0000ff]'
        alt='linkedin'
      />

      <img
        src={instagram}
        className='size-5  p-1 rounded-full bg-[#b003c7]'
        alt='facebook'
      />
    </div>
  );
};

export default CommentPostedTo;
