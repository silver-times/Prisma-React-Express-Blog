import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl">
        <Link to={"/"}>🚀Blog</Link>
      </h1>
      <div className="flex gap-20 mr-2 text-2xl">
        <h1>
          <Link to={"/"}>Home</Link>
        </h1>
        <h1>
          <Link to={"/posts"}>Posts</Link>
        </h1>
        <h1>
          <Link to={"/users"}>Users</Link>
        </h1>
      </div>
    </div>
  );
};

export default Nav;
