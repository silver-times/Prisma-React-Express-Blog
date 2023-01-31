import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Users from "./pages/Users";
import Nav from "./components/Nav";

const App = () => {
  return (
    <div className="h-screen p-10 text-[#0f0f0f] ">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;
