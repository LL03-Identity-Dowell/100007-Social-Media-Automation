import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { LadyPixel, step1, step2, step3, step4, step5 } from "../../assets";

const Home = ({ close }) => {
  useEffect(() => {
    close()
  }, [])
  return (
    <div className="w-[100vw] h-[90vh]">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="w-full px-2 py-8 text-center xl:px-6">
          <h1 className="text-2xl xl:text-[30px] font-semibold text-customBlue">Automate Your Social Media with Samanta</h1>
          <p className="text-customDarkpuprle font-semibold text-[18px] md:text-[20px] py-4 xl:py-6">Easily Manage all your Social and get Efficient Results</p>

          <div >
            <p className="text-[#6b2722] font-semibold italic text-[18px] md:text-[22px]">Step by Step</p>
            <p className="text-customGray font-semibold text-[18px] md:text-[22px] pb-6">Ordering Process</p>
          </div>

          <div className="flex justify-between xl:gap-10">
            <Link to="/topic">
              <img src={step1} alt="Topic" className="" title='Topic' />
            </Link>
            <Link to="/article">
              <img src={step2} alt="article" className="" title='Articles' />
            </Link>
            <Link to="/post-list">
              <img src={step3} alt="post" className="" title='Post' />
            </Link>
            <Link to="/scheduled">
              <img src={step4} alt="schedule" className="" title='Schedule' />
            </Link>
            <Link to="/comment">
              <img src={step5} alt="comment" className="" title='Comment' />
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={LadyPixel} alt="ladyPixel" className="w-[200px] md:w-[300px] xl:w-[500px] xl:mt-6" />
        </div>
      </div>
    </div>
  );
};

export default Home;
