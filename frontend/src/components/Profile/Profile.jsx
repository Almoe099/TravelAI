import React, { useState, useEffect } from 'react';
import TripBox from './Tripbox';
import './Profile.css';

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({
    location: '',
    startDate: '',
    endDate: '',
  });

  const userTrips = [];

  useEffect(() => {
    // Placeholder for dispatch(fetchUserTrips(currentUser._id));
    // Placeholder for return () => dispatch(clearTripErrors());
  }, []);

  const handleNewTripClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTripData({
      ...newTripData,
      [name]: value,
    });
  };

  const handleCreateTrip = () => {
    // Placeholder for handleCreateTrip logic
  };

  return (
    <div className="profile-container">
      <div className="left-half">
        <h2>User Trips</h2>
        {userTrips.length === 0 ? (
          <div>Placeholder: User has no Trips</div>
        ) : (

          <div>Placeholder for user trips</div> 
        )}
      </div>
      <div className="right-half">
        <div>
          <button onClick={handleNewTripClick}>Create New Trip</button>
        </div>
        {isModalOpen && (
          <div className="modal">
            <h3>Create a New Trip</h3>
            <label>
              Location:
              <input type="text" name="location" value={newTripData.location} onChange={handleInputChange} required />
            </label>
            <label>
              Start Date:
              <input type="date" name="startDate" value={newTripData.startDate} onChange={handleInputChange} required />
            </label>
            <label>
              End Date:
              <input type="date" name="endDate" value={newTripData.endDate} onChange={handleInputChange} required />
            </label>
            <button onClick={handleCreateTrip}>Create</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
        }  

export default Profile;
