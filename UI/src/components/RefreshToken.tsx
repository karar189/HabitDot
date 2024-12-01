import { useEffect } from "react";
import { refreshServer } from "../utils/api/authApi";
import { useUserStore } from "../store/user";
import { setTokens } from "../utils/tokenUtils";
import { useRef } from "react";

const RefreshToken = () => {
  const { setLoggedIn } = useUserStore();
  const effectRan = useRef(false);

  const authTok = async () => {
    const output = await refreshServer();
    console.log(output)
    if (!output.success) {
      localStorage.clear();
      setLoggedIn(false);
    } else {
      setTokens(output.data);
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry");
      if (refreshTokenExpiry && !localStorage.getItem("runn")) {
        localStorage.setItem("runn", "true");
        const now = new Date();
        const expiryDate = new Date(refreshTokenExpiry);
        console.log("happening here");
        if (expiryDate > now) {
          authTok();
          setLoggedIn(true);
        }
        localStorage.removeItem("runn");
      }
      effectRan.current = true;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      authTok();
    }, 24 * 60 * 1000); // 4 minutes
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default RefreshToken;
