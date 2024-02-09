import { useEffect, useState } from "react";
import UserWrapper from "../UserProfile/UserWrapper";
import PortfolioItem from "./_components/portfolio-item";
import axios from "axios";

const url = `${import.meta.env.VITE_APP_BASEURL}/social-media-portfolio/`;

const Portfolio = () => {
  const [portfolioList, setPortfolioList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    await axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.status !== 200) {
          console.log("Got some error");
          return;
        }
        setPortfolioList(res?.data?.portfolio_info_list);
        setSuccess("Successfully fetched portfolios");
      })
      .catch((error) => {
        console.log("error", error);
        setError("something, went wrong");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formElement = document.querySelector("#portoflio-form ul");
    const ulElement = formElement.querySelectorAll("li");
    const nonEmptyLiElements = Array.from(ulElement).filter(
      (li) => li?.id?.trim() !== ""
    );
    let data = [];
    nonEmptyLiElements.forEach((each) => {
      const checkedValues = Array.from(
        each.querySelectorAll("input[type=checkbox]:checked")
      ).map((checkbox) => checkbox.value);

      const elName = each.querySelector("h3").textContent;

      const port = {
        portfolio_name: elName,
        portfolio_code: each.id,
        channels: checkedValues,
      };
      data.push(port);
    });

    axios
      .post(url, data, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <UserWrapper>
      <div className='flex items-center justify-center h-full text-center'>
        <form id='portoflio-form' onSubmit={handleSubmit}>
          <ul className='mb-4 space-y-8 overflow-y-auto max-h-[460px] px-14'>
            {portfolioList.map((portfolio) => (
              <PortfolioItem
                name={portfolio.portfolio_name}
                id={portfolio.portfolio_code}
                key={portfolio.portfolio_code}
                channels={portfolio.channels}
              />
            ))}
          </ul>
          <button
            type='submit'
            className='px-2 py-2 text-center text-white rounded-md w-36 bg-customBlue hover:opacity-90'
          >
            Submit
          </button>
        </form>
      </div>
    </UserWrapper>
  );
};

export default Portfolio;
