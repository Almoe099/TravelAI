import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { composeTrip, fetchTrips, deleteTrip } from '../../store/trips';
import TripBox from './Tripbox';
import './Profile.css';
import Footer from '../Footer/Footer';
import gsap from 'gsap';
import { useSpring, animated } from '@react-spring/web';
import { Country, State, City} from 'country-state-city';

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

  const [clickListener, setClickListener] = useState(false);

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
  

  useEffect(() => {
    if (isModalOpen) {
        if (!clickListener) {
            // console.log(clickListener);
            document.addEventListener("click", handleHide, {capture: true});
            setClickListener(true);
        }
    } else {
      // console.log(clickListener);
      document.removeEventListener("click", handleHide, {capture: true});
      setClickListener(false);
    }
  }, [isModalOpen]) 

  const handleHide = useCallback((e) => {
    e.preventDefault();

    // console.log(`classname: ${e.target.className}`);
    // console.log(`id: ${e.target.id}`);

    if (!e.target.id.includes("modal") && !e.target.className.includes("modal")) {
        handleModalClose();
        document.removeEventListener("click", handleHide, {capture: true});
        setClickListener(false);
    }
  }, [])

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
    // validate location.
    // console.log("==== test ==== ");
    // console.log(Country.getAllCountries());
    // console.log(State.getAllStates());
    // console.log(City.getAllCities());
    let countries = Country.getAllCountries();
    let states = State.getAllStates();
    let cities = City.getAllCities();

    let locationCheck = false;
    for (let i = 0; i < countries.length; i++) {
      if (!locationCheck) {
        if (location.includes(countries[i].name)){
          locationCheck = true;
        } else if (location.includes("USA") || location.includes("America")) {
          locationCheck = true;
        }
      }
    }
    for (let i = 0; i < states.length; i++) {
      if (!locationCheck) {
        if (location.includes(states[i].name)){
          locationCheck = true;
        }
      }
    }
    for (let i = 0; i < cities.length; i++) {
      if (!locationCheck) {
        if (location.includes(cities[i].name)){
          locationCheck = true;
        }
      }
    }
    if (!locationCheck) {
        myErrors.push("Location isn't recognized");
    }

    setErrors(myErrors); 

    // console.log(myErrors);
    // console.log(myErrors.length);
    if (myErrors.length === 0) {
        // console.log("sent");

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
          <h3 id="modal-ele">Create a New Trip</h3>
          <label id="modal-ele">
            Location:
            <input id="modal-ele" type="text" name="location" value={newTripData.location} onChange={(e) => handleInputChange(e)} required />
          </label>
          <label id="modal-ele">
            Start Date:
            <input id="modal-ele" type="date" name="startdate" value={newTripData.startdate} onChange={(e) => handleInputChange(e)} required />
          </label>
          <label id="modal-ele">
            End Date:
            <input id="modal-ele" type="date" name="enddate" value={newTripData.enddate} onChange={(e) => handleInputChange(e)} required />
          </label>
          {errors.map(error => <p className="tripErrors">{error}</p>)}
          <button id="modal-ele" onClick={(e) => handleCreateTrip(e)}>Create</button>
          <button id="modal-ele" onClick={handleModalClose}>Cancel</button>

          </animated.div>
      )}
      <Footer />
    </>
  );
}

export default Profile;
