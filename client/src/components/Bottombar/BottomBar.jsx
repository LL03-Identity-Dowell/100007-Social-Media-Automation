import React from "react";
import { Link } from "react-router-dom";

const BottomBar = () => {
  return <div>
    

<div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#d3d3d3] border-t border-gray-200 ">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto font-medium ">
        <Link to="/topic" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 py-2 dark:hover:bg-gray-800 group">
        <div className="bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md">
            <img
            src='/public/user-check-solid.svg'
            className='w-[100%]'
            />

        </div>
            <span class="text-xs text-customGray dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Topic</span>
        </Link>

        <Link to="/article" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group">
        <div className="bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md">
        <img
          src='/public/file-signature-solid.svg'
          className='w-full'
          alt='article'
        />

        </div>
        
            <span class="text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500">Article</span>
        </Link>

        <Link to="/post-list" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group">
        <div className="bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md">
        <img
          src='/public/calendar-check-solid.svg'
          className='w-full'
        />

        </div>
        
            <span class="text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500">Post</span>
        </Link>
        
        <Link to="/unscheduled" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group">
        <div className="bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md">
        <img
          src='/public/calendar-days-solid.svg'
          className='w-full'
        />

        </div>
        
            <span class="text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500">Schedule</span>
        </Link>

        <Link to="/comment" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group">
        <div className="bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md">
        <img
          src='/public/comment-solid.svg'
          className='w-full'
        />

        </div>
        
            <span class="text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500">Comment</span>
        </Link>
    </div>
</div>

  </div>;
};

export default BottomBar;
