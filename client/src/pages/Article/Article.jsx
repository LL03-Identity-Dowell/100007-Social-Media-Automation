/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const Article = (props) => {
  const { noOfArticles } = props;
  return (
    <div className="article-container pt-16 max-w-3xl">
      <div className="header text-center">
        <h2 className="text-5xl font-medium text-[#1434A4]">Article List</h2>
      </div>
      <div className="count-article flex justify-between py-4">
        {/* <p className="text-sm">Total posts count: {noOfArticles}</p> */}
        <p className="text-base">Total posts count: 5</p>
        <button className="create-article">Create Article</button>
      </div>
      <div className="articles">
        <p className="article-header"></p>
        <div className="content-button flex">
          <p className="content"></p>
          <button className="view-content-btn">View Article</button>
        </div>
      </div>
    </div>
  );
};

export default Article;
