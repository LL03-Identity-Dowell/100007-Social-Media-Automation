import React from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

const Layout = ({ children, side, show, close }) => {
  // const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="w-full ">
      <Navbar />
      <div className={!side ? " grid w-full " : "grid grid-cols-6"}>
      <div className={ show && "col-span-1"}> 
        {side &&  <Sidebar /> }
      </div>

        <main className={
            !side ? "grid w-full" : "col-span-5"  
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
