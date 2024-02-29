import { useState } from "react";
import { createPortal } from "react-dom";

export const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);
  return createPortal(
    <>
      {showBanner && (
        <div className='absolute w-full py-2 text-center text-white top-[72px] left-0 md:left-32 bg-customLightblue flex items-center justify-around'>
          <p className='m-0 md:ml-40 ml-0 rounded-lg font-semibold text-balance'>
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
    </>,
    document.body
  );
};
