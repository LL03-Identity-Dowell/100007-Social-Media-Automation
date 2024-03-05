import { MdDelete } from 'react-icons/md';
import { getDate } from '../utils/getDate';
import CommentPostedTo from './CommentPostedTo';

const CommentItem = ({ t, handleDelete, src }) => {
  const date = getDate(t.created);

  return (
    <>
      <div className='w-4/5 p-2'>
        <div className='flex gap-x-4'>
          <img src={src} className='size-10 rounded-full mt-2 shrink-0' />
          <p className='line-clamp-3 shrink text-black/85 text-[15px] mt-1'>
            {t?.comment}
          </p>
        </div>
        <div className='w-full flex justify-around mt-[-10px] ml-[-2px]'>
          <p className='text-[13px]'>{date}</p>
          <hr className='w-0.5 h-6 bg-gray-400' />
          <button
            className='flex items-center gap-x-1 bg-red-600 rounded-md p-1 pr-2 cursor-pointer'
            onClick={() => handleDelete(t?.commentId, t?.platform)}>
            <MdDelete className='text-white' />
            <span className='text-xs text-white'>Delete</span>
          </button>
          <hr className='w-0.5 h-6 bg-gray-400' />
          <CommentPostedTo />
        </div>
      </div>
      <ol className='w-1/5 flex justify-center flex-col pl-8 bg-customTextBlue rounded-lg h-32'>
        <li className=' text-white/80 text-sm'>
          Followers{' '}
          <span className='ml-2'>
            {t?.replyTo?.publicMetrics?.followersCount}
          </span>
        </li>
        <li className=' text-white/80 text-sm'>
          Following{' '}
          <span className='ml-2'>
            {t?.replyTo?.publicMetrics?.followingCount}
          </span>
        </li>
        <li className=' text-white/80 text-sm'>
          Tweets{' '}
          <span className='ml-2'>{t?.replyTo?.publicMetrics?.tweetCount}</span>
        </li>
        <li className=' text-white/80 text-sm'>
          Listed{' '}
          <span className='ml-2'>{t?.replyTo?.publicMetrics?.listedCount}</span>
        </li>
        <li className=' text-white/80 text-sm'>
          Likes{' '}
          <span className='ml-2'>{t?.replyTo?.publicMetrics?.likeCount}</span>
        </li>
      </ol>
    </>
  );
};

export default CommentItem;
