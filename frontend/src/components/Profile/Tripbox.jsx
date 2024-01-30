import React from 'react';

function TripBox({ trip, onDelete, onView }) {
    return (
      <div className="trip-box">
        {/* Existing trip details */}
        <h3>Trip to {trip.location}</h3>
        <p>Start Date: {new Date(trip.startdate).toLocaleDateString()}</p>
        <p>End Date: {new Date(trip.enddate).toLocaleDateString()}</p>
        <div className="trip-actions">
          <button onClick={() => onView(trip._id)}>View</button>
          <button onClick={() => onDelete(trip._id)}>Delete</button>
        </div>
      </div>
    );
  }
  
export default TripBox;
