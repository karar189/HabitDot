import axios from "axios";

import { BackendURL } from "../constants/url.ts";


const getToken = () => {
  return (
    localStorage.getItem("authToken") || localStorage.getItem("accessToken")
  );
};

// Existing API functions
const getOngoingChallenges = async (body: {
  status: string;
  limit: number;
  offset: number;
}) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  body.status = "UPCOMING";
  try {
    const response = await axios.post(`${BackendURL}/challenge/filter`, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};


const getChallengeDetails = async (status: number) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  try {
    const response = await axios.get(`${BackendURL}/challenge/${status}`, {
      headers,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error;
  }
};



export {
  getOngoingChallenges,
  getChallengeDetails,

};
