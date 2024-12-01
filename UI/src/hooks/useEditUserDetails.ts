/* eslint-disable */
// @ts-nocheck
import { useState } from "react";
import { postUserUpdate } from "../utils/api/userApi";
import { UserDetails } from "../types/types";

const useUpdateUserDetails = (): UpdateUserDetailsHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateUserDetails = async (userDetails: UserDetails): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await postUserUpdate(userDetails);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return { updateUserDetails, loading, error, success };
};

export default useUpdateUserDetails;
