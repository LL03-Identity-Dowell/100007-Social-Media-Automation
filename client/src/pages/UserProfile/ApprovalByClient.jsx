import axios from "axios";
import React, { useEffect, useState } from "react";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";
// import CSRFToken from "../../components/CSRFToken";

const ApprovalByClient = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [isChecked, setIsChecked] = useState();
  const [getStatus, setGetStatus] = useState();
  const [approvals, setApprovals] = useState({
    topic: false,
    article: false,
    post: false,
    schedule: false,
  });

  useEffect(() => {
    let savedState = JSON.parse(localStorage.getItem("approvalData"));
    setApprovals({
      topic: !savedState.topic ? false : true,
      article: !savedState.article ? false : true,
      post: !savedState.post ? false : true,
      schedule: !savedState.schedule ? false : true,
    });

    fetch();
  }, []);

  const fetch = () => {
    // Make a GET request to the API endpoint with the session_id
    axios
    .get("http://127.0.0.1:8000/api/v1/user-approval/", {
      withCredentials: true,
    })
    .then((response) => {
        let data = response.data.status;
        setGetStatus(data);
      })
      .catch((error) => {
        setError("Server error, Please try again later");
        console.error("Error fetching user-approval:", error);
      });
  };

  const handelChange = (e) => {
    let checkedName = e.target.name;
    let checked = e.target.checked;
    
    setIsChecked(checkedName);
    setApprovals({
      ...approvals,
      [checkedName]: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      topic: approvals.topic,
      article: approvals.article,
      post: approvals.post,
      schedule: approvals.schedule,
    };

    if (getStatus === "update") {
      setLoading(true)
      axios
        .put("http://127.0.0.1:8000/api/v1/user-approval/", data, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false)
          if (approvals.topic || approvals.article || approvals.post || approvals.schedule) {
            
            setSuccess(`${isChecked} is Approved...!`);
          }
          let data = response.data;
          // console.log(data);
          let resData = JSON.stringify(data);
          localStorage.setItem("approvalData", resData);
        })
        .catch((error) => {
          setError("Error making request, Please try again later");
          console.error("Error fetching user-approval:", error);
        });
    } else if (getStatus === "insert") {
      setLoading(true)
      axios
        .post("http://127.0.0.1:8000/api/v1/user-approval/", data, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false)
          setSuccess(`${isChecked} Approved...!`);
          let data = response.data.status;
          console.log(data);
        })
        .catch((error) => {
          setError("Error making request, Please try again later");
          console.error("Error fetching user-approval:", error);
        });
    }
  };

  return (
    <div className="bg-pens bg-cover bg-center h-[95vh]">
      {loading && <Loading/>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className="bg-overlay w-full lg:max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400 ">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div className="pt-20 md:pt-20">
            <h2 className="text-customBlue font-bold text-2xl xl:text-4xl ">
              Approvals
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-start mt-2 md:mt-8 flex-col md:gap-10">
              <div className="flex gap-6 lg:gap-10 xs:flex-col md:flex-row">
                <h2 className="text-customBlue text-xl font-bold w-[250px]">
                  Do you want to approve Topic?
                </h2>
                <div className="flex flex-col items-end w-20">
                  {/* <CSRFToken/> */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onChange={handelChange}
                      type="checkbox"
                      checked={approvals.topic}
                      name="topic"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-6 lg:gap-10 xs:flex-col md:flex-row">
                <h2 className="text-customBlue text-xl font-bold w-[250px]">
                  Do you want to approve Article?
                </h2>
                <div className=" flex flex-col items-end w-20">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onChange={handelChange}
                      type="checkbox"
                      checked={approvals.article}
                      name="article"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-6 lg:gap-10 xs:flex-col md:flex-row">
                <h2 className="text-customBlue text-xl font-bold w-[250px]">
                  Do you want to approve Post?
                </h2>
                <div className=" flex flex-col items-end w-20">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onChange={handelChange}
                      type="checkbox"
                      checked={approvals.post}
                      name="post"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-6 lg:gap-10 xs:flex-col md:flex-row">
                <h2 className="text-customBlue text-xl font-bold w-[250px]">
                  Do you want to approve Schedule?
                </h2>
                <div className=" flex flex-col items-end w-20">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onChange={handelChange}
                      type="checkbox"
                      checked={approvals.schedule}
                      name="schedule"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center pb-20">
              <button className="text-md text-white bg-customTextBlue py-2 px-6 rounded">
                {" "}
                Done
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApprovalByClient;
