import CustomLink from "./CustomLink";

const Sidebar = () => {
  return (
    <div className='flex flex-col w-16 md:w-32 bg-[#d3d3d3] justify-around h-[90vh] py-14 items-center font-bold text-[#333]'>
      <CustomLink title='Topic' to='/topic'>
        <img
          src='user-check-solid.svg'
          className='w-5 h-5 md:h-8 md:w-8'
          alt=''
        />
      </CustomLink>
      <CustomLink title='Article' to='/article'>
        <img
          src='file-signature-solid.svg'
          className='w-5 h-5 md:h-8 md:w-8'
          alt=''
        />
      </CustomLink>
      <CustomLink title='Post' to='/post'>
        <img
          src='calendar-check-solid.svg'
          className='w-5 h-5 md:h-8 md:w-8'
          alt=''
        />
      </CustomLink>
      <CustomLink title='Schedule' to='/schedule'>
        <img
          src='calendar-days-solid.svg'
          className='w-5 h-5 md:h-8 md:w-8'
          alt=''
        />
      </CustomLink>
      <CustomLink title='Comment' to='/comment'>
        <img src='comment-solid.svg' className='w-5 h-5 md:h-8 md:w-8' alt='' />
      </CustomLink>
    </div>
  );

};

export default Sidebar;
