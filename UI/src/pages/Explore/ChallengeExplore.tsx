/* eslint-disable */
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  live,
  hamburger,
  notification,
  banner1,
  createSVG,
} from "../../assets/index";
import { ChallengeCard, Drawer } from "../../components/index";
import {
  useChallenges,
  useUserDetails,
} from "../../hooks";
import { useUserStore } from "../../store/user";

const Explore: React.FC = () => {
  const { loggedIn } = useUserStore();
  const [page, setPage] = useState(0);
  const [moreChallengesButton, setMoreChallengesButton] = useState(true);
  const { challenges } = useChallenges({
    page: page,
    setMoreChallengesButton: setMoreChallengesButton,
  });
  const { userDetails } = useUserDetails();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const sortedChallenges = challenges?.sort((a, b) => {
    return new Date(b?.createdAt) - new Date(a?.createdAt);
  });

  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* <CreateButton createSVG={createSVG} /> */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
       
      />
      <div className="flex flex-row justify-between items-center mt-4 mx-6">
        <h1 className="text-[20px] font-TTRunsTrialMedium font-bold">
          HABITDOT
        </h1>
        <div className="flex flex-row items-center">
          {loggedIn ? (
            <>
              <button
                className="relative ml-2 rounded-full border-[#F7F7F7]"
                onClick={() => navigate("/notification")}
              >
                <img src={notification} alt="Menu" height={20} width={20} />
                {notifications.filter((notification) => !notification.IsRead)
                  .length > 0 ? (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                ) : null}
              </button>
            </>
          ) : null}
          <button
            className="ml-2 rounded-full border-[#F7F7F7]"
            onClick={toggleDrawer}
          >
            <img src={hamburger} alt="Menu" />
          </button>
        </div>
      </div>
      <div className="h-40 my-4 mx-2 rounded-lg flex relative">
        <img src={banner1} alt="banner" className="w-full" />
      </div>
     
      <div>
        {sortedChallenges?.map((challenge) => (
          <ChallengeCard challenge={challenge} key={challenge?.ChallengeID} />
        ))}
        {sortedChallenges.length > 0 && moreChallengesButton && (
          <button
            className="border bg-blue-400 rounded-xl font-semibold text-white p-2 mb-32"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Show More Challenges 🔥
          </button>
        )}
        {!moreChallengesButton && (
          <h1 className="my-10">No More Challenges Present!</h1>
        )}
      </div>
    </div>
  );
};

export default Explore;
