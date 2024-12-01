/* eslint-disable */
// @ts-nocheck

import React from "react";
import { useNavigate } from "react-router-dom";
import useUserDetails from "../hooks/useUserDetails";
import placeholder from "/assets/images/placeholder.webp";
import x from "/assets/images/X.webp";
import { useUserStore } from "../store/user";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  noti: number;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, noti }) => {
  // console.log(noti)
  const { userDetails } = useUserDetails();
  const { loggedIn } = useUserStore();
  const navigate = useNavigate();

  const profileImage = userDetails?.User?.ProfilePicture
    ? userDetails.User.ProfilePicture
    : placeholder;

  const shortenAddress = (address: string | undefined) => {
    if (!address) return "Connecting your wallet...";
    return `${address.substring(0, 8)}............${address.substring(
      address.length - 6
    )}`;
  };

  const handleLogout = async () => {
    await localStorage.clear();
    window.location.href = `/`;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`absolute top-0 left-0 bg-white h-full w-70 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col max-h-screen justify-between`}
      >
        <div className="flex flex-col p-5">
          <div className="flex flex-row justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-[#EDEDED] rounded-full h-14 w-14 flex items-center justify-center">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full h-12 w-12"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-[#2B303B] font-medium text-left">
                  {userDetails?.User?.UserName || "Hi User !"}
                </p>
                <p className="text-xs text-[#576175] text-left">
                  {shortenAddress(userDetails?.User?.WalletAddress)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border-[#F7F7F7]"
            >
              <img src={x} alt="Close" />
            </button>
          </div>

          {loggedIn ? (
            <>
              <div className="h-0.5 bg-[#EEEEEE] my-6" />
              <button
                className="relative text-left bg-transparent border-none cursor-pointer"
                style={{
                  flexDirection: "row",
                }}
                onClick={() => navigate("/notification")}
              >
                <div className="font-runs text-lg mb-4">
                  Notifications
                  <div>
                    {noti > 0 ? (
                      <span className="absolute top-3 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 mr-5 bg-red-500 rounded-full">
                        {noti >= 10 ? "10+" : noti}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
              <button
                onClick={() => navigate("/myChallenges")}
                className="text-left"
              >
                <p className="font-runs text-[17px] mb-4">My Challenges</p>
              </button>
            </>
          ) : (
            ""
          )}

          <div className="h-0.5 bg-[#EEEEEE] my-2" />

          <a
            href="https://catoff.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#576175] my-2 text-left"
          >
            Help
          </a>
          <a
            href="https://forms.gle/rsy9Aw6LVGNVSGaa8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#576175] my-2 text-left"
          >
            Have a feedback?
          </a>
          <a
            href="https://www.catoff.xyz/TermsAndServices.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#576175] my-2 text-left"
          >
            Terms & Conditions
          </a>
          <a
            href="https://www.catoff.xyz/PrivacyPolicy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#576175] my-2 text-left"
          >
            Privacy Policy
          </a>
        </div>

        <div className="p-5">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-[#EEEEEE] rounded-full w-full h-[50px] font-bold"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="bg-[#EEEEEE] rounded-full w-full h-[50px] font-bold"
            >
              Login
            </button>
          )}

          <p className="text-xs text-[#576175] mt-2 text-center">
            Catoff Gaming LLC, ©2024. All rights reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default Drawer;
