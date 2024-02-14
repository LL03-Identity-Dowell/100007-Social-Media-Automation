import axios from "axios";
import React, { useEffect, useState } from "react";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";
// import CSRFToken from "../../components/CSRFToken";

const ApprovalByClient = ({close}) => {
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
  const [changedCheckboxes, setChangedCheckboxes] = useState([]);

  const initialCheckboxStates = {
    topic: false,
    article: false,
    post: false,
    schedule: false,
  };

  useEffect(() => {
    close();
  }, []);

  useEffect(() => {
    try {
      const savedState = JSON.parse(localStorage.getItem("approvalData")) || {};
      setApprovals((prevApprovals) => ({
        ...prevApprovals,
        topic: savedState.topic || false,
        article: savedState.article || false,
        post: savedState.post || false,
        schedule: savedState.schedule || false,
      }));

      initialCheckboxStates.topic = savedState.topic || false;
      initialCheckboxStates.article = savedState.article || false;
      initialCheckboxStates.post = savedState.post || false;
      initialCheckboxStates.schedule = savedState.schedule || false;

      const fetch = () => {
        // Make a GET request to the API endpoint with the session_id
        axios
          .get(`${import.meta.env.VITE_APP_BASEURL}/user-approval/`, {
            withCredentials: true,
          })
          .then((response) => {
            let data = response.data.status;
            setGetStatus(data);
            console.log(data);
          })
          .catch((error) => {
            setError("Server error, Please try again later");
            console.error("Error fetching user-approval:", error);
          });
      };
      fetch();
    } catch (error) {
      // Handle parsing or fetch errors here.
      console.error("An error occurred:", error);
    }
  }, []);

  const handelChange = (e) => {
    let checkedName = e.target.name;
    let checked = e.target.checked;

    setIsChecked(checkedName);
    setApprovals({
      ...approvals,
      [checkedName]: checked,
    });

    if (initialCheckboxStates[checkedName] !== checked) {
      setChangedCheckboxes((prevChangedCheckboxes) => [
        ...prevChangedCheckboxes,
        checkedName,
      ]);
    }
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
      setLoading(true);
      axios
        .put(`${import.meta.env.VITE_APP_BASEURL}/user-approval/`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false);
          // setSuccess(`${isChecked} is Approved...!`);
          let data = response.data;
          setSuccess(
            changedCheckboxes.length > 0
              ? `${changedCheckboxes.join(", ")} approved...!`
              : `${data.message}`
          );

          // console.log(data);
          let resData = JSON.stringify(data);
          localStorage.setItem("approvalData", resData);
        })
        .catch((error) => {
        setLoading(false);
          setError("Error making request, Please try again later");
          console.error("Error fetching user-approval:", error);
        });
    } else if (getStatus === "insert") {
      setLoading(true);
      axios
        .post(`${import.meta.env.VITE_APP_BASEURL}/user-approval/`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setLoading(false);
          // setSuccess(`${isChecked} Approved...!`);
          setSuccess(
            changedCheckboxes.length > 0
              ? `${changedCheckboxes.join(", ")} approved...!`
              : "Done...!"
          );

          let data = response.data.status;
          console.log(data);
        })
        .catch((error) => {
        setLoading(false);
          setError("Error making request, Please try again later");
          console.error("Error fetching user-approval:", error);
        });
    }
  };

  return (
    <div className='bg-pens bg-cover bg-center h-[95vh]'>
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className='bg-overlay w-full lg:max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400 '>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='pt-20 md:pt-20'>
            <h2 className='text-2xl font-bold text-customBlue xl:text-4xl '>
              Approvals
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col items-start justify-center mt-2 md:mt-8 md:gap-10'>
              <div className='flex gap-6 lg:gap-10 xs:flex-col md:flex-row'>
                <h2 className='text-customBlue text-xl font-bold w-[250px]'>
                  Do you want to approve Topic?
                </h2>
                <div className='flex flex-col items-end w-20'>
                  {/* <CSRFToken/> */}
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      onChange={handelChange}
                      type='checkbox'
                      checked={approvals.topic}
                      name='topic'
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className='flex gap-6 lg:gap-10 xs:flex-col md:flex-row'>
                <h2 className='text-customBlue text-xl font-bold w-[250px]'>
                  Do you want to approve Article?
                </h2>
                <div className='flex flex-col items-end w-20 '>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      onChange={handelChange}
                      type='checkbox'
                      checked={approvals.article}
                      name='article'
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className='flex gap-6 lg:gap-10 xs:flex-col md:flex-row'>
                <h2 className='text-customBlue text-xl font-bold w-[250px]'>
                  Do you want to approve Post?
                </h2>
                <div className='flex flex-col items-end w-20 '>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      onChange={handelChange}
                      type='checkbox'
                      checked={approvals.post}
                      name='post'
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className='flex gap-6 lg:gap-10 xs:flex-col md:flex-row'>
                <h2 className='text-customBlue text-xl font-bold w-[250px]'>
                  Do you want to approve Schedule?
                </h2>
                <div className='flex flex-col items-end w-20 '>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      onChange={handelChange}
                      type='checkbox'
                      checked={approvals.schedule}
                      name='schedule'
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-white border border-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className='pb-20 mt-8 text-center'>
              <button className='px-6 py-2 text-white rounded text-md bg-customBlue'>
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
