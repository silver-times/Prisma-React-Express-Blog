import React from "react";
import userImage from "../assets/images/user.png";

const User = ({ user }) => {
  return (
    <div className="p-4 transform transition duration-200 hover:scale-110 cursor-pointer">
      <div className="rounded overflow-hidden shadow-xl bg-[#AAE1FF] border-solid border border-sky-200">
        <img className="w-full" src={userImage} alt="Mountain" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{user.name}</div>
          {/* <p className="text-gray-700 text-base">{user.content}</p> */}
        </div>
      </div>
    </div>
  );
};

export default User;
