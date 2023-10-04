import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <Link className='hover:text-blue-600' to='/website'>
        Topic
      </Link>
      <Link className='hover:text-blue-600' to='/articles'>
        Article
      </Link>
      <Link className='hover:text-blue-600' to='/posts'>
        Post
      </Link>
      <Link className='hover:text-blue-600' to='/schedule'>
        Schedule
      </Link>
      <Link className='hover:text-blue-600' to='/comment'>
        Comment
      </Link>
    </>
  );
};

export default Sidebar;
