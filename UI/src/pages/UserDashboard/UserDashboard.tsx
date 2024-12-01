/* eslint-disable */
// @ts-nocheck
import axios from "axios";
import useUserChallenges from "../../hooks/useUserChallenges";
import styles from "../../styles/styles";
import JoinChallengeIcon from "/assets/images/3xCredit.webp";
import trendUpImage from "/assets/images/trendup.webp";
import TransactionItem from "../../components/TransactionItem";
import { useEffect, useState } from "react";
import Popup from "../../components/Popup";
import SlideToConfirm from "../../components/SlideToConfirm";
import { MdContentCopy, MdCheck } from "react-icons/md";
import edit from "/assets/images/edit.webp";
import { useNavigate } from "react-router-dom";
import WalletConnection from "../../components/WalletConnection";
import PopupSlider from "../../components/Modal";

import addWalletImage from "/assets/images/add-wallet.svg";
import oktoImage from "/assets/images/okto.svg";
import { FaAngleDown, FaWallet } from "react-icons/fa";
import profile from "/assets/images/profile.webp";

import TransactionsTab from "../../components/TransactionsTab.js";
import GameTransactionTab from "../../components/GameTransactionTab.js";
import truncateAndMaskWalletAddress from "../../utils/api/WalletAddressTruncate.js";
import { BackendURL } from "../../utils/constants/url.js";
import ConnectWallet from "../../components/ConnectWallet.js";
import GeneralSection from "../../components/GeneralSection.js";


