/* eslint-disable */
// @ts-nocheck
import axios from "axios";
import { BackendURL } from "../constants/url.ts";

const getToken = () => {
  return (
    localStorage.getItem("authToken") || localStorage.getItem("accessToken")
  );
};



const refreshServer = async () => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
  };
  try {
    const response = await axios.post(
      `${BackendURL}/auth/refresh`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error in refresh server:", error);
    return error;
  }
};


// 🔴 LOGGING IN FLOW
const getRefreshTokenAPI = async () => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  try {
    const response = await axios.post(
      `${BackendURL}/oktoProxy/refreshToken`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error in get refresh token API:", error);
    return error;
  }
};

// 🔴 LOGGING OUT FLOW
const logout = async () => {
  // Logout implementation
};

export {
  getRefreshTokenAPI,
  refreshServer,
 
};
