import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { imagesArray } from "./optionList";

const Carosuel = ({ image, setImage }) => {
  const settings = {
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <div className='slider-container'>
      <Slider {...settings}>
        {imagesArray.map((each) => (
          <img
            key={each.id}
            onClick={() => setImage(each.src)}
            src={each.src}
            alt={each.alt}
            className={`w-40 p-1 h-72 cursor-pointer ${
              image === each.src ? "opacity-80" : ""
            }`}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Carosuel;
