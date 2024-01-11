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
import CarosuelModal from "./_components/carosuel-modal";
import { handleCharacCount } from "./_components/function";
import { FaEdit, FaTimes } from "react-icons/fa";

function PostDetail({ show }) {
  const [editing, setEditing] = useState(false);
  const [postId, setPostId] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [postDetailData, setPostDetailData] = useState();
  const [designedFor, setDesignedFor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(postDetailData?.image);

  const [title, setTitle] = useState(postDetailData?.post?.title);
  const [paragraph, setParagraph] = useState(postDetailData?.post?.paragraph);

  const [inputs, setInputs] = useState({
    qualitative_categorization: "Category",
    targeted_for: "Apple-Technology",
    designed_for: "Twitter-uxlivinglab",
    targeted_category: "Brand",
  });

  // const iframeSrc =
  //   "https://ll04-finance-dowell.github.io/100058-DowellEditor-V2/?token=eyJhbGciOiJIUzI1NiJ9.eyJwcm9kdWN0X25hbWUiOiJTb2NpYWwgTWVkaWEgQXV0b21hdGlvbiIsImRldGFpbHMiOnsiX2lkIjoiNjU3ODVmNWIzNWRhZDQzMjZlMDRiMGRjIiwiZGF0YWJhc2UiOiJzb2NpYWxtZWRpYSIsImNvbGxlY3Rpb24iOiJzdGVwM19kYXRhIiwidGVhbV9tZW1iZXJfSUQiOiIzNDU2Nzg5Nzc5OSIsImZ1bmN0aW9uX0lEIjoiQUJDREUiLCJjbHVzdGVyIjoic29jaWFsbWVkaWEiLCJkb2N1bWVudCI6InN0ZXAzX2RhdGEiLCJjb21tYW5kIjoiZmV0Y2giLCJ1cGRhdGVfZmllbGQiOnsib3JkZXJfbm9zIjoyMX19fQ.QTlwdOv7y1E6YcAe7hjyVLF9k2vNx_vdheoshLS3sOU";

 

  const location = useLocation();
  const navigate = useNavigate();

  const { characterCount, hashtagCount, wordCount } =
    handleCharacCount(paragraph);

  useEffect(() => {
    show();

    fetch();
  }, []);

  // handle input change
  const handelChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  //handle next button
  const handleSubmit = () => {
    // e.preventDefault();
    setLoading(true);

    const data = {
      qualitative_categorization: inputs.qualitative_categorization,
      targeted_for: inputs.targeted_for,
      designed_for: inputs.designed_for,
      targeted_category: inputs.targeted_category,
      title: title || postDetailData?.post?.title || "",
      paragraphs:
        paragraph || postDetailData
          ? postDetailData.post.paragraph[0].replace(/\n\n/, "")
          : "",
      source: postDetailData ? postDetailData.post.source : "",
      image: selectedImage || postDetailData ? postDetailData.images : "",
    };
    // Make a POST request to the API endpoint with the session_id
    axios
      .post(`http://127.0.0.1:8000/api/v1/save_post/`, data, {
        withCredentials: true,
      })
      .then((response) => {
        setError(null);
        setLoading(false);
        let resData = response.data;

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
          // console.log(data);
          setPostDetailData(data);
          
          let isPostId = data.post._id;
          setPostId(isPostId)
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

  const handelPopup = ()=>{
    axios
    .get(`http://127.0.0.1:8000/api/v1/edit_post/${postId}/`, {
      withCredentials: true,
    })
    .then((response) => {
      setError(null);
      setLoading(false);
      console.log(response);
      let resData = response.data.redirect_url;
      setIframeSrc(resData)

      
    })
    .catch((error) => {
      setLoading(false);
      setError("Please try again later");
      console.error("Error Editing post:", error);
    });

    setEditing(!editing)
  }

  const handleNavigation = () => {
    if (!editing) {
      navigate("/scheduled");
    } else {
      setError("You have a unsaved document. Please save it.");
    }
  };

  return (
    <div className="m-4 mb-8 lg:m-8">
      {loading && <Loading />}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {/* <div className="flex flex-row-reverse">
        <Dropdown
          editPost={handelPopup}
          savePost={() => setEditing(false)}
          handleSubmit={handleSubmit}
        />
      </div> */}


      <div className="mt-2 mb-2 text-lg font-bold md:mb-0 flex justify-between items-center">
       
          <h2>
            {postDetailData && postDetailData.post.title}
            {/* The team was adviced by the cyber security experts. */}
          </h2>
        
        <span onClick={handelPopup} className="cursor-pointer text-[15px] flex gap-2 items-center bg-gray-400 hover:bg-customTextBlue text-white  py-1 px-4 rounded-lg"> <FaEdit/>Edit</span>

      </div>

      <hr className="my-4" />

      <div className="mt-4 md:mt-8">
        {
          postDetailData &&
          paragraph.map((p, index) => (

            <div className="text-base" key={index}>
              {index >= 0 && p}
            </div>
          ))
         }

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
            alt="Random image"
            className="w-full h-full img-fluid post-img"
          />
          {editing && <CarosuelModal setSelectedImage={setSelectedImage} />}
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
              {designedFor &&
                designedFor.map((socialMedia, index) => (
                  <option value={socialMedia} key={index}>
                    {socialMedia}
                  </option>
                ))}
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
          onClick={handleNavigation}
        />
      </div>

      {/* Editing Modal Starts */}
      <div className={editing ? "fixed z-40 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 transformrounded-xl w-full flex justify-center items-center h-full bg-overlay" : "hidden"}>
        <div className=" bg-white w-full h-full 2xl:h-[900px] md:w-[900px] md:h-[600px]  text-black relative">
        <span className="font-bold text-xl p-2 border border-black rounded-full absolute -right-12 cursor-pointer top-0" onClick={handelPopup}><FaTimes/></span>
        <iframe src={iframeSrc} width="100%" height="100%"/>

        </div>
      </div>
      {/* Editing Modal Ends */}
    </div>
  );
}

export default PostDetail;
