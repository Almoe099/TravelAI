import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as tripActions from "../../store/trips.js"
import * as itineraryActions from "../../store/itineraries.js"
import './MakeTrip.css'

function MakeTrip() {
    let [location, setLocation] = useState("");
    let [startDate, setStartDate] = useState("");
    let [endDate, setEndDate] = useState("");

    let sessionUser = useSelector(state => state.session.user);
    let newTrip = useSelector(state => state.trips.new);
    // let newTrip = useSelector(state => Object.values(state.trips.all)[0]);
    let newItinerary = useSelector(state => state.itineraries.new);
    const [errors, setErrors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTripData, setNewTripData] = useState({
        location: '',
        startdate: '',
        enddate: '',
        author: sessionUser._id,
      });
    const handleInputChange = (e) => {
        // console.log(e.target);
        const { name, value } = e.target;
        setNewTripData({ ...newTripData, [name]: value });
        // console.log(newTripData);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewTripData({ location: '', startdate: '', enddate: '', author: sessionUser._id });
      };
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(newTrip);
    }, [newTrip])
    useEffect(() => {
        console.log(newItinerary);
    }, [newItinerary])
    useEffect(() => {
        dispatch(tripActions.fetchTrips());
        dispatch(itineraryActions.fetchItineraries());
    }, [dispatch])

    function handleCreateTrip(e) {
        e.preventDefault();
        
        let myErrors = [];
        let authorId = sessionUser._id;
        console.log(newTripData);
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
            dispatch(tripActions.composeTrip({location, startdate, enddate, authorId}));
        }
    }
    function treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }
    function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }
    function handleCreateItinerary(e) {
        e.preventDefault();
        
        // get list of dates
        var getDaysArray = function(start, end) {
            for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
                arr.push(new Date(dt));
            }
            return arr;
        };
        let days = getDaysArray(newTrip.startdate, newTrip.enddate);
        console.log("=-=-=-=-");
        console.log(days);
        var jsonData = {}
        for (let i = 0; i < days.length; i++) {
            var day = days[i];
            jsonData[day] = {
                activity1: "",
                activity2: "",
                activity3: ""
            }
        }
        console.log(jsonData);
        let itinerary = jsonData;
        let authorId = sessionUser._id;
        let tripId = newTrip._id;
        dispatch(itineraryActions.composeItinerary({itinerary, authorId, tripId}))
        // let ed = new Date(endDate);
        // let edMonth = Date.getMonth(ed);
        // console.log(edMonth);
        // console.log(Date.getMonth(startDate));
        // console.log(Date.getMonth(endDate));
        // dispatch(itineraryActions.composeItinerary({authorId}));
    }

    // function handleClearDates(e) {
    //     e.preventDefault();
    // }
    function checkItinerary() {
        console.log(newItinerary);
    }

    return (
        <>
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
                {errors.map(error => <p className="tripErrors">{error}</p>)}
                <button onClick={(e) => handleCreateTrip(e)}>Create</button>
                <button onClick={handleModalClose}>Cancel</button>
            </div>
            {/* <div className="tripHolder">
                <p className="tripText">Location: </p>
                <input className="tripInput" onChange={(e) => setLocation(e.target.value)} value={location}></input>
                <p className="tripText">Start Date: </p>
                <input className="tripInput" onChange={(e) => setStartDate(e.target.value)} value={startDate}></input>
                <p className="tripText">End Date: </p>
                <input className="tripInput" onChange={(e) => setEndDate(e.target.value)} value={endDate}></input>
                <div className="tripHolder2">
                    {errors.map(error => <p>error</p>)}
                    <button onClick={(e) => handleCreateTrip(e)} className='tripButton'>Create Trip</button>
                </div>
            </div> */}
            {newTrip === null || newTrip === undefined ? (
                <>
                </>
            ) : (
                <>
                    <div className="tripHolder">
                        <p>Your Trip</p>
                        <p>{newTrip.location}</p>
                        <p>{newTrip.startdate}</p>
                        <p>{newTrip.enddate}</p>
                        <button onClick={(e) => handleCreateItinerary(e)} className='tripButton'>Create Itinerary</button>
                    </div>
                    {newItinerary === null || newItinerary === undefined ? (
                        <>

                        </>
                    ) : (
                        <>
                            <div className="tripHolder">
                                <p>Your Itinerary</p>
                                <button onClick={(e) => checkItinerary(e)} className='tripButton'>Check Itinerary</button>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default MakeTrip;