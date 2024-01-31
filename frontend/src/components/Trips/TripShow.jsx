import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './TripShow.css';
import * as tripActions from "../../store/trips";
import * as itineraryActions from "../../store/itineraries";

// import { FaPlus } from 'react-icons/fa';

const TripShow = () => {
    const { tripId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const myTrip = useSelector(state => state.trips.new);
    const myItinerary = useSelector(state => state.itineraries.selected);
    const itineraries = useSelector(state => state.itineraries.all);
    const [check, setCheck] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(tripActions.fetchTrip(tripId));
        dispatch(itineraryActions.clearingSelected());
        dispatch(itineraryActions.fetchItineraries());
        setCheck(false);
    }, [])
    useEffect(() => {
        if (itineraries !== null && itineraries !== undefined) {
            if (myTrip !== null && myTrip !== undefined) {
                if (myItinerary === null || myItinerary === undefined) {
                    if (check === false) {
                        setCheck(true);
                        findItineraryByTripId(tripId);
                    }
                }
            }
        }
    }, [itineraries])
    useEffect(() => {
        if (myItinerary !== null && myItinerary !== undefined) {
            console.log("MY ITINERARY");
            console.log(myItinerary);
        }
    }, [myItinerary])

    function findItineraryByTripId(tripId) {
        let itineraries1 = itineraries;
        let itineraries2 = itineraries1.filter((entry) => entry.trip._id === tripId);
        let itinerary = null;
        if (itineraries2.length >= 1) {
            itinerary = itineraries2[0];
        }
        if (itinerary !== null) {
            console.log("FOUND ITINERARY");
            dispatch(itineraryActions.selectingItinerary(itinerary));
        } else {
            console.log("COULD NOT FIND ITINERARY");
            handleCreateItinerary();
        } 
    }
    function formatTripDate(yourDate, length) {
        let yd = new Date(yourDate);
        let month = yd.toLocaleString('default', { month: 'long' });
        let day = yd.getDate();
        let year = yd.getFullYear();
        if (length === "long") {
            return `${month} ${day}, ${year}`;
        } else if (length === "short") {
            return `${month} ${day}`;
        }
    }
    // function deleteAll(){
    //     console.log("deleting...");
    //     for (let i = 0; i < itineraries.length; i++) {
    //         dispatch(itineraryActions.deleteItinerary(itineraries[i]._id));
    //     }
    // }
    // if you don't already have an itinerary, we're gonna make a blank one.
    function handleCreateItinerary() {
        // get list of dates
        var getDaysArray = function(start, end) {
            for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
                arr.push(new Date(dt));
            }
            return arr;
        };
        let days = getDaysArray(myTrip.startdate, myTrip.enddate);
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
        let author = sessionUser._id;
        let trip = myTrip._id;
        dispatch(itineraryActions.composeItinerary({itinerary, author, trip}))
    }
    function checkIfHasPlans(dayPlan) {
        let dayPlan2 = Object.values(dayPlan);
        for (let i = 0; i < dayPlan2.length; i++) {
            if (dayPlan2[i] !== "") {
                return true;
            }
        }
        return false;
    }

    function showItinerary() {
        // console.log(myItinerary.itinerary);
        console.log(Object.entries(myItinerary.itinerary));
        // Object.entries(myItinerary.itinerary).map((day) => {
        //     <h2 className='subHeader'>TEST</h2>
        // })
        return (
            <>  
                {Object.entries(myItinerary.itinerary).map(day => 
                <>
                    <h2 className='subHeader'>{formatTripDate(day[0], "short")}</h2>
                    {checkIfHasPlans(day[1]) ? (
                        <>
                            <p className="dayPlans">{Object.values(day[1])[0]}</p>
                            <p className="dayPlans">{Object.values(day[1])[1]}</p>
                            <p className="dayPlans">{Object.values(day[1])[2]}</p>
                        </>
                    ) : (
                        <>
                            <p className="dayPlans">No Plans Yet!</p>
                            <p className="dayPlans"></p>
                            <p className="dayPlans"></p>
                            
                        </>
                    )} 
                </>
                )}
            </>
        )
    }

    if (myTrip === null || myTrip === undefined) {
        console.log("myTrip");
        return null;
    }
    if (myItinerary === null || myItinerary === undefined) {
        console.log("myItinerary");
        return null;
    }

  return (
    <div className='TripShowMainContainer'>
      <div className="TripDetailsHalf">
        <div className='TripInfo'>
          <h1 className='TripLocation'>Trip Location: {myTrip.location}</h1>
          <h1 className='TripDate'>Trip Dates: {formatTripDate(myTrip.startdate, "long")} - {formatTripDate(myTrip.enddate, "long")} </h1>
        </div>

        <div className='TripButtonContainer'>
          <button className='button activityButton'>Suggest Activities</button>
          <button className='button restaurantButton'>Suggest Restaurants</button>
          <button className='button itineraryButton'>Generate Itinerary</button>
        </div>

        <div className='selectionContainer'>
          {/* Placeholder for TripOptions Component */}
          <ul className='optionList'>
          <li className='option'> Option 1</li>
          <li className='option'> Option 2</li>
          <li className='option'> Option 3</li>
          <li className='option'> Option 4</li>
          <li className='option'> Option 5</li>
          <li className='option'> Option 6</li>
          <li className='option'> Option 7</li>
          <li className='option'> Option 8</li>
          <li className='option'> Option 9</li>
            {/* Additional options can be added here */}
          </ul>
        </div>
      </div>

      <div className="ItineraryHalf">
        <h1 className='intineraryH1'>Your Itinerary</h1>
        {/* Placeholder for Itinerary Component */}
        <ul className='itineraryList'>
          {/* Iterate through itinerary data to generate this list */}
          <li className='dayList'> 
            {showItinerary()}
          </li>
          {/* Additional days would be listed here */}
        </ul>
      </div>
    </div>
  );
};

export default TripShow;
