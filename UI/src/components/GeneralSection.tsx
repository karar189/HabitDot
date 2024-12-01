/* eslint-disable */
// @ts-nocheck

import React, { useState } from "react";
import SettingsOption from "./SettingOption";
import { useNavigate } from "react-router-dom";
import ShareableModal from "./ShareableModal";
import add from "/assets/images/add.svg";
import help from "/assets/images/help.svg";
import cat from "/assets/images/catoffexp.svg";
import wallet from "../assets/wallet.svg";
const GeneralSection = ({ wallets }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="p-4 text-left text-lg font-semibold py-2">General</h2>
    
     
      <SettingsOption
        icon={help}
        title="Help"
        description="Help centre and Contact Us."
        onClick={() => window.open("https://www.catoff.xyz/", "_blank")}
      />
      <SettingsOption
        icon={add}
        title="Invite a friend"
        description="Refer and invite a friend and earn up to 100 credits."
        onClick={openModal}
      />
      <ShareableModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shareUrl={"https://game.catoff.xyz/"}
      />
    </div>
  );
};

export default GeneralSection;
