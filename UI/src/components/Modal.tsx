import React from "react";

interface PopupProps {
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isVisible, children, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 w-full inset-0 z-50 flex items-center justify-center pr-4 md:max-w-[370px]">
      <div
        className="fixed inset-0 w-full bg-black bg-opacity-50 backdrop-blur-xs"
        onClick={onClose}
      ></div>
      <div className="absolute bottom-2  bg-white rounded-2xl p-6 shadow-lg z-10 w-full md:max-w-[370px] ml-6 mx-2">
        {children}
      </div>
    </div>
  );
};

export default Popup;
