import React from "react";
import Post from "./Post";

const Posts = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1  xl:grid-cols-4 gap-5">
      {posts.map((post) => (
        <Post post={post} key={Math.random()} />
      ))}
    </div>
  );
};

export default Posts;
