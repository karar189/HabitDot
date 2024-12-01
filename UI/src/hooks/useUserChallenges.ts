// Imports
import { useState, useEffect, useCallback } from "react";
import {
  getUserDetails,
  getUserChallenges,
  getUserCreatedChallenges,
} from "../utils/api/userApi";
import moment from "moment";
import { UserDetails, Challenge } from "../types/types";

// Custom Hook
const useUserChallenges = (status: string = "UPCOMING") => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [createdChallenges, setCreatedChallenges] = useState<Challenge[]>([]);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function: Fetch Details and Challenges
  const fetchDetailsAndChallenges = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch User Details
      const userDetails = await getUserDetails();
      console.log("User details response:", userDetails);
      if (userDetails.success) {
        setDetails(userDetails.data);
      } else {
        throw new Error("Failed to fetch user details: " + userDetails.message);
      }

      // Fetch User Challenges
      console.log("Fetching user challenges...");
      const userChallenges = await getUserChallenges();
      console.log("User challenges response:", userChallenges);
      if (userChallenges.success) {
        setChallenges(userChallenges.data);
      } else {
        throw new Error(
          "Failed to fetch user challenges: " + userChallenges.message
        );
      }

      // Fetch User Created Challenges
      console.log("Fetching user created challenges...");
      const createdChallengesResponse = await getUserCreatedChallenges();
      console.log(
        "User created challenges response:",
        createdChallengesResponse
      );
      if (createdChallengesResponse.success) {
        setCreatedChallenges(createdChallengesResponse.data);
      } else {
        throw new Error(
          "Failed to fetch user created challenges: " +
            createdChallengesResponse.message
        );
      }
    } catch (error) {
      setError(
        "Error fetching user details or challenges: " + (error as Error).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect Hook to Fetch Data on Mount
  useEffect(() => {
    fetchDetailsAndChallenges();
  }, []);

  // Refetch Function
  const refetch = useCallback(() => {
    fetchDetailsAndChallenges();
  }, []);

  // Filter Challenges Function
  const filterChallenges = (category: string) => {
    if (!details) {
      return [];
    }

    const currentUserID = details.User.UserName;
    console.log(currentUserID);
    switch (category) {
      case "joined":
        return challenges.filter(
          (challenge) => !moment(parseInt(challenge.EndDate)).isBefore(moment())
        );
      case "created":
        return createdChallenges;
      case "all":
      default:
        return challenges;
    }
  };

  return { challenges, details, error, isLoading, filterChallenges, refetch };
};

export default useUserChallenges;
