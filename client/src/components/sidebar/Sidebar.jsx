import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return <div className='h-[90vh] overflow-x-hidden flex flex-col text-[#333] font-bold bg-[#d3d3d3] justify-around py-14 items-center'>
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

  </div>
};

export default Sidebar;
