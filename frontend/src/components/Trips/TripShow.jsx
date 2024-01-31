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
    const mySuggestions = useSelector(state => state.itineraries.suggestions)
    const [check, setCheck] = useState(false);
    const [option1, setOption1] = useState("option 1");
    const [option2, setOption2] = useState("option 2");
    const [option3, setOption3] = useState("option 3");
    const [option4, setOption4] = useState("option 4");
    const [option5, setOption5] = useState("option 5");
    const [option6, setOption6] = useState("option 6");
    const [option7, setOption7] = useState("option 7");
    const [option8, setOption8] = useState("option 8");
    const [option9, setOption9] = useState("option 9");

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
            // console.log("MY ITINERARY");
            // console.log(myItinerary);
        }
    }, [myItinerary])
    useEffect(() => {
        if (mySuggestions !== null && mySuggestions !== undefined) {
            console.log(mySuggestions);
        }
    }, [mySuggestions])

    function findItineraryByTripId(tripId) {
        let itineraries2 = [];
        for (let i = 0; i < itineraries.length; i++) {
            if (itineraries[i].trip !== null && itineraries[i].trip !== undefined) {
                if (itineraries[i].trip._id === tripId) {
                    itineraries2.push(itineraries[i]);
                }
            }
        }
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
    function handleAddToItinerary(e, myActivity){
        e.preventDefault();
        // console.log("=======");
        // console.log("START ITINERARY");
        // console.log(myItinerary.itinerary);
        let itinerary = Object.entries(myItinerary.itinerary);
        let used = false;
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (!used) {
                    // console.log("=======");
                    // console.log(Object.entries(itinerary[i][1]));
                    // console.log(Object.entries(itinerary[i][1])[j]);
                    // console.log(Object.entries(itinerary[i][1])[j][1]);
                    if (Object.entries(itinerary[i][1])[j][1] === "") {
                        // set.
                        let newDay = Object.assign(itinerary[i][1]);
                        newDay = Object.entries(newDay);
                        newDay[j][1] = myActivity;
                        newDay = Object.fromEntries(newDay);
                        itinerary[i][1] = newDay;
                        used = true;
                    }
                }
            }
        }
        // console.log("=======");
        // console.log("END ITINERARY");
        itinerary = Object.fromEntries(itinerary);
        // console.log(itinerary);
        let author = sessionUser._id;
        let trip = myTrip._id;
        let id = myItinerary._id
        dispatch(itineraryActions.updateItinerary({itinerary, author, trip, id}));
    }
    function handleDeleteFromItinerary(e, myActivity) {
        e.preventDefault();
        let itinerary = Object.entries(myItinerary.itinerary);
        let used = false;
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (!used) {
                    if (Object.entries(itinerary[i][1])[j][1] === myActivity) {
                        // set.
                        let newDay = Object.assign(itinerary[i][1]);
                        newDay = Object.entries(newDay);
                        newDay[j][1] = "";
                        newDay = Object.fromEntries(newDay);
                        itinerary[i][1] = newDay;
                        used = true;
                    }
                }
            }
        }
        itinerary = Object.fromEntries(itinerary);
        let author = sessionUser._id;
        let trip = myTrip._id;
        let id = myItinerary._id
        dispatch(itineraryActions.updateItinerary({itinerary, author, trip, id}));
    }
    function handleClearItinerary(e) {
        e.preventDefault();
        let itinerary = Object.entries(myItinerary.itinerary);
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (Object.entries(itinerary[i][1])[j][1] !== "") {
                    // set.
                    let newDay = Object.assign(itinerary[i][1]);
                    newDay = Object.entries(newDay);
                    newDay[j][1] = "";
                    newDay = Object.fromEntries(newDay);
                    itinerary[i][1] = newDay;
                }
            }
        }
        itinerary = Object.fromEntries(itinerary);
        let author = sessionUser._id;
        let trip = myTrip._id;
        let id = myItinerary._id;
        dispatch(itineraryActions.updateItinerary({itinerary, author, trip, id}));
    }
    function handleSuggestActivities(e) {
        e.preventDefault();
        console.log("SUGGESTING ACTIVITIES !!!");

        let location = myTrip.location;
        dispatch(itineraryActions.suggestActivities({location}));
    }

    function showItinerary() {
        if (myItinerary.itinerary === undefined) {
            return;
        }
        // console.log(myItinerary.itinerary);
        // console.log(Object.entries(myItinerary.itinerary));
        return (
            <>  
                {Object.entries(myItinerary.itinerary).map(day => 
                <>
                    <h2 className='subHeader'>{formatTripDate(day[0], "short")}</h2>
                    {checkIfHasPlans(day[1]) ? (
                        <>
                            <div className="dayPlanBox">
                                    {Object.values(day[1])[0] === "" ? (
                                        <>
                                        </>
                                    ) : (
                                        <>
                                            <div className="dayPlanHolder">
                                                <div className="dayPlanTextHolder">
                                                    <p className="dayPlans">{Object.values(day[1])[0]}</p>
                                                </div>
                                                <div className="dayPlanDeleteHolder">
                                                    <button className="dayPlanDelete" onClick={(e) => handleDeleteFromItinerary(e, Object.values(day[1])[0])}>Delete</button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {Object.values(day[1])[1] === "" ? (
                                            <>
                                            </>
                                        ) : (
                                            <>
                                                <div className="dayPlanHolder">
                                                    <div className="dayPlanTextHolder">
                                                        <p className="dayPlans">{Object.values(day[1])[1]}</p>
                                                    </div>
                                                    <div className="dayPlanDeleteHolder">
                                                        <button className="dayPlanDelete" onClick={(e) => handleDeleteFromItinerary(e, Object.values(day[1])[1])}>Delete</button>
                                                    </div>
                                                </div>
                                            </>
                                    )}
                                    {Object.values(day[1])[2] === "" ? (
                                            <>
                                            </>
                                        ) : (
                                            <>
                                                <div className="dayPlanHolder">
                                                    <div className="dayPlanTextHolder">
                                                        <p className="dayPlans">{Object.values(day[1])[2]}</p>
                                                    </div>
                                                    <div className="dayPlanDeleteHolder">
                                                        <button className="dayPlanDelete" onClick={(e) => handleDeleteFromItinerary(e, Object.values(day[1])[2])}>Delete</button>
                                                    </div>
                                                </div>
                                            </>
                                    )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="dayPlanBox">
                                <div className="dayPlanHolder">
                                    <p className="dayPlansEmpty">No Plans Yet!</p>
                                </div>
                                <div className="dayPlanHolder">
                                    <p className="dayPlans"></p>
                                </div>
                                <div className="dayPlanHolder">
                                    <p className="dayPlans"></p>
                                </div>
                            </div>
                            
                        </>
                    )} 
                </>
                )}
            </>
        )
    }

    if (myTrip === null || myTrip === undefined) {
        // console.log("myTrip");
        return null;
    }
    if (myItinerary === null || myItinerary === undefined) {
        // console.log("myItinerary");
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
          <button onClick={(e) => handleSuggestActivities(e)} className='button activityButton'>Suggest Activities</button>
          <button className='button restaurantButton'>Suggest Restaurants</button>
          <button className='button itineraryButton'>Generate Itinerary</button>
        </div>

        <div className='selectionContainer'>
          {/* Placeholder for TripOptions Component */}
          <ul className='optionList'>
          <li onClick={(e) => handleAddToItinerary(e, option1)} className='option'>{option1}</li>
          <li onClick={(e) => handleAddToItinerary(e, option2)} className='option'>{option2}</li>
          <li onClick={(e) => handleAddToItinerary(e, option3)} className='option'>{option3}</li>
          <li onClick={(e) => handleAddToItinerary(e, option4)} className='option'>{option4}</li>
          <li onClick={(e) => handleAddToItinerary(e, option5)} className='option'>{option5}</li>
          <li onClick={(e) => handleAddToItinerary(e, option6)} className='option'>{option6}</li>
          <li onClick={(e) => handleAddToItinerary(e, option7)} className='option'>{option7}</li>
          <li onClick={(e) => handleAddToItinerary(e, option8)} className='option'>{option8}</li>
          <li onClick={(e) => handleAddToItinerary(e, option9)} className='option'>{option9}</li>
            {/* Additional options can be added here */}
          </ul>
        </div>
      </div>

      <div className="ItineraryHalf">
        <div className="ItineraryTopBar">
            <h1 className='yourItinerary'>Your Itinerary</h1>
            <div className="clearButtonHolder">
                <button onClick={(e) => handleClearItinerary(e)}className='clearButton'>Clear Itinerary</button>
            </div>
        </div>
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
