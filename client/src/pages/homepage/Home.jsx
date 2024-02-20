import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LadyPixel, step1, step2, step3, step4, step5 } from "../../assets";
import Loading from "../../components/Loading";

const Home = ({ close }) => {
  const [isProductKey, setIsProductKey] = useState();

  useEffect(() => {
    close();
  }, []);

  useEffect(() => {
    const productKey = localStorage.getItem("productKey");
    setIsProductKey(productKey);
  }, []);

  return (
    <div className="w-[100vw] h-[90vh]">
      {/* {loading && <Loading />} */}
      <div className="flex flex-col justify-between md:flex-row">
        <div className="w-full px-2 py-8 text-center xl:px-6">
          <h1 className="text-2xl xl:text-[30px] font-semibold text-customBlue">
            Automate Your Social Media with Samanta
          </h1>
          <p className="text-customDarkpuprle font-semibold text-[18px] md:text-[20px] py-4 xl:py-6">
            Easily Manage all your Social and get Efficient Results
          </p>

          <div>
            <p className="text-[#6b2722] font-semibold italic text-[18px] md:text-[22px]">
              Step by Step
            </p>
            <p className="text-customGray font-semibold text-[18px] md:text-[22px] pb-6">
              Ordering Process
            </p>
          </div>

          <div className="flex justify-between xl:gap-10">
            {isProductKey ? (
              <img src={step1} alt="Topic" className="" />
            ) : (
              <Link
                className="tooltip first-tooltip"
                to="/topic"
                data-tooltip="Click here to start generating new topics for your content. Fill
                in the required details to generate accurate and meaningful
                topics. Once the form is complete, submit your information for
                topics to be generated. Review the generated topics, rank them
                based on relevance or importance, submit, and proceed to the
                next step."
              >
                <img src={step1} alt="Topic" className="" />
              </Link>
            )}

            {isProductKey ? (
              <img src={step2} alt="article" className="" />
            ) : (
              <Link
                to="/article"
                className="tooltip"
                data-tooltip=" Choose an Option: 1. AIWriter, 2. Wikipedia, 3. Manual(Text area
                is provided for you to manually enter the contents of your
                article), to generate an article based on the topic selected.
                Once the article has been created, you can proceed to the next
                step."
              >
                <img src={step2} alt="article" className="" />
              </Link>
            )}

            {isProductKey ? (
              <img src={step3} alt="post-list" className="" />
            ) : (
              <Link
                to="/post-list"
                className="tooltip"
                data-tooltip='The article will be broken down into paragraphs based on its
                structure. Click on "View Post" to view the post with the
                attached image. You can also choose to edit the image and post
                content by clicking on "Edit" button. Finally, click on "Next"
                to save the content of the post and proceed to the Next step'
              >
                <img src={step3} alt="post" className="" />
              </Link>
            )}

            {isProductKey ? (
              <img src={step4} alt="unscheduled" className="" />
            ) : (
              <Link
                to="/unscheduled"
                className="tooltip"
                data-tooltip=' Select the social media channels to send the post from the
                previous step to. Send the post immediately to the selected
                social media channels.The page then redirects to Most Recent
                page if the process is successful. "Schedule" Choose the time
                and date to schedule the post. The page then redirects to the
                Schedule page if the process is successful.'
              >
                <img src={step4} alt="schedule" className="" title=" " />
              </Link>
            )}

            {isProductKey ? (
              <img src={step5} alt="comment" className="" />
            ) : (
              <Link
                to="/comment"
                className="tooltip"
                data-tooltip=" Share your thoughts on a post and manage all the comments in a
                given post. You have the option to post a comment based on the
                post or delete a comment under the post."
              >
                <img src={step5} alt="comment" className="" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={LadyPixel}
            alt="ladyPixel"
            className="w-[200px] md:w-[300px] xl:w-[500px] xl:mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
