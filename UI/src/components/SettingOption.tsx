import React from "react";

const SettingsOption = ({ icon, title, description, linkText, onClick }) => {
  return (
    <div
      className="flex items-start justify-between px-4 py-6 border-b cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <img src={icon} className="mt-2" />
        <div>
          <h3 className="font-semibold text-lg text-left">{title}</h3>
          <p className="text-sm text-gray-600 text-left">
            {description}
            {linkText && (
              <a href="#" className="text-blue-500 ml-1">
                {linkText}
              </a>
            )}
          </p>
        </div>
      </div>
      <div className="text-gray-500">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default SettingsOption;
