import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return <div>
    <Link to="/">Step1</Link>
    <Link to="/step2">Step2</Link>
  </div>;
};

export default Sidebar;
