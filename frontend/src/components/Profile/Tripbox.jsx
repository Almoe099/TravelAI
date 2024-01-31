import React, { useState } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
} from "react-share";
import { Link } from 'react-router-dom';
import './Tripbox.css';

function TripBox({ trip, onDelete, onView, onShare }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const shareUrl = `http://localhost:5173/trips/${trip._id}`;
  const shareText = `Check out my upcoming trip to ${trip.location} from ${trip.startdate} to ${trip.enddate}. Check out the details at`;

  return (
    <div className="trip-box">
      <h3>Trip to {trip.location}</h3>
      <p>Start Date: {new Date(trip.startdate).toLocaleDateString()}</p>
      <p>End Date: {new Date(trip.enddate).toLocaleDateString()}</p>
      <div className="trip-actions">
        <Link to={`/trips/${trip._id}`}>
          <button className="tripBoxButtons" onClick={onView}>
            View
          </button>
        </Link>
        <button onClick={onDelete} className="tripBoxButtons">
          Delete
        </button>
        {onShare && (
          <>
            <button className="tripBoxButtons" onClick={openModal}>
              Share
            </button>
            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Share Trip</h2>
                  <EmailShareButton url={shareUrl} subject="Upcoming Trip Details" body={`${shareText}`}>
                    <button><EmailIcon size={32} round /> Email</button>
                  </EmailShareButton>

                  {/* Add more sharing options */}
                  <FacebookShareButton url={shareUrl}>
                    <button><FacebookIcon size={32} round /> Facebook</button>
                  </FacebookShareButton>

                  <TwitterShareButton url={shareUrl} title={shareText}>
                    <button><TwitterIcon size={32} round /> Twitter</button>
                  </TwitterShareButton>

                  {/* Add more sharing options as needed */}
                  <button onClick={closeModal}>Close</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TripBox;