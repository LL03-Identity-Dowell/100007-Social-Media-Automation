import { getDate } from "../utils/getDate";

const CommentItem = ({ t, i, handleDelete }) => {
  const date = getDate(t.created);

  return (
    <li className='flex gap-6' key={t.commentId}>
      <h4 className='mt-1'>{i + 1}.</h4>
      <div>
        <p className='text-xl'>{t.comment}</p>
        <span className='text-sm'>{date}</span>
      </div>
      <button
        onClick={() => handleDelete(t.commentId, t.platform)}
        className='px-6 py-2.5 rounded-sm ml-auto text-sm font-bold text-red-600 bg-red-300 cursor-pointer'
      >
        Delete
      </button>
    </li>
  );
};

export default CommentItem;
