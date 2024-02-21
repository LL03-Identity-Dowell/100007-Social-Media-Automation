import { useEffect, useState } from "react";
import UserWrapper from "../UserProfile/UserWrapper";
import PortfolioItem from "./_components/portfolio-item";
import axios from "axios";

import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";

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
    setLoading(true);
    setError("");
    setSuccess("");
    await axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.status !== 200) {
          setSuccess("Failed while fetching the portfolios");
          return;
        }
        setPortfolioList(res?.data?.portfolio_info_list);
        setSuccess("Successfully fetched the portoflios");
      })

      .catch(() => {
        setError("something, went wrong");
      });

    setLoading(false);
  };

  console.log(loading);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

    setLoading(true);
    axios
      .post(url, data, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.status !== 200) {
          console.log("Failed while saving the portfolios");
          setLoading(false);

          return;
        }

        setLoading(false);
        setSuccess(res?.data?.message);
      })
      .catch(() => {
        setError("something, went wrong");
        setLoading(false);
      });
  };

  return (
    <UserWrapper>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />}
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
