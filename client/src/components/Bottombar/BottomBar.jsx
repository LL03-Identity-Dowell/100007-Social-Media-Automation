import { Link } from "react-router-dom";
import { calendarDaysSolid, calendarSolid, fileSignatureSolid, userCheckSolid } from "../../assets";

const BottomBar = () => {
  return (
    <div>
      <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-[#d3d3d3] border-t border-gray-200 '>
        <div className='grid h-full max-w-lg grid-cols-5 mx-auto font-medium '>
          <Link
            to='/topic'
            className='inline-flex flex-col items-center justify-center px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 group'
          >
            <div className='bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md'>
              <img src={userCheckSolid} className='w-[100%]' />
            </div>
            <span className='text-xs text-customGray dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'>
              Topic
            </span>
          </Link>

          <Link
            to='/article'
            className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group'
          >
            <div className='bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md'>
              <img
                src={fileSignatureSolid}
                className='w-full'
                alt='article'
              />
            </div>

            <span className='text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500'>
              Article
            </span>
          </Link>

          <Link
            to='/post-list'
            className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group'
          >
            <div className='bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md'>
              <img src={calendarSolid} className='w-full' />
            </div>

            <span className='text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500'>
              Post
            </span>
          </Link>

          <Link
            to='/unscheduled'
            className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group'
          >
            <div className='bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md'>
              <img src={calendarDaysSolid} className='w-full' />
            </div>

            <span className='text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500'>
              Schedule
            </span>
          </Link>

          <Link
            to='/comment'
            className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group'
          >
            <div className='bg-customDarkpuprle w-[30px] p-2 flex justify-center items-center rounded-md'>
              <img src={calendarSolid} className='w-full' />
            </div>

            <span className='text-xs text-customGray group-hover:text-blue-600 dark:group-hover:text-blue-500'>
              Comment
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
