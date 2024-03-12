import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";
import axios from "axios";

const UploadAssets = ({ close }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    close();
  }, []);

  const handleFileChange = (event) => {
    const fileInput = event.target;
    const files = fileInput.files;
  
    if (files.length > 0) {
      const file = files[0];
      
      // Check if the file size is within the limit (5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setSuccess('File size exceeds the 5MB limit. Please choose a smaller file.')
        // Optionally, you can reset the file input to clear the selected file
        fileInput.value = null;
        return;
      }
  
      setSelectedFile(file);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
  
      axios
        .post(
          `${import.meta.env.VITE_APP_BASEURL}/upload_image/`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((response) => {
          setError(null);
          setLoading(false);
          // Handle the server response as needed
          let data = response.data;
          setSuccess("Image Uploaded")
        })
        .catch((error) => {
          setLoading(false);
          setError("Please try again later");
          console.error("Error uploading image:", error);
        });
    }
  };

  return (
    <div className="bg-pens bg-cover bg-center h-[90vh] ">
      {loading && <Loading />}
        {error && <ErrorMessages>{error}</ErrorMessages>}
        {success && <SuccessMessages>{success}</SuccessMessages>}
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex flex-col items-center w-full h-full px-4">
          <div>
            <h1 className="text-xl md:text-3xl text-customBlue font-bold text-center pt-8 pb-4">
              Upload Assets
            </h1>
            <p className="">
              Upload your personal or favourite images you would like to use
              while making your posts.
            </p>
          </div>

          <form
            action=""
            className="w-full px-6 md:w-[70%] lg:w-[50%] flex flex-col justify-center items-center mt-12"
          >
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              required
              onChange={handleFileChange}
            />
            {preview && (
              <div className="mt-4 ">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Preview:
                </p>
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 max-w-full h-32 rounded-lg object-cover"
                />
              </div>
            )}
            <div className="mt-8">
              <button
                onClick={handleUpload}
                className="bg-customBlue cursor-pointer text-white py-2 px-12 rounded-lg"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAssets;
