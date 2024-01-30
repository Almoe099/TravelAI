import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { composeTrip } from '../../store/trips'; // Ensure this matches your file structure
import TripBox from './Tripbox';
import './Profile.css';

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({
    location: '',
    startDate: '',
    endDate: '',
  });

  const dispatch = useDispatch();
  const trips = useSelector(state => state.trips.all); 

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
    console.log('Creating trip with data:', newTripData);
    dispatch(composeTrip(newTripData));
    setIsModalOpen(false);
  };

  return (
    <div className="profile-container">
      <div id="profile-left-half">
        <h2>User Trips</h2>
        {Object.keys(trips).length === 0 ? (
          <div>User has no Trips</div>
        ) : (
          Object.values(trips).map((trip, index) => (
            <TripBox key={index} trip={trip} />
          ))
        )}
      </div>
      <div id="profile-right-half">
  <div className="button-container">
    <button className="create-button" onClick={handleNewTripClick}>Create New Trip</button>
  </div>
  {isModalOpen && (
          <div id="profile-modal">
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
