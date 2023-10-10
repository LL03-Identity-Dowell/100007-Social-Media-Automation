import React from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

const Layout = ({ children, side, show, close }) => {
  return (
    <div className="w-full ">
      <Navbar />
      <div className={!side ? " grid w-full " : "grid grid-cols-10"}>
      <div className={ show && "col-span-1"}> 
        {side &&  <Sidebar /> }
      </div>

        <main className={
            !side ? "grid w-full" : "col-span-9 ml-10 lg:mx-12 py-8"  
          }
        >
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
