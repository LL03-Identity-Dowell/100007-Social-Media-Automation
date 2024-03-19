import { useState } from "react";

export const Banner = () => {

  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="w-full overflow-hidden md:mt-[-30px]">
      {showBanner && (
        <div className=' w-full py-2 text-center text-white  bg-customLightblue flex items-center justify-around'>
          <p className=' rounded-lg font-semibold text-balance'>
            Tailor your post to a maximum 250 character(s) for Pinterest and
            X/Twitter
          </p>
          <button
            className='cursor-pointer underline text-white mr-4'
            onClick={() => setShowBanner(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>

  );
};
