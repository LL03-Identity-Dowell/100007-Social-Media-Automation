import React, { useEffect, useState } from "react";
import { profile } from "../../assets";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ClientProfile = ({ close }) => {
  const [userName, setUserName] = useState();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userInfo"));
    setUserName(user?.userinfo?.username);
    close();
    fetch();
  }, []);

  const [getStatus, setGetStatus] = useState();
  const [formData, setFormData] = React.useState({
    address: "",
    business: "",
    product: "",
    logo: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const url = `${import.meta.env.VITE_APP_BASEURL}/client-form/`;

    if (formData && getStatus === "update") {
      axios
        .put(url, formData, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Response data:", response);
          toast.success(response?.data?.message);
          setFormData({ address: "", business: "", product: "", logo: "" });
        })
        .catch((error) => {
        setLoading(false);
          toast.error("Oops! An error occurred");
          console.error("Error:", error);
        });
    } else if (getStatus === "insert") {
      axios
        .post(url, formData, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Response data:", response);
          toast.success(response?.data?.message);
          setFormData({ address: "", business: "", product: "", logo: "" });
        })
        .catch((error) => {
        setLoading(false);
          toast.error("Oops! An error occurred");
          console.error("Error:", error);
        });
    }
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFormData((prev) => {
      return {
        ...prev,
        logo: base64,
      };
    });
  };

  const fetch = () => {
    // Make a GET request to the API endpoint with the session_id
    axios
      .get("http://127.0.0.1:8000/api/v1/client-form/", {
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

  return (
    <div className='bg-pens bg-cover bg-center h-[90vh] '>
      <ToastContainer />
      <div className='bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400'>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='flex flex-col items-center justify-center'>
            <img
              src={profile}
              alt='profile'
              className='rounded-full w-[40px] h-[40px] '
            />
            <h2 className='py-2 text-3xl font-semibold text-customBlue'>
              {userName}
            </h2>
          </div>
          <form action='' className='w-full px-6 md:w-[70%] lg:w-[50%]'>
            <div className='flex flex-col items-center justify-center gap-4 mt-6 md:mt-8 '>
              <div className='flex flex-col w-full '>
                <label htmlFor='address'>Address</label>
                <input
                  type='text'
                  className='w-full mt-2 bg-white border border-gray-300 rounded '
                  placeholder='Enter YourAddress..'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className='flex flex-col w-full '>
                <label htmlFor='address'>Business</label>
                <input
                  type='text'
                  className='w-full mt-2 bg-white border border-gray-300 rounded '
                  placeholder='Enter YourAddress..'
                  name='business'
                  value={formData.business}
                  onChange={handleChange}
                />
              </div>
              <div className='flex flex-col w-full '>
                <label htmlFor='address'>Product</label>
                <input
                  type='text'
                  className='w-full mt-2 bg-white border border-gray-300 rounded '
                  placeholder='Enter YourAddress..'
                  name='product'
                  value={formData.product}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='mt-4'>
              <input
                onChange={onUpload}
                type='file'
                id='profile'
                name='logo'
                className='rounded-xs text-md text-customTextBlue'
              />
              {/* <button className="px-6 py-2 text-white rounded text-md bg-customTextBlue">
                {" "}
                Upload Logo
              </button> */}
            </div>
            <div className='flex justify-center pb-10 mt-6'>
              <button
                className='px-6 py-2 text-white rounded text-md bg-customBlue'
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
