import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  HomeOutline,
  Basketball,
  BasketballOutline,
  PeopleCircle,
  PeopleCircleOutline,
  Create,
  CreateOutline,
  ThumbsUp,
  ThumbsUpOutline,
} from "react-ionicons";
import vote1 from "../../public/assets/images/vote.png";

const Appbar = () => {
  const getIconComponent = (route, isActive) => {
    const iconColor = isActive ? "#1F1F1F" : "#545454";
    switch (route) {
      case "/explore":
        return isActive ? (
          <Home color="#1F1F1F" />
        ) : (
          <HomeOutline color="#545454" />
        );
      case "/myChallenges":
        return isActive ? (
          <Basketball color="#1F1F1F" />
        ) : (
          <BasketballOutline color="#545454" />
        );
      case "/voteChallenge":
        return isActive ? (
          <ThumbsUp color={iconColor} />
        ) : (
          <ThumbsUpOutline color={iconColor} />
        );
      case "/create":
        return isActive ? (
          <Create color="#1F1F1F" />
        ) : (
          <CreateOutline color="#545454" />
        );
      case "/profile":
        return isActive ? (
          <PeopleCircle color="#1F1F1F" />
        ) : (
          <PeopleCircleOutline color="#545454" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-0 w-full h-[78px] bg-white text-white flex flex-row items-center justify-center md:max-w-[380px] mx-auto">
      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-[30%] gap-[3px] ${
            !isActive ? "text-[#545454]" : "text-[#1F1F1F]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {getIconComponent("/explore", isActive)}
            <div className="text-[12px]">Explore</div>
          </>
        )}
      </NavLink>
      {/* <NavLink
        to="/myChallenges"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-[30%] gap-[3px] ${!isActive ? 'text-[#545454]' : 'text-[#1F1F1F]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {getIconComponent('/myChallenges', isActive)}
            <div className="text-[12px]">My Challenges</div>
          </>
        )}
      </NavLink> */}
      <NavLink
        to="/voteChallenge"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-[30%] gap-[3px] ${
            !isActive ? "text-[#545454]" : "text-[#1F1F1F]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {getIconComponent("/voteChallenge", isActive)}
            <div className="text-[12px]">Vote feed</div>
          </>
        )}
      </NavLink>
      {/* <NavLink
        to="/create"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-[30%] gap-[3px] ${
            !isActive ? "text-[#545454]" : "text-[#1F1F1F]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {getIconComponent("/create", isActive)}
            <div className="text-[12px]">Create</div>
          </>
        )}
      </NavLink> */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-[30%] gap-[3px] ${
            !isActive ? "text-[#545454]" : "text-[#1F1F1F]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {getIconComponent("/profile", isActive)}
            <div className="text-[12px]">Profile</div>
          </>
        )}
      </NavLink>
    </div>
  );
};

export default Appbar;
