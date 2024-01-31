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
    }, [])

    function handleCreateTrip(e) {
        e.preventDefault();
        let authorId = sessionUser._id;
        let startdate = startDate;
        let enddate = endDate;
        dispatch(tripActions.composeTrip({location, startdate, enddate, authorId}));
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

    function handleClearDates(e) {
        e.preventDefault();
    }
    function checkItinerary(e) {
        console.log(newItinerary);
    }

    return (
        <>
            <div className="tripHolder">
                <p className="tripText">Location: </p>
                <input className="tripInput" onChange={(e) => setLocation(e.target.value)} value={location}></input>
                <p className="tripText">Start Date: </p>
                <input className="tripInput" onChange={(e) => setStartDate(e.target.value)} value={startDate}></input>
                <p className="tripText">End Date: </p>
                <input className="tripInput" onChange={(e) => setEndDate(e.target.value)} value={endDate}></input>
                <div className="tripHolder2">
                
                    <button onClick={(e) => handleCreateTrip(e)} className='tripButton'>Create Trip</button>
                </div>
            </div>
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