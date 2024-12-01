/* eslint-disable */
// @ts-nocheck

import "./App.css";
import Signup from "./pages/Signup/Signup";
import { useEffect, useState, useRef } from "react";

import { useUserStore } from "./store/user";
import Explore from "./pages/Explore/ChallengeExplore";
import { useNavigate } from "react-router-dom";




function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authRef = useRef(false);
  const handleAuthProcessCalledRef = useRef(false);
  const { setLoggedIn, loggedIn } = useUserStore();
  const navigate = useNavigate();

 

  return (
    <div className="w-screen h-safe flex flex-col justify-between bg-[#F8F8F8] overflow-hidden relative md:max-w-[380px]">
      {loggedIn ? <Explore /> : <Signup />}
    </div>
  );
}

export default App;
