/* eslint-disable */
// @ts-nocheck
import { useState, useEffect } from "react";
import { getOngoingChallenges } from "../utils/api/challengeApi";
import { Challenge } from "../types/types";

const useChallenges = (bodyParams?: any) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(`Fetching challenges with status: ${status}...`);
        const response = await getOngoingChallenges({
          status: "UPCOMING",
          limit: 10,
          offset: (bodyParams?.page ?? 0) * 10,
        });
        // console.log("Challenges response:", response);
        if (response.data.length === 0 || response.data.length < 10) {
          bodyParams.setMoreChallengesButton(false);
        }
        if (response.success) setChallenges([...challenges, ...response.data]);
      } catch (error) {
        // console.error("Failed to fetch challenges:", error);
        setError("Failed to fetch challenges: " + error);
      }
    };

    fetchData();
  }, [bodyParams.page]);

  return { challenges, error };
};

export default useChallenges;
