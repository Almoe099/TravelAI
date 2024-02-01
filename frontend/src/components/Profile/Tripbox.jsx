// TripBox.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Tripbox.css';
import Share from '../Share/Share';

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
            <Share
              url={shareUrl}
              title="Upcoming Trip Details"
              text={shareText}
              onClose={closeModal}
            />
        )}
      </div>
    </div>
  );
}

export default TripBox;