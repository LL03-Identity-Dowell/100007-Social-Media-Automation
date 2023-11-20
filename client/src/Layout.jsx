import React, { useEffect } from "react";
import {initFlowbite} from "flowbite"
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

const Layout = ({ children, side, show, isProduct, isUser }) => {

    useEffect(()=>{
      initFlowbite()
    }, [])
    
  return (
    <div className="w-full ">
      {isProduct && <Navbar user={isUser}/>}
      <div className={!side ? " grid w-full " : "grid grid-cols-10 2xl:grid-cols-12"}>
      <div className={ show && "col-span-1"}> 
        {side &&  <Sidebar /> }
      </div>

        <main className={
            !side ? "grid w-full" : "col-span-9 py-8 2xl:col-span-11 ml-8 md:ml-16 lg:ml-0 "  
          }
        >
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
