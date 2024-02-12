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
  const [sortedTrips, setSortedTrips] = useState([]);
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
    // Using gsap.fromTo for explicit control over the animation
    gsap.fromTo(".profile-container", 
      { opacity: 0, y: 100 }, // starting properties
      { duration: 2, opacity: 1, y: 0, ease: "power2.out" } // ending properties
    );
  }, [dispatch]);
  
  // const userTrips = Object.entries(trips).filter(trip => trip[1].user._id === sessionUser._id);
  useEffect(() => {
    if (trips !== undefined && trips !== null) {
      if (Object.entries(trips).length > 0) {
        const sortedTrips1 = Object.values(trips).sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
        let sortedTrips2 = [];
        for (let i = 0; i < sortedTrips1.length; i++) {
          if (sortedTrips1[i].author !== null && sortedTrips1[i].author._id === sessionUser._id) {
            sortedTrips2.push(sortedTrips1[i]);
          }
        }
        setSortedTrips(sortedTrips2);
      }
    }
  }, [trips])
  

      

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
    let author = sessionUser._id;
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
    if (myErrors.length === 0) {
        setIsModalOpen(false);
        dispatch(composeTrip({location, startdate, enddate, author}));
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

  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: isModalOpen ? `translate(-50%, -50%) scale(1)` : `translate(-50%, -50%) scale(0.5)`,
    top: '50%',
    left: '50%',
    position: 'absolute',
    config: { duration: 300 }
  });

  

  return (
    <>
      <div className="profile-container"> {/* Initial opacity set to 0 */}
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
        <animated.div style={modalAnimation} id="profile-modal">
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

          </animated.div>
      )}
      <Footer />
    </>
  );
}

export default Profile;
