import { calendarDaysSolid, calendarSolid, fileSignatureSolid, userCheckSolid } from "../../assets";
import CustomLink from "./CustomLink";

const Sidebar = () => {
  return (
    <div className='fixed flex flex-col w-16 md:w-32 bg-[#d3d3d3] justify-start gap-8 h-[100vh] py-14 items-center font-bold text-[#333]'>
      <CustomLink title='Topic' to='/topic'>
        <img
          src={userCheckSolid}
          className='w-5 h-5 md:h-8 md:w-8'
          alt='topic'
        />
      </CustomLink>
      <CustomLink title='Article' to='/article'>
        <img
          src={fileSignatureSolid}
          className='w-5 h-5 md:h-8 md:w-8'
          alt='article'
        />
      </CustomLink>
      <CustomLink title='Post' to='/post-list'>
        <img
          src={calendarSolid}
          className='w-5 h-5 md:h-8 md:w-8'
          alt='post'
        />
      </CustomLink>
      <CustomLink title='Schedule' to='/unscheduled'>
        <img
          src={calendarDaysSolid}
          className='w-5 h-5 md:h-8 md:w-8'
          alt='schedule'
        />
      </CustomLink>
      <CustomLink title='Comment' to='/comment'>
        <img
          src={calendarSolid}
          className='w-5 h-5 md:h-8 md:w-8'
          alt='comment'
        />
      </CustomLink>
    </div>
  );
};

export default Sidebar;
