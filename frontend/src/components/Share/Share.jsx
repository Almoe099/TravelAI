import { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { EmailIcon, FacebookIcon, XIcon, WhatsappIcon } from "react-share";

import "./Share.css";

const Share = ({ url, title, text }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="Share-container">
      <button id="share-icon" onClick={toggleDropdown}>
        Share
      </button>
      {isOpen && (
        <div className="Share-modal-overlay" onClick={toggleDropdown}>
          <div
            className="Share-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Share Your Trip</h2>
            <div className="share-email-buttons">
              <div id="share-button">
                <EmailShareButton url={url} subject={title} body={text}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
              </div>
              <div id="share-button">
                <FacebookShareButton url={url}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
              </div>
              <div id="share-button">
                <TwitterShareButton url={url} title={text}>
                  <XIcon size={40} round />
                </TwitterShareButton>
              </div>
              <div id="share-button">
                <WhatsappShareButton url={url} title={text}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
