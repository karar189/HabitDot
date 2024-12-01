import React from "react";
import Appbar from "./components/Appbar";

const Layout = ({ children, showAppbar = true }) => {
  return (
    <div className="min-h-screen w-screen flex flex-col justify-between ">
      <div className="flex-1 w-full md:max-w-[380px] md:mx-auto overflow-y-auto md:border-2 md:border-[#efefef50] md:min-h-screen">
        {children}
        {showAppbar && <Appbar />}
      </div>
    </div>
  );
};

export default Layout;
