import React from "react";
import User from "./User";

const Users = ({ users }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3  xl:grid-cols-6 gap-5">
      {users.map((user) => (
        <User user={user} key={Math.random()} />
      ))}
    </div>
  );
};

export default Users;
