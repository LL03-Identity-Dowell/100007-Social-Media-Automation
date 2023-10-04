import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return <div>
    <Link to="/">
      <div>Topic</div>
    </Link>
    <Link to="/article">
      <div>Article</div>
    </Link>
    <Link to="/post">
      <div>Post</div>
    </Link>
    <Link to="/schedule">
      <div>Schedule</div>
    </Link>
    <Link to="/comment">
      <div>Comment</div>
    </Link>
  </div>;
};

export default Sidebar;
