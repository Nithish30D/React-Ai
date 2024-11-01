import React from "react";
import Logo from "../../assets/react.svg";

const NavBar = () => {
  return (
    <div className=" flex justify-between w-full px-20 py-3 bg-blue-900">
      <div className=" flex gap-2 items-center justify-center">
        <img src={Logo} alt="" />
        <h1 className=" text-lg font-bold text-blue-400">React-AI Bot</h1>
      </div>
      <div>
       
      </div>
    </div>
  );
};

export default NavBar
