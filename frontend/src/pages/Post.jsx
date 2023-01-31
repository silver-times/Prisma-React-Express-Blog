import React, { useState, useEffect } from "react";
import Axios from "axios";
import Posts from "../components/Posts";

const Post = () => {
  const [posts, setPosts] = useState();

  const getUsers = async () => {
    const response = await Axios.get("http://localhost:5000/posts");
    // console.log(response.data);
    setPosts(response.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold uppercase flex justify-center items-center mb-10 pb-4">
        Posts
      </h1>
      {posts && <Posts key={Math.random()} posts={posts} />}
    </div>
  );
};

export default Post;
