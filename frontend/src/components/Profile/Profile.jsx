import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { composeTrip, fetchTrips, deleteTrip } from '../../store/trips';
import TripBox from './Tripbox';
import './Profile.css';
import Footer from '../Footer/Footer';
import gsap from 'gsap';
import { useSpring, animated } from '@react-spring/web';

function Profile() {
  const sessionUser = useSelector(state => state.session.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [errors, setErrors] = useState([]);
  const [newTripData, setNewTripData] = useState({
    location: '',
    startdate: '',
    enddate: '',
    author: sessionUser._id,
  });

  const dispatch = useDispatch();
  const trips = useSelector(state => state.trips.all);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const sortedTrips = Object.values(trips).sort((a, b) => new Date(a.startdate) - new Date(b.startdate));

  const handleNewTripClick = () => {
    setIsModalOpen(true);
    setNewTripData({ location: '', startdate: '', enddate: '', author: sessionUser._id });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTripData({ location: '', startdate: '', enddate: '', author: sessionUser._id });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTripData({ ...newTripData, [name]: value });
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();

    let myErrors = [];
    let authorId = sessionUser._id;
    // console.log(newTripData);
    let location = newTripData.location;
    let startdate = newTripData.startdate;
    let enddate = newTripData.enddate;
    if (location === "") {
        myErrors.push("Location can't be blank");
    }
    if (startdate === "" || startdate === undefined) {
        myErrors.push("Startdate can't be blank");
    }
    if (enddate === "" || enddate === undefined) {
        myErrors.push("Enddate can't be blank");
    }
    if (new Date() > new Date(startdate)) {
        myErrors.push("Startdate must be in the future");
    }
    if (new Date(startdate) > new Date(enddate)) {
        myErrors.push("Enddate cannot be before startdate");
    }
    if (daysBetween(new Date(startdate), new Date(enddate)) > 14) {
        myErrors.push("Can't have a trip longer than two weeks");
    }
    setErrors(myErrors); 
    console.log(myErrors);
    console.log(myErrors.length);
    if (myErrors.length === 0) {
        console.log("sent");
        setIsModalOpen(false);
        dispatch(composeTrip({location, startdate, enddate, authorId}));
    }
  };
  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }
  function daysBetween(startDate, endDate) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
  }


  const handleDeleteTrip = (tripId) => {
    dispatch(deleteTrip(tripId));
  };

  const handleViewTrip = (tripId) => {
    setSelectedTrip(tripId);
  };

  const handleShareTripByEmail = (trip) => {
    setSelectedTrip(trip);
  };

  return (
    <>
      <div className="profile-container">
        <div id="profile-left-half">
          <div id="profile-right-half">
            <div className="button-container">
              <button className="create-button" onClick={handleNewTripClick}>
                Create New Trip
              </button>
            </div>
          </div>
          <h2>Upcoming Trips</h2>
          {sortedTrips.length === 0 ? (
            <div className="no-trips">No Upcoming Trips</div>
          ) : (
            sortedTrips.map((trip, index) => (
              <TripBox
                key={index}
                trip={trip}
                onView={() => handleViewTrip(trip._id)}
                onDelete={() => handleDeleteTrip(trip._id)}
                onShare={() => handleShareTripByEmail(trip)}
              />
            ))
          )}
        </div>
      </div>
      {isModalOpen && (
        <div id="profile-modal">
          <h3>Create a New Trip</h3>
          <label>
            Location:
            <input type="text" name="location" value={newTripData.location} onChange={(e) => handleInputChange(e)} required />
          </label>
          <label>
            Start Date:
            <input type="date" name="startdate" value={newTripData.startdate} onChange={(e) => handleInputChange(e)} required />
          </label>
          <label>
            End Date:
            <input type="date" name="enddate" value={newTripData.enddate} onChange={(e) => handleInputChange(e)} required />
          </label>
          {errors.map(error => <p className="tripErrors">{error}</p>)}
          <button onClick={(e) => handleCreateTrip(e)}>Create</button>
          <button onClick={handleModalClose}>Cancel</button>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Profile;
