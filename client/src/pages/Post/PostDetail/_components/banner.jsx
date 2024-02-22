import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // This effect runs after the component mounts, so it ensures that the DOM is ready before using createPortal
    const bannerRoot = document.createElement("div");
    document.body.appendChild(bannerRoot);

    return () => {
      document.body.removeChild(bannerRoot);
    };
  }, []); // Empty dependency array to run this effect only once, similar to componentDidMount

  return createPortal(
    <>
      {showBanner && (
        <div className='absolute w-full py-2 text-center text-white top-[72px] left-16 md:left-32 bg-customLightblue flex items-center justify-center'>
          <p className='m-0 rounded-lg font-semibold'>
            Tailor your post to a maximum 250 character(s) for Pinterest and
            X/Twitter
          </p>
          <button
            className='absolute cursor-pointer top-1.5 left-[84%] underline text-white '
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
