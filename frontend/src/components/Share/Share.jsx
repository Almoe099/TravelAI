import React, { useState } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import './Share.css';

const Share = ({ url, title, text }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // Dynamically apply animation class based on the isOpen state
  const modalClass = isOpen ? 'Share-modal-overlay open' : 'Share-modal-overlay';

  return (
    <div className="Share-container">
      <button id="share-icon" onClick={toggleModal}>
        Share
      </button>
      {isOpen && (
        <div className={modalClass} onClick={toggleModal}>
          <div className="Share-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="share-header">Share Your Trip</h2>
            <div className="share-email-buttons">
              <EmailShareButton url={url} subject={title} body={text} className="share-button">
                <EmailIcon size={40} round />
              </EmailShareButton>
              <FacebookShareButton url={url} quote={title} className="share-button">
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton url={url} title={title} className="share-button">
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <WhatsappShareButton url={url} title={title} separator=":: " className="share-button">
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
            </div>
            <button className="close-modal" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
