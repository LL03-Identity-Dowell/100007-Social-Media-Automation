/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "../../components/button";

const Article = (props) => {
  const { noOfArticles } = props;
  return (
    <div className="article-container pt-16 px-6 max-w-6xl">
      <div className="header text-center">
        <h2 className="text-5xl font-medium text-[#1434A4]">Article List</h2>
      </div>
      <div className="count-article flex justify-between pt-8 pb-6 items-center">
        {/* <p className="text-sm">Total posts count: {noOfArticles}</p> */}
        <p className="text-base">Total posts count: 5</p>
        <Button text="Create Article" />
      </div>
      <div className="articles">
        <div className="article">
          <p className="article-header text-[#1434A4] pb-2">
            The Consumer Behaviour was selling designer clothings, shoes and
            bags information.
          </p>
          <div className="content-button sm:flex-col md:flex md:flex-row justify-between items-baseline">
            <p className="sm:w-full sm:pb-4 md:w-[70%] lg:w-4/5">
              The consumer behaviour in the designer clothing, shoe and bag
              industry is changing. Companies are now focusing on understanding
              the needs and wants of their customers and creating experiences
              that will keep them coming back. Technology is being used to
              better understand customer preferences and target their marketing
              efforts. Companies …
            </p>
            <Button
              className="sm:w-full sm:mb-6 md:w-[128px]"
              text="View Article"
            />
          </div>
        </div>
        <div className="article">
          <p className="article-header text-[#1434A4] pb-2">
            The Consumer Behaviour was selling designer clothings, shoes and
            bags information.
          </p>
          <div className="content-button sm:flex-col md:flex md:flex-row justify-between items-baseline">
            <p className="sm:w-full sm:pb-4 md:w-[70%] lg:w-4/5">
              The consumer behaviour in the designer clothing, shoe and bag
              industry is changing. Companies are now focusing on understanding
              the needs and wants of their customers and creating experiences
              that will keep them coming back. Technology is being used to
              better understand customer preferences and target their marketing
              efforts. Companies …
            </p>
            <Button
              className="sm:w-full sm:mb-6 md:w-[128px]"
              text="View Article"
            />
          </div>
        </div>
        <div className="article">
          <p className="article-header text-[#1434A4] pb-2">
            The Consumer Behaviour was selling designer clothings, shoes and
            bags information.
          </p>
          <div className="content-button sm:flex-col md:flex md:flex-row justify-between items-baseline">
            <p className="sm:w-full sm:pb-4 md:w-[70%] lg:w-4/5">
              The consumer behaviour in the designer clothing, shoe and bag
              industry is changing. Companies are now focusing on understanding
              the needs and wants of their customers and creating experiences
              that will keep them coming back. Technology is being used to
              better understand customer preferences and target their marketing
              efforts. Companies …
            </p>
            <Button
              className="sm:w-full sm:mb-6 md:w-[128px]"
              text="View Article"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
