import React from 'react';

function TripBox({ trip, onDelete, onView }) {
  return (
    <div className="trip-box">
      <h3>Trip to {trip.location}</h3>
      <p>Start Date: {new Date(trip.startdate).toLocaleDateString()}</p>
      <p>End Date: {new Date(trip.enddate).toLocaleDateString()}</p>
      <div className="trip-actions">
        <button onClick={onView}>View</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default TripBox;
