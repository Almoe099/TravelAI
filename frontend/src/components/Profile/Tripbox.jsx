import React from 'react';
import { Link } from 'react-router-dom';
import './Tripbox.css'

function TripBox({ trip, onDelete, onView }) {
  return (
    <div className="trip-box">
      <h3>Trip to {trip.location}</h3>
      <p>Start Date: {new Date(trip.startdate).toLocaleDateString()}</p>
      <p>End Date: {new Date(trip.enddate).toLocaleDateString()}</p>
      <div className="trip-actions">
        <Link to={'/tripshow'}><button className="tripBoxButtons"  onClick={onView}>View</button></Link>
        <button onClick={onDelete} className="tripBoxButtons" >Delete</button>
      </div>
    </div>
  );
}

export default TripBox;
