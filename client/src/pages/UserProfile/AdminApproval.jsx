import axios from "axios";
import React, { useEffect, useState } from "react";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

const AdminApproval = ({ close }) => {
  const [requests, setRequests] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    close();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user && user.username !== "uxliveadmin") {
      
      navigate('/');
    }
    const fetchRequests = () => {
      axios
        .get(
          `${import.meta.env.VITE_APP_BASEURL}/social_media_channels/approve/`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setLoading(false);
          setRequests(response.data.social_media_requests);
          setSuccess("Requests Fetched Successfully")
        })
        .catch((error) => {
          setLoading(false);
          setError("Error fetching Social Media Channels");
          console.error("Error fetching Social Media Channels:", error);
        });
    };
    fetchRequests();
  }, []);

  const handleCheckboxChange = (id) => {
    // Toggle the selected state for the given id
    setSelectedUser((prevSelectedUser) => {
      if (prevSelectedUser.includes(id)) {
        return prevSelectedUser.filter((user) => user !== id);
      } else {
        return [...prevSelectedUser, id];
      }
    });
  };

  const handleApproveSelected = () => {
    console.log("Selected Users:", selectedUser);
    const data = {
      approve: "Approve Selected",
      social_media_request_id: selectedUser,
    };
    if (selectedUser) {
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_APP_BASEURL}/social_media_channels/approve/`,
          data,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setLoading(false);
          setSuccess(response.data.message);
          location.reload();
        })
        .catch((error) => {
          setLoading(false);
          setError("Error fetching Social Media Channels");
          console.error("Error fetching Social Media Channels:", error);
        });
    }
  };

  const handleApproveAll = () => {
    const selectedItemsData = requests.filter((item) =>
      selectedUser.includes(item.id)
    );

    // const data = {
    //   approve: "Approve Selected",
    //   social_media_request_id: selectedItemsData.id,
    // }
    const data = selectedItemsData.map((item) => ({
      approve: "Approve All",
      social_media_request_id: item.id,
    }));

    if (selectedItemsData) {
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_APP_BASEURL}/social_media_channels/approve/`,
          data,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setLoading(false);
          setSuccess(response.data.message);
          location.reload();
        })
        .catch((error) => {
          setLoading(false);
          setError("Error fetching Social Media Channels");
          console.error("Error fetching Social Media Channels:", error);
        });
    }
  };

  const handleRejected = () => {
    const selectedItemsData = requests.filter((item) =>
      selectedUser.includes(item.id)
    );

    const data = selectedItemsData.map((item) => ({
      approve: "Reject Selected",
      social_media_request_id: item.id,
    }));

    if (selectedItemsData) {
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_APP_BASEURL}/social_media_channels/approve/`,
          data,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setLoading(false);
          setSuccess(response.data.message);
          location.reload();
        })
        .catch((error) => {
          setLoading(false);
          setError("Error fetching Social Media Channels");
          console.error("Error fetching Social Media Channels:", error);
        });
    }
  };

  return (
    <div className="bg-pens bg-cover bg-center">
      {loading && <Loading />}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {error && <ErrorMessages>{error}</ErrorMessages>}
      <div className="bg-overlay w-full lg:max-w-5xl mx-auto px-4 my-6 h-[85vh] shadow-lg shadow-gray-400 ">
        <div className="flex flex-col items-center  w-full h-full">
          <div className="pt-10">
            <h2 className="text-2xl font-bold text-customBlue xl:text-4xl ">
              Approval Admin Page
            </h2>
          </div>
          {!requests && <p className="py-3">You do not have any requests</p>}
          <form className="text-left mt-4 w-full grid gap-2 text-customBlue">
            <div className="flex md:flex-row flex-col gap-2 md:gap-10 flex-wrap md:mt-6">
              {requests &&
                requests.map((item) => (
                  <label htmlFor="" key={item.username}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 mr-2 font-semibold text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    {item.username}
                  </label>
                ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row mt-4 md:mt-10 md:justify-between ">
              <button
                type="button"
                onClick={handleApproveSelected}
                className="py-2 px-6 md:w-full bg-customBlue rounded-lg text-white text-center text-[15px] cursor-pointer"
              >
                Approve Selected
              </button>
              <button
                type="button"
                onClick={handleRejected}
                className="py-2 px-6 md:w-full bg-red-600 rounded-lg text-white text-center text-[15px] cursor-pointer"
              >
                Reject Selected
              </button>
              <button
                type="button"
                onClick={handleApproveAll}
                className="py-2 px-6 md:w-full bg-customTextBlue rounded-lg text-white text-center text-[15px] cursor-pointer"
              >
                Approve All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;
