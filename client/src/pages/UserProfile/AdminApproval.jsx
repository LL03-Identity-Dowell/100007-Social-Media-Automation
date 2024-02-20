import React, { useEffect } from "react";

const AdminApproval = ({ close }) => {
  useEffect(() => {
    close();
  }, []);

  return (
    <div className="bg-pens bg-cover bg-center">
      {/* {loading && <Loading />}
    {success && <SuccessMessages>{success}</SuccessMessages>}
    {error && <ErrorMessages>{error}</ErrorMessages>} */}
      <div className="bg-overlay w-full lg:max-w-5xl mx-auto px-4 my-6 h-[85vh] shadow-lg shadow-gray-400 ">
        <div className="flex flex-col items-center  w-full h-full">
          <div className="pt-10">
            <h2 className="text-2xl font-bold text-customBlue xl:text-4xl ">
              Approval Admin Page
            </h2>
          </div>
          <form className="text-left mt-4 w-full grid gap-2 text-customBlue">
            <label htmlFor="">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              Testing
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              Testing
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              Testing
            </label>
            <div className="flex flex-col gap-3 md:flex-row mt-4 md:justify-between ">
              <button className="py-2 px-6 md:w-full bg-customBlue rounded-lg text-white text-center text-[15px]">Approve Selected</button>
              <button className="py-2 px-6 md:w-full bg-red-600 rounded-lg text-white text-center text-[15px]">Reject Selected</button>
              <button className="py-2 px-6 md:w-full bg-customTextBlue rounded-lg text-white text-center text-[15px]">Approve All</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;
