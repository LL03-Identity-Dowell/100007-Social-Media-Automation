import React from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

const Layout = ({ children, side }) => {
    // const [showSidebar, setShowSidebar] = useState(false);
    
  return (
    <div className="grid">
      <Navbar />
      <div className="grid grid-cols-6">
      
        {side && <div className="col-span-1"> <Sidebar /></div> }

      <main className="grid col-start-2 col-end-7">
        {children}
      </main>
      </div>
    </div>
  );
};

export default Layout;
