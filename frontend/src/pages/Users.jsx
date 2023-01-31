import React, { useState, useEffect } from "react";
import Axios from "axios";
import Users from "../components/Users";

const Post = () => {
  const [users, setUsers] = useState();

  const getUsers = async () => {
    const response = await Axios.get("http://localhost:5000/users");
    // console.log(response.data);
    setUsers(response.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-extrabold uppercase flex justify-center items-center mb-10 pb-4">
        Users
      </h1>
      {users && <Users key={Math.random()} users={users} />}
    </div>
  );
};

export default Post;
