import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const SuccessMessages = ({ children }) => {

  useEffect(() => {
    toast.info(children, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }, [])

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export const ErrorMessages = ({ children }) => {
  useEffect(() => {
    toast.error(children, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }, [])

  return (
    <div>
      <ToastContainer />
    </div>
  );
};
