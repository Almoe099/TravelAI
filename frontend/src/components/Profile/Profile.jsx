import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { composeTrip } from '../../store/trips'; // Ensure this matches your file structure
import TripBox from './Tripbox';
import './Profile.css';
import { fetchTrips } from '../../store/trips';

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({
    location: '',
    startdate: '',
    enddate: '',
  });

  const dispatch = useDispatch();
  const trips = useSelector(state => state.trips.all); 
  const sortedTrips = Object.values(trips).sort((a, b) => 
  new Date(a.startdate) - new Date(b.startdate)
);

  useEffect(() => {
    dispatch(fetchTrips()); // Fetch trips when the component mounts
  }, [dispatch]); 

  const handleNewTripClick = () => {
    setIsModalOpen(true);
    setNewTripData({ location: '', startdate: '', enddate: '' }); // Reset form fields
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTripData({ location: '', startdate: '', enddate: '' }); // Reset form fields
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTripData({
      ...newTripData,
      [name]: value,
    });
  };

  const handleCreateTrip = () => {
    dispatch(composeTrip(newTripData));
    setIsModalOpen(false);
    setNewTripData({ location: '', startdate: '', enddate: '' }); // Reset form fields
  };
  

  return (
    <div className="profile-container">
      <div id="profile-left-half">
        <h2>Upcoming Trips</h2>
        {sortedTrips.length === 0 ? (
          <div className="no-trips">No Upcoming Trips</div>
        ) : (
          sortedTrips.map((trip, index) => (
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
              <input type="date" name="startdate" value={newTripData.startdate} onChange={handleInputChange} required />
            </label>
            <label>
              End Date:
              <input type="date" name="enddate" value={newTripData.enddate} onChange={handleInputChange} required />
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
