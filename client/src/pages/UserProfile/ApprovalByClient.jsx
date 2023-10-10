import React from "react";

const ApprovalByClient = () => {
  return (
    <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
          <div>
            <h2 className="text-customBlue font-bold text-2xl xl:text-4xl pb-12">
              Approvals
            </h2>
          </div>

          <div className="flex justify-center items-start mt-6 md:mt-8 flex-col gap-10">

            <div className="flex gap-6 lg:gap-10">
              <h2 className="text-customBlue text-xl font-bold w-[250px]">
                Do you want to approve Topic?
              </h2>
              <div className="flex flex-col items-end w-20">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  />
                <div className="w-11 h-6 bg-white border border-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              </div>
            </div>

            <div className="flex gap-6 lg:gap-10">
              <h2 className="text-customBlue text-xl font-bold w-[250px]">
                Do you want to approve Article?
              </h2>
              <div className=" flex flex-col items-end w-20">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  />
                <div className="w-11 h-6 bg-white border border-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              </div>
            </div>

            <div className="flex gap-6 lg:gap-10">
              <h2 className="text-customBlue text-xl font-bold w-[250px]">
                Do you want to approve Post?
              </h2>
              <div className=" flex flex-col items-end w-20">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  />
                <div className="w-11 h-6 bg-white border border-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              </div>
            </div>

            <div className="flex gap-6 lg:gap-10">
              <h2 className="text-customBlue text-xl font-bold w-[250px]">
                Do you want to approve Schedule?
              </h2>
              <div className=" flex flex-col items-end w-20">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  />
                <div className="w-11 h-6 bg-white border border-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalByClient;
