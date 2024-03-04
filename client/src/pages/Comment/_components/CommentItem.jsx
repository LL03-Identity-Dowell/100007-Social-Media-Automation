import { MdDelete } from 'react-icons/md';
import { getDate } from '../utils/getDate';
import CommentPostedTo from './CommentPostedTo';

const CommentItem = ({ t, handleDelete, src }) => {
  const date = getDate(t.created);

  return (
    <div className='w-4/5 p-2'>
      <div className='flex gap-x-4'>
        <img src={src} className='size-10 rounded-full mt-2 shrink-0' />
        <p className='line-clamp-3 shrink'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
          similique animi! Ab id placeat perspiciatis! Quis perferendis illum
          eum! Deleniti, alias. Atque, consequatur suscipit distinctio delectus
          ratione pariatur ad praesentium obcaecati tempore quod quibusdam, ex
          enim aperiam nostrum. Provident odit veritatis soluta quisquam unde
          quas minima nam aliquam placeat inventore.
        </p>
      </div>
      <div className='w-full flex justify-around ml-3 mt-6'>
        <p className='text-sm'>{date}</p>
        <hr className='w-0.5 h-6 bg-gray-400' />
        <button
          className='flex items-center gap-x-1 bg-red-600 rounded-md p-1 pr-2 cursor-pointer'
          onClick={() => handleDelete(t.commentId, t.platform)}>
          <MdDelete className='text-white' />
          <span className='text-xs text-white'>Delete</span>
        </button>
        <hr className='w-0.5 h-6 bg-gray-400' />
        <CommentPostedTo />
      </div>
    </div>
  );
};

export default CommentItem;
