import { useState, useEffect } from "react";
import { getChallengeDetails } from "../utils/api/challengeApi";


const useChallengeDetails = (id: number) => {
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Fetching challenge details...");
        const response = await getChallengeDetails(id);
        // console.log("Challenge response:", response);
        setChallenge(response.data);
      } catch (error) {
        // console.error("Failed to fetch challenge details:", error);
        setError("Failed to fetch challenge details: " + error);
      }
    };

    fetchData();
  }, [id]);

  return { challenge, error };
};

export default useChallengeDetails;
