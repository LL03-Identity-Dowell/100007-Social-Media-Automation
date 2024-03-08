import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { UnstyledButton } from "../../../components/UnstyledBtn";
import Loading from "../../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../../components/Messages";

import { useLocation, useNavigate } from "react-router-dom";
import {
  QualitativeCategorizationList,
  TargetCategory,
  TargetForListOptions,
} from "./_components/optionList";
import Dropdown from "./_components/dropdown";
import Counts from "./_components/counts";
import { handleCharacCount } from "./_components/function";
import { FaEdit, FaTimes } from "react-icons/fa";
import HashtagAndMentions from "./_components/HashtagAndMentions";
import { Banner } from "./_components/banner";

function PostDetail({ show }) {
  const [isProductKey, setIsProductKey] = useState();
  const [editing, setEditing] = useState(false);
  const [isEdited, setisEdited] = useState(false);
  const [postId, setPostId] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [postDetailData, setPostDetailData] = useState();
  const [designedFor, setDesignedFor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditedData, setIsEditedData] = useState("");
  const [selectedImage, setSelectedImage] = useState(postDetailData?.image);
  const [hashAndMention, sethashAndMention] = useState(false);
  const [checkPermission, setCheckPermission] = useState(false);

  const [title, setTitle] = useState(postDetailData?.post?.title);
  const [paragraph, setParagraph] = useState(postDetailData?.post?.paragraph);

  const [inputs, setInputs] = useState({
    qualitative_categorization: "Category",
    targeted_for: "Apple-Technology",
    designed_for: "Twitter-uxlivinglab",
    targeted_category: "Brand",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const { characterCount, hashtagCount, wordCount } =
    handleCharacCount(paragraph);

  useEffect(() => {
    show();
    fetch();
  }, []);

  const handleMessage = (event) => {
    // Check the origin of the sender to ensure it's trusted
    if (event.origin === "https://ll04-finance-dowell.github.io") {
      // console.log("Received message from external application:", event.data);
      const editedData = event.data;
      setIsEditedData(editedData);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [!editing]);

  useEffect(() => {
    const productKey = localStorage.getItem("productKey");
    setIsProductKey(productKey);
  }, []);

  // handle input change
  const handelChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const data = {
    qualitative_categorization: inputs.qualitative_categorization,
    targeted_for: inputs.targeted_for,
    designed_for: inputs.designed_for,
    targeted_category: inputs.targeted_category,
    title: isEditedData.title ? isEditedData.title : title || postDetailData?.post?.title || "",
    paragraphs: isEditedData.paragraph ? isEditedData.paragraph :
      paragraph || postDetailData
        ? postDetailData.post.paragraph[0].replace(/\n\n/, "")
        : "",
    source: postDetailData ? postDetailData.post.source : "",
    image: isEditedData.image ? isEditedData.image : selectedImage || postDetailData ? postDetailData.images : "",
  };
  
  //handle next button

  const handleSubmit = (e) => {
    // e.preventDefault();
    console.log(data);
    if (isProductKey) {
      navigate("/");
    }
    setLoading(true);

    // Make a POST request to the API endpoint with the session_id
    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/save_post/`, data, {
        withCredentials: true,
      })
      .then((response) => {
        setError(null);
        setLoading(false);
        let resData = response.data;
        console.log(resData.message);
        setSuccess(resData.message);
        setTimeout(() => {
          navigate("/unscheduled");
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        setError("Server error, Please try again later");
        console.error("Error submitting post:", error);
      });
  };

  const fetch = () => {
    setLoading(true);

    if (location.state && location.state.data) {
      const { post_id, title, paragraph, article, source } =
        location.state.data;

      let payload = {
        post_id: post_id,
        title: title,
        paragraph: paragraph || article,
        source: source,
      };

      // console.log({ payload });

      // Make a POST request to the API endpoint with the session_id
      axios
        .post(`${import.meta.env.VITE_APP_BASEURL}/post-detail/`, payload, {
          withCredentials: true,
        })
        .then((response) => {
          setError(null);
          setLoading(false);
          let data = response.data;
          setSuccess(data.message);
          setDesignedFor(data.linked_accounts);
          setPostDetailData(data);

          let isPostId = data.post._id;
          setPostId(isPostId);
          let paragraph = data.post.paragraph[0];
          // console.log(paragraph)
          paragraph = paragraph.split("\n\n");
          setParagraph(paragraph);
          setTitle(data.post.title);
          // console.log(paragraph)
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.data.success === false) {
            setSuccess(error.response.data.message);
          }
          setError("Server error, Please try again later");
          console.error("Error fetching post:", error);
        });
    } else {
      setError("Cannot retrieve post details");
      setTimeout(() => {
        navigate("/post-list");
      }, 4000);
    }
  };

  const image_data = {
    image: selectedImage || (postDetailData ? postDetailData.images : ""),
  };

  const handelPopup = () => {
    axios
      .get(
        `${import.meta.env.VITE_APP_BASEURL}/edit_post/${postId}/?image=${
          image_data.image
        }`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setError(null);
        setLoading(false);
        // console.log(response);
        let resData = response.data.redirect_url;
        setIframeSrc(resData);
      })
      .catch((error) => {
        setLoading(false);
        setError("Please try again later");
        console.error("Error Editing post:", error);
      });

    setEditing(!editing);
  };

  const handleNavigation = () => {
    sethashAndMention(!hashAndMention);
    // if (!editing) {
    //   navigate("/scheduled");
    // } else {
    //   setError("You have a unsaved document. Please save it.");
    // }
  };

  const handelCheckPermission = () => {
    setCheckPermission(!checkPermission);
  };

  return (
    <div className="relative">
        <div className="">
         <Banner />
      </div>
      <div className="m-4 mb-8 lg:m-8">
        {loading && <Loading />}
        {error && <ErrorMessages>{error}</ErrorMessages>}
        {success && <SuccessMessages>{success}</SuccessMessages>}

        <div className="flex items-center justify-between mt-2 mb-2 text-lg font-bold md:mb-0">
          <h2 className={isEditedData.title ? "hidden" : "block"}>
            {postDetailData && postDetailData.post.title}
          </h2>
          <h2 className={isEditedData.title ? "block" : "hidden"}>
            {isEditedData.title && isEditedData.title}
          </h2>
           

          <span
            onClick={handelPopup}
            className="cursor-pointer text-[15px] flex gap-2 items-center bg-gray-400 hover:bg-customTextBlue text-white  py-1 px-4 rounded-lg"
          >
            {" "}
            <FaEdit />
            Edit
          </span>
        </div>

        <hr className="my-4" />

        <div className={isEditedData.paragraph ? "hidden" : "mt-4 md:mt-8 block"}>
          {postDetailData &&
            paragraph.map((p, index) => (
              <div className="text-base" key={index}>
                {index >= 0 && p}
              </div>
            ))}
        </div>
        <div className={isEditedData.paragraph ? "block mt-4 md:mt-8" : " hidden"}>
          {isEditedData.paragraph &&
           isEditedData.paragraph}
        </div>

        <hr className="my-4" />

        <div id="post-sources" className="mt-4 md:mt-8">
          <Link
            to="https://openai.com"
            className="text-blue-500 post-source hover:underline"
          >
            {postDetailData && postDetailData.post.source}
          </Link>
        </div>

        <hr className="my-4" />

        <div className="flex flex-col lg:flex-row md:flex-row md:gap-20 lg:gap-24">
          <div className="relative">
            <img
              src={postDetailData && postDetailData.images}
              alt=""
              className={isEditedData.image ? "hidden" : "md:w-[500px] w-full h-full img-fluid post-img block"}
            />
            <img
              src={isEditedData.image && isEditedData.image}
              alt=""
              className={isEditedData.image ? "block md:w-[500px] w-full h-full img-fluid post-img" : " hidden"}
            />
          </div>

          <div className="flex flex-col gap-6 mt-5 post-options">
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <label
                htmlFor="content"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <strong>Qualitative categorization:</strong>
              </label>
              <select
                value={inputs.qualitative_categorization}
                name="qualitative_categorization"
                onChange={handelChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={postDetailData?.qualitative_categorization}>
                  {postDetailData?.qualitative_categorization}
                </option>
                <QualitativeCategorizationList />
              </select>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <strong>Targeted for:</strong>
              </label>
              <select
                value={inputs.targeted_for}
                id="brand"
                onChange={handelChange}
                name="targeted_for"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={postDetailData?.targeted_for}>
                  {postDetailData?.targeted_for}
                </option>
                <TargetForListOptions />
              </select>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8">
              <label
                htmlFor="channel"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <strong>Designed for:</strong>
              </label>
              <select
                value={inputs.designed_for}
                id="channel"
                onChange={handelChange}
                name="designed_for"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {designedFor.length > 0 ? (
                  designedFor?.map((socialMedia, index) => (
                    <option value={socialMedia} key={index}>
                      {socialMedia}
                    </option>
                  ))
                ) : (
                  <option>No social media channels is linked</option>
                )}
              </select>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <strong>Targeted category:</strong>
              </label>
              <select
                id="channelbrand"
                value={inputs.targeted_category}
                onChange={handelChange}
                name="targeted_category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={postDetailData?.targeted_category}>
                  {postDetailData?.targeted_category}
                </option>
                <TargetCategory />
              </select>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <Counts
          characCount={characterCount}
          hashCount={hashtagCount}
          wordCount={wordCount}
        />

        <div className="flex justify-center gap-20 mt-8">
          <UnstyledButton
            text="Back"
            className="text-base font-semibold bg-customBlue w-[128px] hover:bg-blue- text-center"
          />
          <UnstyledButton
            text="Next"
            className="text-base font-semibold bg-customBlue w-[128px] hover:bg-blue- text-center"
            onClick={handelCheckPermission}
          />
        </div>

        {/* Editing Modal Starts */}
        <div
          className={
            editing
              ? "fixed z-40 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 transformrounded-xl w-full flex justify-center items-center h-full bg-overlay"
              : "hidden"
          }
        >
          <div className=" bg-white w-full h-full 2xl:h-[750px] md:w-[900px] md:h-[600px]  text-black relative">
            <span
              className="absolute top-0 p-2 text-xl font-bold border border-black rounded-full cursor-pointer -right-12"
              onClick={handelPopup}
            >
              <FaTimes />
            </span>
            <iframe src={iframeSrc} width="100%" height="100%" />
          </div>
        </div>
        {/* Editing Modal Ends */}

        {checkPermission && (
          <div
            className={` bg-overlay w-full h-full fixed z-50 top-0 left-0 flex justify-center items-center `}
          >
            <div className="bg-white md:w-[50%]  2xl:w-[40%] p-6 rounded-lg relative flex flex-col justify-center items-center">
              <span
                className="absolute p-2 text-xs border-2 border-gray-900 rounded-full cursor-pointer md:text-xl md:top-0 md:-right-12 right-4 top-2"
                onClick={handelCheckPermission}
              >
                <FaTimes />
              </span>
              <div className="pt-8">
                <h3 className="text-lg font-semibold">
                  Do you want to add hashtags or mentions to this post?
                </h3>
              </div>
              <div className="flex gap-4 mt-6 w-[300px]">
                <button
                  onClick={() => {
                    handleSubmit();
                    handelCheckPermission();
                  }}
                  className="w-full py-2 mt-4 text-center text-white rounded-lg cursor-pointer bg-customDarkpuprle hover:bg-customTextBlue"
                >
                  No, Save
                </button>
                <button
                  onClick={() => {
                    handleNavigation();
                    handelCheckPermission();
                  }}
                  className="w-full py-2 mt-4 text-center text-white rounded-lg cursor-pointer bg-customBlue hover:bg-customTextBlue"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {hashAndMention && (
          <HashtagAndMentions
            onclick={handleNavigation}
            // onsubmit={handleSubmit}
            data={data}
          />
        )}
      </div>
    </div>
  );
}

export default PostDetail;
