/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/button";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

const Article = (props) => {
  const { noOfArticles, show } = props;

  useEffect(() => {
    show();
  }, []);

  return (
    <div className="relative h-[90vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      <div className="text-center text-customTextBlue font-semibold py-2 lg:py-6">
        <h2 className="text-3xl md:text-4xl ">Article List</h2>
      </div>

      <div className="count-article flex justify-between pt-0 pb-2 items-center">
        <p className="px-6 py-3 italic">Total posts count: 5</p>

        <div className="lg:w-[140px] lg:pt-2">
          <ExtraSmallBtn title={"Create Article"} />
        </div>
      </div>

      <div>
        <div className="overflow-y-scroll lg:overflow-y-auto h-[70vh] lg:h-auto grid gap-6 lg:gap-10 pb-10">
          <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <div className="articles">
              <div className="article">
                <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                  The Consumer Behaviour was selling designer clothings, shoes
                  and bags information.
                </p>

                <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                  <p className="lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                    The consumer behaviour in the designer clothing, shoe and
                    bag industry is changing. Companies are now focusing on
                    understanding the needs and wants of their customers and
                    creating experiences that will keep them coming back.
                    Technology is being used to better understand customer
                    preferences and target their marketing efforts. Companies …
                  </p>

                  <div className="lg:w-[350px] lg:pt-2">
                    <Link to="/SpecificArticle">
                      <ExtraSmallBtn title={"View Article"} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="article">
                <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                  The Consumer Behaviour was selling designer clothings, shoes
                  and bags information.
                </p>

                <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                  <p className="lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                    The consumer behaviour in the designer clothing, shoe and
                    bag industry is changing. Companies are now focusing on
                    understanding the needs and wants of their customers and
                    creating experiences that will keep them coming back.
                    Technology is being used to better understand customer
                    preferences and target their marketing efforts. Companies …
                  </p>

                  <div className="lg:w-[350px] lg:pt-2">
                    <Link to="/SpecificArticle">
                      <ExtraSmallBtn title={"View Article"} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="article">
                <p className="lg:px-6 px-2 py-0 text-md lg:text-xl text-customTextBlue  dark:text-white font-bold">
                  The Consumer Behaviour was selling designer clothings, shoes
                  and bags information.
                </p>

                <div className="content-button flex flex-col md:flex-row justify-between items-baseline py-0">
                  <p className="lg:px-6 lg:py-4 px-2 text-md lg:text-lg">
                    The consumer behaviour in the designer clothing, shoe and
                    bag industry is changing. Companies are now focusing on
                    understanding the needs and wants of their customers and
                    creating experiences that will keep them coming back.
                    Technology is being used to better understand customer
                    preferences and target their marketing efforts. Companies …
                  </p>

                  <div className="lg:w-[350px] lg:pt-2">
                    <Link to="/SpecificArticle">
                      <ExtraSmallBtn title={"View Article"} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
