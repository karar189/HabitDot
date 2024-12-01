import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BackendURL } from "../utils/constants/url";

const useWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [isDropdownOpenWallet, setIsDropdownOpenWallet] = useState(false);
  const dropdownWalletRef = useRef(null);
  const getToken = () => {
    return (
      localStorage.getItem("authToken") || localStorage.getItem("accessToken")
    );
  };

  useEffect(() => {
    const fetchWallets = async () => {
      const headers = {
        Authorization: `Bearer ${getToken()}`,
      };

      try {
        const response = await axios.get(`${BackendURL}/user/getWallets`, {
          headers,
        });
        if (response.status === 200) {
          setWallets(response.data.data);
          if (response.data.data.length > 0)
            setSelectedWallet(response.data.data[0].PublicKey);
        } else {
          console.error("Error fetching wallets", response.data);
        }
      } catch (error) {
        console.error("Error fetching wallets", error);
      }
    };

    fetchWallets();
  }, [BackendURL]);

  return {
    wallets,
    selectedWallet,
    setSelectedWallet,
    isDropdownOpenWallet,
    setIsDropdownOpenWallet,
    dropdownWalletRef,
  };
};

export default useWallets;
