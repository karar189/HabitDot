/* eslint-disable */
// @ts-nocheck

const token =
  localStorage.getItem("authToken") || localStorage.getItem("accessToken");
console.log("Collected Token:", token);

import axios from "axios";
import { BackendURL } from "../constants/url.ts";
import { NotificationParams } from "../../types/api.dto.ts";
import { User } from "../../types/baseDBEntities.ts";

const getToken = () => {
  const authToken = localStorage.getItem("authToken");
  const accessToken = localStorage.getItem("accessToken");
  const token = authToken || accessToken;
  // console.log("Collected Token:", token);
  return token;
};

const getUserChallenges = async () => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  try {
    const response = await axios.get(
      `${BackendURL}/userBoard/dashboard/userCurrentTable`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getUserCreatedChallenges = async () => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  try {
    const response = await axios.get(
      `${BackendURL}/userBoard/dashboard/userChallenges`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getUserDetails = async () => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  try {
    const response = await axios.get(
      `${BackendURL}/userBoard/dashboard/userDetailsMobile`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getChallengeDashboard = async (challengeID: number) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  try {
    const response = await axios.get(
      `${BackendURL}/challenge/dashboard/${challengeID}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getLeaderboard = async (challengeID: number) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  try {
    const response = await axios.get(
      `${BackendURL}/challenge/leaderboard/${challengeID}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const postUserUpdate = async (userDetails) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const body = {
      name: userDetails.UserName,
      bio: userDetails.Bio,
      tag: userDetails.Tag,
    };

    const response = await axios.post(`${BackendURL}/user/update`, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

const postUploadImage = async (formData: FormData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("Authorization token not found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(
      `${BackendURL}/user/upload-image`,
      formData,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: (error as Error).message };
  }
};

const postUpdateCoverHex = async (coverHexCode) => {
  const token = getToken();
  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = {
    coverHexCode,
  };

  try {
    const response = await axios.post(
      `${BackendURL}/user/update-cover-hex`,
      body,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: error.message };
  }
};

const notificationRead = async ({ id }) => {
  const token = getToken();
  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      `${BackendURL}/notification/read`,
      {
        ids: id,
      },
      {
        headers: headers,
      }
    );

    console.log("Notification marked as read", response.data);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read", error);
    return error;
  }
};

const notification = async (data: NotificationParams) => {
  const token = getToken();
  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let queryParams = {
    limit: data.limit,
    page: data.page,
    includeRead: data.includeRead,
    user: true,
  };

  try {
    const response = await axios.get(`${BackendURL}/notification`, {
      headers: headers,
      params: queryParams,
    });

    // console.log("for notification", response.data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export {
  getUserChallenges,
  getUserCreatedChallenges,
  getUserDetails,
  notificationRead,
  postUpdateCoverHex,
  getChallengeDashboard,
  getLeaderboard,
  postUserUpdate,
  postUploadImage,
  notification,
};
