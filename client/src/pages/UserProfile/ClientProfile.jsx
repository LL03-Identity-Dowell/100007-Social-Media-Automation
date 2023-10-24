import React, { useEffect } from "react";
import { profile } from "../../assets";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ClientProfile = ({ close }) => {
  useEffect(() => {
    close();
  }, []);

  const [formData, setFormData] = React.useState({
    address: "",
    business: "",
    product: "",
    logo: "logo",
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

    const url = "http://127.0.0.1:8000/api/v1/client-form/";

    if (formData) {
      axios
        .post(url, formData, formData, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Response data:", response);
          toast.success(response?.data?.message);
          setFormData({ address: "", business: "", product: "", logo: "logo" });
        })
        .catch((error) => {
          toast.error("Oops! An error occurred");
          console.error("Error:", error);
        });
    }
    console.log(JSON.stringify(formData));
  }

  return (
    <div className="bg-pens bg-cover bg-center h-[90vh] ">
      <ToastContainer />
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div className="flex flex-col justify-center items-center">
            <img
              src={profile}
              alt="profile"
              className="rounded-full w-[40px] h-[40px] "
            />
            <h2 className="text-customBlue text-3xl font-semibold py-2">
              UserName
            </h2>
          </div>
          <form action="" className="w-full px-6 md:w-[70%] lg:w-[50%]">
            <div className="flex justify-center flex-col gap-4 items-center mt-6 md:mt-8 ">
              <div className="flex flex-col w-full ">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="mt-2 w-full border border-gray-300 rounded bg-white "
                  placeholder="Enter YourAddress.."
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full ">
                <label htmlFor="address">Business</label>
                <input
                  type="text"
                  className="mt-2 w-full border border-gray-300 rounded bg-white "
                  placeholder="Enter YourAddress.."
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full ">
                <label htmlFor="address">Product</label>
                <input
                  type="text"
                  className="mt-2 w-full border border-gray-300 rounded bg-white "
                  placeholder="Enter YourAddress.."
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="text-md text-white bg-customTextBlue py-2 px-6 rounded">
                {" "}
                Upload Logo
              </button>
            </div>
            <div className="flex justify-center mt-6 pb-10">
              <button
                className="text-md text-white bg-customTextBlue py-2 px-6 rounded"
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
