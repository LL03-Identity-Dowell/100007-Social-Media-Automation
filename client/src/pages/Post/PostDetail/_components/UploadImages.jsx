import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Loading from "../../../../components/Loading";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../../components/Messages";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom"

const UploadImages = ({ modal }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [images, setImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetch = () => {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_APP_BASEURL}/fetch_image/`, {
          withCredentials: true,
        })
        .then((response) => {
          setError(null);
          setLoading(false);
          let data = response.data;
          console.log(data);
          if (data.length <= 0) {
            setIsEmpty("You don't have any images to select from")
          }
          setImages(data);
          setSuccess(data.message);
        })
        .catch((error) => {
          setLoading(false);
          setError("Server error, Please try again later");
          console.error("Error fetching post:", error);
        });
    };
    fetch();
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const ITEMS_PER_PAGE = 6;
  const offset = currentPage * ITEMS_PER_PAGE;

  const displayedImages = [...images]
    .reverse()
    .slice(offset, offset + ITEMS_PER_PAGE);

  const handleDoneButtonClick = () => {
    setLoading(true);
    if (selectedImageIndex !== null) {
      localStorage.setItem(
        "uploadedImage",
        displayedImages[selectedImageIndex]
      );
      setSuccess("Image Added Successfully");
      setLoading(false);
      setTimeout(() => {
        modal();
      }, 1000);
    } else {
      console.log("No image selected.");
      setError("No image selected");
      setLoading(false);
    }
  };

  return (
    <div className="bg-overlay w-full h-[100vh] fixed inset-0 z-50 flex justify-center items-center">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      <span
        className="absolute  top-4 p-2 md:text-xl font-bold border-2 border-black rounded-full cursor-pointer right-4 md:right-20"
        onClick={modal}
      >
        <FaTimes />
      </span>
      <div className="bg-white h-[85%] w-[80%] relative rounded-lg p-4 md:p-8 overflow-x-auto ">
        <div className="flex justify-between items-center pb-4 md:mb-10 sticky top-0 bg-white">
          <p className=" font-semibold md:text-2xl">
            Select one image for your post
          </p>
          <button
            type="button"
            onClick={handleDoneButtonClick}
            className="bg-customBlue text-white px-6 py-1 cursor-pointer rounded-md"
          >
            Done
          </button>
        </div>
        <div>
          {
            isEmpty && (
              <div className="flex flex-col gap-4 justify-center items-center mt-6">

              <p className="text-center">{isEmpty} 
              </p>
              <Link to="/settings/upload-image" className="py-2 px-6 bg-customBlue text-white rounded-lg">Upload Image</Link>

              </div>
            )
          }
          
        </div>
        <div className="grid md:grid-cols-3 place-items-center justify-items-center gap-4 md:gap-6 2xl:gap-10">
          {displayedImages &&
            displayedImages.map((item, index) => (
              <div key={index} className="flex flex-row-reverse gap-2">
                <label htmlFor={index}>
                  <img
                    src={item}
                    alt={item}
                    loading="lazy"
                    className={`w-full md:w-[80%] h-[150px] 2xl:h-[200px] rounded-lg ${
                      selectedImageIndex === index
                        ? "border-4 border-customTextBlue"
                        : ""
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                </label>
                <input
                  type="radio"
                  id={index}
                  name="image"
                  checked={selectedImageIndex === index}
                  readOnly
                />
              </div>
            ))}
        </div>
        <div className="py-4 2xl:mt-10">
          <ReactPaginate
            pageCount={Math.ceil(images.length / ITEMS_PER_PAGE)}
            pageRangeDisplayed={5} // Adjust the number of pages to display in the pagination bar
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            previousLabel={currentPage === 0 ? null : "Previous"}
            nextLabel={
              currentPage === Math.ceil(images.length / ITEMS_PER_PAGE) - 0
                ? null
                : "Next"
            }
            containerClassName="flex justify-center items-center my-4 md:space-x-2 overflow-x-scroll md:overflow-auto"
            pageClassName="p-2 rounded-full cursor-pointer text-lg hover:bg-gray-300 w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center"
            previousClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
            nextClassName="p-2 rounded-full cursor-pointer hover:bg-gray-300"
            breakClassName="p-2"
            activeClassName="bg-customBlue w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex justify-center items-center text-white hover:bg-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadImages;