const UserDashboard = () => {
  const navigate = useNavigate();

  const { details, refetch, challenges } = useUserChallenges();
  console.log(challenges);
  // console.log(details);
  const [addWalletPopupVisible, setAddWalletPopupVisible] = useState(false);
  const [addWalletVisible, setAddWalletVisible] = useState(false);
  const [isAddCreditsPopupVisible, setIsAddCreditsPopupVisible] =
    useState(false);
  const [activeTab, setActiveTab] = useState("transaction");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [some, setSome] = useState(false);
  const [all, setAll] = useState(false);
  const [someslide, setSomeslide] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isLoadingIndicator, setIsLoadingIndicator] = useState(false);
  const [sliderState, setSliderState] = useState("");
  const [withdrawStatusVisible, setWithdrawStatusVisible] = useState(false);
  const [withdrawStatusMessage, setWithdrawStatusMessage] = useState("");
  const [withDrawalConfirmation, setWithDrawalConfirmation] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [totalSidewagers, setTotalSideWagers] = useState(0);
  const [isFetchingWallets, setIsFetchingWallets] = useState(true);

 
  const handleAddWalletPopupVisible = () => {
    setAddWalletPopupVisible(false);
  };
  const handleLogout = async () => {
    await localStorage.clear();
    window.location.href = `/`;
    // navigate("/");
  };
  const handleCopyaddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset copy state after 2 seconds
  };

  
  const handleYes = () => {
    setIsLoadingIndicator(true);
    handleClosePopup();
  };
  const handleCloseAddCreditsPopup = () => {
    setIsAddCreditsPopupVisible(false);
  };
  const handleClosePopup = async () => {
    setIsLoadingIndicator(true);
    console.log(`Withdrawing ${amount} credits`);
    await withDraw(amount);
    setIsPopupVisible(false);
    setAll(false);
    setSome(false);
    // setAmount("");
    setSomeslide(false);

    setWithdrawStatusVisible(true);
  };
  const handleVisitTelegram = async () => {
    const telegramUrl = "https://t.me/+xoGcw5oJzI0wNWRh";
    window.open(telegramUrl, "_blank");
    handleCloseAddCreditsPopup();
  };
  const handleNo = () => {
    handleClosePopupUI();
    setSomeslide(false);
  };
  const handleClosePopupUI = () => {
    setIsPopupVisible(false);
    setAll(false);
    setSome(false);
    setAmount(0);
    setSomeslide(false);
    setIsLoadingIndicator(false);
  };

  const handleOpenPopupUI = () => {
    setAmount(0);
    setSome(false);
    setAll(false);
    setSomeslide(false);
    setIsPopupVisible(true);
  };

  const handleSome = () => {
    setSome(true);
    setAll(false);
  };

  const handleAll = () => {
    setAmount(details?.User?.Credits);
    setSomeslide(true);
    setSome(false);
    setAll(true);
  };
  const handleAddCredits = () => {
    setIsAddCreditsPopupVisible(true);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value));
  };

  const incrementAmount = (value: number) => {
    setAmount(amount + value);
  };

  const handleConfirmWithdrawal = () => {
    setSomeslide(true);
    console.log("Confirm withdrawal");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //  const {}=useUserChallenges()
  const transactionData = [
    { type: "withdraw", amount: "2,530", date: "24 Jun 24", description: "" },
    {
      type: "deposit",
      amount: "3,530",
      date: "20 Jun 24",
      description: "via Octo Wallet",
    },
  ];
  const handleCopy = () => {
    const textToCopy = details?.User?.WalletAddress
      ? details.User.WalletAddress.slice(15)
      : "";
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  // Will have to add the type of wallet to come from the backend (for the logo to be displayed)
  const getToken = () => {
    return (
      localStorage.getItem("authToken") || localStorage.getItem("accessToken")
    );
  };
  useEffect(() => {
    const fetchWallets = async () => {
      setIsFetchingWallets(true);
      const headers = {
        Authorization: `Bearer ${getToken()}`,
      };

      try {
        console.log("Fetching wallets..."); // Debug: Start fetching
        const response = await axios.get(`${BackendURL}/user/getWallets`, {
          headers,
        });
        console.log("Response received:", response); // Debug: Log the entire response

        if (response.status === 200) {
          const walletsData = response.data.data;
          console.log("Wallets data:", walletsData); // Debug: Log the wallets data

          // Parse PublicKey if it's a JSON string, otherwise use as is
          const parsedWallets = walletsData.map((wallet) => {
            let address = wallet.PublicKey;
            try {
              const publicKeyObj = JSON.parse(wallet.PublicKey);
              if (publicKeyObj && publicKeyObj.address) {
                address = publicKeyObj.address;
              }
            } catch (e) {
              console.warn("Failed to parse PublicKey, using raw data", e);
            }
            return {
              ...wallet,
              PublicKey: address,
            };
          });

          setWallets(parsedWallets);
          console.log("WALLETS SET", parsedWallets);

          if (parsedWallets.length > 0) {
            const firstWallet = parsedWallets[0].PublicKey;
            console.log("First wallet public key:", firstWallet); // Debug: Log the first wallet's address
            setSelectedWallet(firstWallet);
          }
        } else {
          console.error(
            "Error fetching wallets - non-200 status",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching wallets - exception caught", error);
      } finally {
        setIsFetchingWallets(false);
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    if (selectedWallet) {
      console.log("🔥SELECTED WALLET", selectedWallet);
    }
  }, [selectedWallet]);

  const handleWalletChange = (event) => {
    setSelectedWallet(event.target.value);
  };

  const handleSwitchWallet = async () => {
    if (selectedWallet === "add_new_wallet") {
      return;
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    };

    const body = {
      PublicKey: selectedWallet,
    };

    try {
      const response = await axios.post(
        `${BackendURL}/user/switchWallet`,
        body,
        { headers }
      );
      if (response.status === 200) {
        console.log("Wallet switched successfully", response.data);
        await refetch();
      } else {
        console.error("Error switching wallet", response.data);
      }
    } catch (error) {
      console.error("Error switching wallet", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex flex-col h-40 items-center p-4"
        style={{ backgroundColor: details?.User?.CoverHexCode || "#5FD7D5" }}
      >
        <div className="flex flex-col items-center mt-24">
          <div className="relative w-28 h-28">
            <img
              className="object-cover w-full h-full rounded-lg"
              src={
                details?.User?.ProfilePicture &&
                details?.User?.ProfilePicture !== ""
                  ? details.User.ProfilePicture
                  : "/assets/images/profile.webp"
              }
              alt="Profile"
            />
            <img
              src={edit}
              alt="Edit Icon"
              onClick={() => navigate("/editProfile")}
              className="absolute bottom-1 right-1 w-6 h-6"
            />
          </div>

          <div className="text-[10px] mt-2 text-gray-600">
            {details?.User?.Email}
          </div>
          <div className="flex flex-row items-center p-2">
            <div className="text-xl font-bold text-center mr-2 h-[32px] text-gray-800">
              {details?.User?.UserName}
            </div>
            {/* <div onClick={() => console.log("clicked")}>
            <img src={edit} alt="Copy Icon" style={{ width: 25, height: 25 }} />
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mx-4">
        <div className="flex flex-col items-center justify-center py-3 mt-32 border font-inter border-gray-200 rounded-full w-full ">
          <div className="">
            <div className="flex flex-row items-center px-8 w-full ">
              {/* <div className="text-[#161616] text-sm ">
                {selectedWallet && selectedWallet !== "add_new_wallet"
                  ? truncateAndMaskWalletAddress(
                      // details?.User?.WalletAddress ? details.User.WalletAddress : ""
                      selectedWallet
                    )
                  : null}
              </div> */}

              {isFetchingWallets ? (
                <div className="text-sm text-gray-600">
                  Fetching your wallet, please wait...
                </div>
              ) : (
                <div className="text-[#161616] text-sm ">
                  {details?.User
                    ? selectedWallet && selectedWallet !== "add_new_wallet"
                      ? truncateAndMaskWalletAddress(selectedWallet)
                      : "Creating your wallet..."
                    : "Wallet Address..."}
                </div>
              )}
              <button
                className={`flex items-center mx-2 text-black hover:text-gray-700  ${
                  wallets.length === 0 ? "hidden" : ""
                }`}
                onClick={() =>
                  handleCopyaddress(
                    details?.User?.WalletAddress
                      ? details.User.WalletAddress
                      : ""
                  )
                }
                // disabled={isFetchingWallets}
              >
                {isCopied ? (
                  <MdCheck size={20} color="green" />
                ) : (
                  <MdContentCopy size={20} /> //copy icon
                )}
                <span className="ml-1">{isCopied ? "Copied" : ""}</span>
              </button>
              {/* <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          onClick={fetchWallets}
          disabled={isFetchingWallets} // Disable while fetching
        >
          {isFetchingWallets ? "Refreshing..." : "Refresh Wallets"}
        </button> */}
            </div>
          </div>
        </div>
        {/* add wallet butoon */}
        {/* <button
          className="w-full max-w-[80%] bg-gray-200 text-gray-800 py-3 rounded-full my-2"
          style={{
            alignItems: "center",
          }}
          onClick={handleSwitchWallet}
        >
          Switch to other Wallet
        </button> */}
        {/* <div>
          <select
            className="w-full max-w-[80%] bg-gray-200 text-gray-800 py-3 rounded-full my-2"
            value={selectedWallet}
            onChange={handleWalletChange}
          >
            <option value="" disabled>
              Select a wallet
            </option>
            {wallets.map((wallet) => (
              <option key={wallet.ID} value={wallet.PublicKey}>
                {wallet.PublicKey} ({wallet.Type})
              </option>
            ))}
          </select>
          <button onClick={handleSwitchWallet}>Switch Wallet</button>
        </div>
        <WalletConnection /> */}
        {wallets.length === 0 ? (
          <></>
        ) : (
          <>
            <div className="w-full  py-2">
              <div
                className={`flex flex-col gap-2 ${
                  !selectedWallet && !isOpen ? "" : "p-4 border"
                } rounded-2xl`}
              >
                <div
                  className={`py-2 px-3 border border-[#E3E3E3] rounded-[28px] w-full cursor-pointer flex flex-row gap-1 justify-between items-center ${
                    !selectedWallet ? "bg-[#EEEEEE]" : ""
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedWallet ? (
                    <div className="flex flex-row gap-2 items-center justify-between w-full">
                      <div className="flex flex-row gap-2 items-center">
                        {/* <img src={oktoImage} className="w-7 h-7" /> */}
                        <FaWallet />

                        <h1 className="text-[#576175] font-inter text-sm min-[320px]:text-[10px] font-medium">
                          Account
                        </h1>
                        <h1 className="text-xs italic  font-inter text-[#AEB4C1]">
                          {truncateAndMaskWalletAddress(selectedWallet)}
                        </h1>
                      </div>
                      <FaAngleDown
                        className={`text-[#576175] ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-2 flex-row justify-center">
                      <FaWallet />
                      <h1 className="text-sm font-semibold  font-inter">
                        Connect Wallet
                      </h1>
                    </div>
                  )}
                </div>
                {isOpen && (
                  <div className="flex flex-col gap-4 ">
                    {wallets.map((wallet, index) => (
                      <div
                        key={index}
                        className="py-2 px-3 hover:bg-gray-100 rounded-t-lg border-b cursor-pointer flex flex-row gap-2 items-center"
                        onClick={() => {
                          handleWalletChange({
                            target: { value: wallet.PublicKey },
                          });
                          setIsOpen(false);
                        }}
                      >
                        {/* <img src={oktoImage} className="w-7 h-7" /> */}
                        <FaWallet />
                        <h1 className="text-[#576175] font-inter text-sm font-medium">
                          Account {index + 1}
                        </h1>
                        <h1 className="text-xs italic font-inter text-[#AEB4C1]">
                          {truncateAndMaskWalletAddress(wallet.PublicKey)}
                        </h1>
                      </div>
                    ))}
                    {/* COMMENTED OUT TO HOTFIX THE DOUBLE TRIGGER OF WALLET CONNECT ON USER DASH PAGE */}
                    <div
                      className="py-2 px-4 cursor-pointer flex flex-row gap-3 items-center"
                      onClick={() => {
                        setAddWalletPopupVisible(true);
                        setAddWalletVisible(true);
                        // setIsOpen(false);
                      }}
                    >
                      {/* <WalletConnection /> */}
                    </div>
                  </div>
                )}
                {/* <div className="p-2">
                  {addWalletVisible ? <WalletConnection /> : null}
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-start p-4 w-full min-h-[80px] mt-4">
        <div className="font-inter font-bold text-[12px] leading-[14.52px] tracking-[1px] text-[#1F1F1F] uppercase text-center">
          About Me
        </div>
        <div className="flex flex-row items-center w-[100%] min-h-[80px]">
          <div className="text-sm text-gray-700 text-left w-full">
            {details?.User?.Bio ||
              "Third Rule of the street, No one is interested in your feelings"}
          </div>
        </div>
      </div>
      <div className="h-px py-1 bg-[#ebebeb] w-full my-2" />
      <div>
        <div className="font-inter font-bold text-[12px] leading-[14.52px] tracking-[1px] text-[#1F1F1F] uppercase p-4">
          CATOFF ANALYTICS
        </div>
        <div className="flex p-4 flex-row gap-4 w-full overflow-auto">
          <div
            className="border border-gray-200 rounded-lg px-2 py-2 min-w-[164px]"
            onClick={() => navigate("/myChallenges")}
          >
            <div className="flex flex-row items-center">
              <img
                src={trendUpImage}
                alt="Trending Up"
                className="w-4 h-4 mr-2"
              />
              <div className="text-[12px] p-3 pl-2 text-gray-700">
                Challenges Joined
              </div>
            </div>
            <div className="flex flex-row mt-4 justify-between items-center">
              <div className="text-4xl font-runs text-gray-800">
                {details?.PastChallenges}
              </div>
              <div>
                <span className="text-lg">→</span>{" "}
              </div>
            </div>
          </div>
          <div
            className="border border-gray-200 rounded-lg px-2 py-2 min-w-[164px]"
            onClick={() => navigate("/myChallenges")}
          >
            <div className="flex flex-row items-center">
              <img
                src={trendUpImage}
                alt="Trending Up"
                className="w-4 h-4 mr-2"
              />
              <div className="text-[12px] p-3 pl-2 text-gray-700">
                Challenges Hosted
              </div>
            </div>
            <div className="flex flex-row mt-4 justify-between items-center">
              <div className="text-4xl font-runs text-gray-800 text-center">
                {details?.CurrentActiveChallenges}
              </div>
              <div>
                <span className="text-lg">→</span>{" "}
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg px-2 py-2 min-w-[164px]">
            <div className="flex flex-row items-center w-full">
              <img
                src={trendUpImage}
                alt="Trending Up"
                className="w-4 h-4 mr-2"
              />
              <div className="text-[12px] p-3 pl-2 text-gray-700">
                Side Wagers
              </div>
            </div>
            <div className="flex flex-row mt-4 justify-between items-center w-full">
              <div className="text-4xl font-runs text-gray-800 text-center">
                {totalSidewagers}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start  w-full min-h-[100px] mt-4">
        <div className="flex flex-row items-center w-full min-h-[100px]">
          <div className="w-full">
            <div className="h-px py-1 bg-[#ebebeb] w-full my-2" />
            <div className="flex  mb-4">
              <GeneralSection wallets={wallets} />
            </div>
            <div className="h-px py-1 bg-[#ebebeb] w-full my-2 " />
            <div className="flex flex-col items-start space-y-2 mx-4">
              <h4 className="text-lg font-semibold py-2">More info</h4>
              <a
                href="https://www.catoff.xyz/"
                className="text-black-800 no-underline pb-1 "
              >
                FAQS
              </a>
              <a
                href="https://www.catoff.xyz/catpaper"
                className="text-black-800 no-underline  pb-1"
              >
                ABOUT US
              </a>
              <a
                href="https://www.catoff.xyz/TermsAndServices.html"
                className="text-black-800 no-underline pb-1"
              >
                TERMS & CONDITIONS
              </a>
              <a
                href="https://www.catoff.xyz/PrivacyPolicy.html"
                className="text-black-800 no-underline pb-1"
              >
                PRIVACY POLICY
              </a>
            </div>

            <div className="h-px py-1 bg-[#ebebeb] w-full mt-2 mb-2" />
            <button
              className="w-[94%] text-gray-800 border border-[#db5555] py-3 rounded-full mt-2 mb-2 mx-4"
              onClick={handleLogout}
            >
              <div class="text-center text-[#c44545] text-sm font-semibold leading-normal">
                Logout
              </div>
            </button>
            <div class="text-center text-[#bdbdbd] text-[10px] font-normal  mb-28 tracking-tight">
              Catoff Gaming LLC, ©2024. All rights reserved.
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full overflow-hidden">
          {/* Existing content */}
          {/* Popup Component */}
          {/* <ConnectWallet
            isVisible={addWalletPopupVisible}
            onClose={handleAddWalletPopupVisible}
            setIsOpen={setAddWalletPopupVisible}
          /> */}
          {isPopupVisible && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
              <Popup isVisible={isPopupVisible} onClose={handleClosePopupUI}>
                {!some && !all && (
                  <div className="flex flex-col min-h-240 items-start w-full">
                    <h2 className="my-7 ml-6 text-left text-lg leading-6 text-black">
                      Select your action
                    </h2>
                    <div className="w-full">
                      <button
                        className="py-3 m-2 border flex items-center border-gray-300 rounded-full"
                        onClick={handleSome}
                      >
                        <div className="flex justify-between items-center px-6 w-full">
                          <span className="text-black">
                            Withdraw some credits
                          </span>
                          <span>➔</span>
                        </div>
                      </button>
                      <button
                        className="py-3 m-2 border flex items-center border-gray-300 rounded-full"
                        onClick={handleAll}
                      >
                        <div className="flex justify-between items-center px-6 w-full">
                          <span className="text-black">
                            Withdraw all credits
                          </span>
                          <span>➔</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {some && !someslide && (
                  <div className="flex min-h-350 flex-col items-center w-full">
                    <img
                      className="h-16 w-16 mt-8"
                      src={JoinChallengeIcon}
                      alt="Join Challenge Icon"
                    />
                    <input
                      className="w-full h-12 my-5 border border-gray-300 rounded-lg text-2xl text-center"
                      value={amount.toString()}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                      type="number"
                    />
                    <div className="flex flex-row mb-4 justify-center items-start gap-2 w-full">
                      <button
                        className="py-2 px-4 border border-gray-200 rounded-lg"
                        onClick={() => incrementAmount(100)}
                      >
                        <span className="text-black">+ 100</span>
                      </button>
                      <button
                        className="py-2 px-4 border border-gray-200 rounded-lg"
                        onClick={() => incrementAmount(500)}
                      >
                        <span className="text-black">+ 500</span>
                      </button>
                      <button
                        className="py-2 px-4 border border-gray-200 rounded-lg"
                        onClick={() => incrementAmount(1000)}
                      >
                        <span className="text-black">+ 1000</span>
                      </button>
                    </div>
                    <button
                      className="flex justify-center items-center py-2 px-4 w-full bg-black rounded-full text-white font-bold"
                      onClick={handleConfirmWithdrawal}
                    >
                      Withdraw Now
                    </button>
                  </div>
                )}

                {someslide && (
                  <div className="flex flex-col items-center mx-9">
                    <img
                      className="h-16 w-16 mt-8"
                      src={JoinChallengeIcon}
                      alt="Join Challenge Icon"
                    />
                    <h2 className="text-3xl my-4 font-medium">
                      {amount} Credits
                    </h2>
                    <p className="text-xs mx-1 mb-4 leading-5 text-center text-gray-700">
                      Withdrawal to your crypto wallet.
                    </p>
                    <div className="my-8 flex justify-around w-full">
                      <button
                        className="flex-grow py-3 m-2 border flex items-center justify-center border-gray-300 rounded-full text-gray-700"
                        onClick={handleYes}
                      >
                        Yes
                      </button>
                      <button
                        className="flex-grow py-3 m-2 border flex items-center justify-center border-black rounded-full text-black"
                        onClick={handleNo}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          )}
         

          <Popup
            isVisible={isAddCreditsPopupVisible}
            onClose={handleCloseAddCreditsPopup}
          >
            <p className="mt-6 mb-2 text-bold self-center">
              Catoff Gaming is currently on Solana devnet
            </p>
            <p className="font-inter font-normal text-xs mx-1 leading-5 text-center text-gray-700">
              If you want to get more credits then drop a message on our
              telegram group
            </p>
            <div className="w-full flex justify-center">
              <button
                className="py-3 m-4 border flex items-center border-gray-300 rounded-full my-8 w-full max-w-xs mx-2 justify-center"
                onClick={handleVisitTelegram}
              >
                <span className="text-black">Visit Our Telegram</span>
              </button>
            </div>
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
