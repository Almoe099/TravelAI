import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Tripbox.css';
// import Share from '../Share/Share';

function TripBox({ trip, onDelete, onView }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = () => {
    onDelete(); // Call the onDelete function only if the user confirms the delete action
    closeModal(); // Close the modal after deleting
  };

  return (
    <div className="trip-box">
      <h3>Trip to {trip.location}</h3>
      <p>Start Date: {new Date(trip.startdate).toLocaleDateString('en-us', { timeZone: 'UTC' })}</p>
      <p>End Date: {new Date(trip.enddate).toLocaleDateString('en-us', { timeZone: 'UTC' })}</p>
      <div className="trip-actions">
        <Link to={`/trips/${trip._id}`}>
          <button className="tripBoxButtons" onClick={onView}>
            View
          </button>
        </Link>
        <button onClick={openModal} className="tripBoxButtons">
          Delete
        </button>
        {/* {onShare && (
          <Share
            url={`http://localhost:5173/trips/${trip._id}`}
            title="Upcoming Trip Details"
            text={`Check out my upcoming trip to ${trip.location} from ${trip.startdate} to ${trip.enddate}. Check out the details at`}
            onClose={closeModal}
          />
        )} */}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Delete Trip</h2>
            <p>Are you sure you want to delete this trip?</p>
            <div className='delete-modal-buttons'>
            <button id="delete-confirm" onClick={handleDelete}>
              Delete
            </button>
            <button id="delete-cancel" onClick={closeModal}>
              Cancel
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripBox;
