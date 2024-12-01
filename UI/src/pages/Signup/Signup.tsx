/* eslint-disable */
// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers";
import ActivityRow from "../../components/ActivityRow";
import { activities } from "../../utils/constants/activity";
import arrowRight from "../../../public/assets/images/ArrowRight.svg";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import axios from "axios";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";
import { BackendURL } from "../../utils/constants/url";

const projectId = "ac00a2750a375703a709b053456a837d";

// Define Moonbeam Network
const moonbeamNetwork = {
  id: 1284,
  name: "Moonbeam",
  rpcUrls: ["https://rpc.api.moonbeam.network"],
  blockExplorers: {
    default: {
      name: "Moonbeam Explorer",
      url: "https://moonbeam.moonscan.io",
    },
  },
  nativeCurrency: {
    name: "Glimmer",
    symbol: "GLMR",
    decimals: 18,
  },
};

const networks = [moonbeamNetwork]; // Only Moonbeam is included here

const metadata = {
  name: "Catoff",
  description: "Catoff App Description",
  url: "https://www.catoff.xyz",
  icons: ["https://www.catoff.xyz/favicon.ico"],
};

// Initialize Reown AppKit with Moonbeam Network
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

const Signup = () => {
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchVerificationMessage = async (walletAddress) => {
    try {
      const response = await axios.get(
        `${BackendURL}/auth/wallet/verificationMessage/${walletAddress}`
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to get verification message");
      }
    } catch (error) {
      console.error("Error fetching verification message:", error);
      throw new Error("Error fetching verification message");
    }
  };

  const signMessage = async (messageToSign) => {
    try {
      if (!walletProvider || typeof walletProvider.request !== "function") {
        throw new Error("Wallet provider is not available or invalid.");
      }

      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(messageToSign);

      return signature;
    } catch (error) {
      console.error("Error signing the message:", error);
      throw new Error("Error signing the message");
    }
  };

  const loginUser = async (walletAddress, message, signature) => {
    try {
      const response = await axios.post(`${BackendURL}/auth/wallet/login`, {
        publickey: walletAddress,
        message,
        signature,
      });

      if (response.data.success) {
        console.log("User logged in successfully");
        localStorage.setItem("accessToken", response.data.data.access_token);
        localStorage.setItem("refreshToken", response.data.data.refresh_token);
        console.log("ACCESS Token:", response.data.data.access_token);
        console.log("REFRESH Token:", response.data.data.refresh_token);

        navigate("/explore");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      throw new Error("Error logging in user");
    }
  };

  const handleGetStarted = async () => {
    try {
      open();

      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      console.log("Wallet connected:", address);

      // Step 1: Fetch the verification message
      const verificationMessage = await fetchVerificationMessage(address);

      // Step 2: Sign the verification message
      const signature = await signMessage(verificationMessage);

      console.log("Signed message:", signature);

      // Step 3: Login the user
      await loginUser(address, verificationMessage, signature);
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message || "An error occurred");
    }
  };

  return (
    <div className="bg-[#b9c5f3] w-full h-screen flex flex-col justify-between">
      <div className="h-[50%] flex flex-col justify-end">
        {/* {activities.map((item, index) => (
          <ActivityRow key={index} activities={item} />
        ))} */}
      </div>
      <div className="flex flex-col items-center mb-6">
        <div
          className="flex justify-center items-center p-2 w-[90%] h-[56px] rounded-[32px] bg-white cursor-pointer"
          onClick={handleGetStarted}
        >
          <span className="font-semibold">Let's get started</span>
          <img src={arrowRight} alt="arrow" className="w-4 h-4 ml-2" />
        </div>
        {errorMessage && (
          <div className="text-center px-10 my-4 text-red-500">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
