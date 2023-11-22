import React, { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateArticle = (props) => {
  const { show } = props;

  useEffect(() => {
    show();
    callGenerateArticleAPI();
  }, []);

  const callGenerateArticleAPI = () => {
    // Make an API request to GenerateArticleView

    axios
      .get("http://127.0.0.1:8000/api/v1/article/generate/", {
        withCredentials: true,
      })
      .then((response) => {
        // Handle the response here
        console.log(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const callGenerateArticleAI = () => {
    // Make an API request to GenerateArticleView

    const payload = {
      title: "Sample Research Topic",
      subject: "Technology",
      verb: "improves",
      target_industry: "Healthcare",
      qualitative_categorization: "Research Article",
      targeted_for: "Medical Professionals",
      designed_for: "Information Sharing",
      targeted_category: "Medical Technology",
      image: "https://example.com/sample-image.jpg",
    };
    axios
      .post("http://127.0.0.1:8000/api/v1/article/AI/", payload, {
        withCredentials: true,
      })
      .then((response) => {
        // Handle the response here
        console.log(response.data);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const callGenerateArticleWiki = () => {
    // Make an API request to GenerateArticleView

    const payload = {
      title: "social",
      subject: "Technology",
      verb: "improves",
      target_industry: "Healthcare",
      qualitative_categorization: "Research Article",
      targeted_for: "Medical Professionals",
      designed_for: "Information Sharing",
      targeted_category: "Medical Technology",
      image: "https://example.com/sample-image.jpg",
    };
    axios
      .post("http://127.0.0.1:8000/api/v1/article/wiki/", payload, {
        withCredentials: true,
      })
      .then((response) => {
        // Handle the response here
        console.log(response.data);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        toast.error(error?.message);
      });
  };

  const callGenerateArticleWriteYourself = () => {
    // Make an API request to GenerateArticleView

    const session_id = localStorage.getItem("session_id");
    const payload = {
      title: "title",
      subject: "subject",
      verb: "verb",
      target_industry: "target_industry",
    };
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/article/write_yourself/?session_id=${session_id}`,
        payload,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        // Handle the response here
        console.log(response.data);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        toast.error(error?.message);
      });
  };

  const tabledata = Array(10)
    .fill(" ")
    .map((item, index) => (
      <tr
        key="index"
        class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
      >
        <td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
        <td class="whitespace-nowrap px-6 py-4">
          The UX living Lab was testing digital documentation
        </td>
        <td class="whitespace-nowrap px-6 py-4">Noble Chinonso</td>
        <td class="whitespace-nowrap px-6 py-4">
          <button
            className="bg-[#999999] text-white text-xs mx-3 rounded p-2 w-auto"
            onClick={callGenerateArticleAI}
          >
            AiWriter
          </button>

          <button
            className="bg-[#0866FF] text-white text-xs mx-3 rounded p-2 w-auto"
            onClick={callGenerateArticleWiki}
          >
            Wikipedia
          </button>

          <button
            className="bg-[#333333] text-white text-xs mx-3 rounded p-2 w-auto"
            onClick={callGenerateArticleWriteYourself}
          >
            Write Yourself
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="flex flex-col justify-center items-center article-container pt-16 px-6 max-w-full">
      <ToastContainer />
      <h1 className="text-2xl font-semibold">Create An Article</h1>
      <p className="">Select a topic</p>
      <div class="flex flex-col max-w-6xl content-center">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class=" text-left text-sm font-light w-auto">
                <thead class="border-y font-medium dark:border-black">
                  <tr>
                    <th scope="col" class="text-lg px-6 py-4">
                      Rank
                    </th>
                    <th scope="col" class="text-lg px-6 py-4">
                      Sentense
                    </th>
                    <th scope="col" class="text-lg px-6 py-4">
                      Created By
                    </th>
                    <th scope="col" class="text-lg px-6 py-4">
                      Select Handle
                    </th>
                  </tr>
                </thead>
                <tbody>{tabledata}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;