/* eslint-disable */
// @ts-nocheck

import React, { useState } from "react";
import Modal from "react-modal";
import Popup from "./Modal";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLink,
  FaTelegram,
  FaInstagram,
  FaTimes,
} from "react-icons/fa"; // Import additional icons
import { MdCheckCircle, MdContentCopy } from "react-icons/md"; // Import Material Design icons

Modal.setAppElement("#root");

const ShareableModal = ({ isOpen, onRequestClose, shareUrl }) => {
  const title = "Check this out!";
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
  };

  return (
    <Popup isVisible={isOpen} onClose={onRequestClose}>
      <button onClick={onRequestClose} className="close-button">
        <FaTimes size={24} />
      </button>
      <h2 className="mb-2">Share This</h2>
      <button onClick={handleCopyLink} className="copy-link-button">
        {copied ? <MdCheckCircle size={24} /> : <MdContentCopy size={24} />}
        <span className="copy-link-text">{copied ? "Link Copied!" : ""}</span>
        <span className="text-sm">{shareUrl}</span>
      </button>
      <div className="share-buttons">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
        >
          <FaFacebook size={30} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
        >
          <FaTwitter size={30} />
        </a>
        <a
          href={`https://wa.me/?text=${title} ${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
        >
          <FaWhatsapp size={30} />
        </a>
        <a
          href={`https://t.me/share/url?url=${shareUrl}&text=${title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
        >
          <FaTelegram size={30} />
        </a>
        <a
          href={`https://www.instagram.com/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
        >
          <FaInstagram size={30} />
        </a>
      </div>

      <style jsx>{`
        .modal {
          position: relative;
          top: 82%;
          left: 50%;
          max-height: 67%;
          transform: translate(-50%, -50%);
          width: 95%;
          max-width: 600px;
          padding: 45px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .overlay {
          background: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #333;
        }
        .copy-link-button {
          display: flex;
          width: 100%;
          flex-direction: row-reverse;
          align-items: center;
          padding: 15px;
          border: none;
          border-radius: 5px;
          background-color: #2a323b;
          color: white;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 20px;
          transition: background-color 0.3s;
          position: relative;
        }
        .copy-link-button:hover {
          background-color: #2a323b;
        }
        .copy-link-text {
          font-size: 10px;
          margin-left: 10px;
        }
        .link-url {
          display: block;
          margin-top: 5px;
          font-size: 20px;
          color: #ddd;
        }
        .share-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
        }
        .share-button {
          display: flex;
          align-items: center;
          padding: 10px;
          border: none;
          border-radius: 50%;
          background-color: #f0f0f0;
          color: #333;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .share-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </Popup>
  );
};

export default ShareableModal;
