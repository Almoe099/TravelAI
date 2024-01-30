import React from 'react';

function TripBox({ trip }) {
  return (
    <div className="trip-box">
      <h3>Trip Details</h3>
      <p>Location: {trip.location}</p>
      <p>Start Date: {trip.startDate}</p>
      <p>End Date: {trip.endDate}</p>
    </div>
  );
}

export default TripBox;
