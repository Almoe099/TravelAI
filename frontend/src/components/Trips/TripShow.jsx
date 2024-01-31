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
    const mySuggestions = useSelector(state => state.itineraries.suggestions);
    const myGeneration = useSelector(state => state.itineraries.generation);
    const [check, setCheck] = useState(false);
    const [options, setOptions] = useState(["", "", "", "", "", "", "", "", ""])
    const [suggestingA, setSuggestingA] = useState(false);
    const [suggestingR, setSuggestingR] = useState(false);
    const [generatingI, setGeneratingI] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(tripActions.fetchTrip(tripId));
        dispatch(itineraryActions.clearingSelected());
        dispatch(itineraryActions.clearingSuggestions());
        dispatch(itineraryActions.clearingGeneration());
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
            console.log(Object.values(mySuggestions));
            let mySuggestions2 = Object.values(mySuggestions);
            let newOptions = [];
            for (let i = 0; i < mySuggestions2.length; i++) {
                newOptions.push(mySuggestions2[i]);
            }
            setOptions(newOptions);
            if (suggestingA) {
                setSuggestingA(false);
            }
            if (suggestingR) {
                setSuggestingR(false);
            }
        }
    }, [mySuggestions])
    useEffect(() => {
        if (myGeneration !== null && myGeneration !== undefined) {
            console.log("GENERATION COMPLETE!!!");
            console.log(myGeneration);
            if (generatingI) {
                setGeneratingI(false);
                handleUpdateGeneratedItinerary();
            }
        }
    }, [myGeneration])

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
    function handleDeleteFromItinerary(e, myDay, myActivity) {
        e.preventDefault();
        // console.log("=======");
        let itinerary = Object.entries(myItinerary.itinerary);
        let used = false;
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (!used) {
                    if (itinerary[i][0] === myDay && Object.entries(itinerary[i][1])[j][1] === myActivity) {
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
        setSuggestingA(true);

        let location = myTrip.location;
        dispatch(itineraryActions.suggestActivities({location}));
    }
    function handleSuggestRestaurants(e) {
        e.preventDefault();
        console.log("SUGGESTING RESTAURANTS !!!");
        setSuggestingR(true);

        let location = myTrip.location;
        dispatch(itineraryActions.suggestRestaurants({location}));
    }
    function handleGenerateItinerary(e) {
        e.preventDefault();
        console.log("GENERATING ITINERARY !!!");
        setGeneratingI(true);

        let location = myTrip.location;
        let days = Object.keys(myItinerary.itinerary).length;
        // let days = myItinerary.itinerary 
        dispatch(itineraryActions.generateItinerary({location, days}));
    }
    function handleUpdateGeneratedItinerary() {
        let itinerary = Object.entries(myItinerary.itinerary);
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                let newDay = Object.assign(itinerary[i][1]);
                newDay = Object.entries(newDay);

                let myEntry = Object.values(myGeneration)[i];
                myEntry = Object.entries(myEntry);
                
                newDay[j][1] = myEntry[j][1];
                newDay = Object.fromEntries(newDay);
                itinerary[i][1] = newDay;
            }
        }
        itinerary = Object.fromEntries(itinerary);
        let author = sessionUser._id;
        let trip = myTrip._id;
        let id = myItinerary._id;
        dispatch(itineraryActions.updateItinerary({itinerary, author, trip, id}));
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
                                                    <button className="dayPlanDelete" onClick={(e) => handleDeleteFromItinerary(e, day[0], Object.values(day[1])[0])}>Delete</button>
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
                                                        <button className="dayPlanDelete" onClick={(e) => handleDeleteFromItinerary(e, day[0], Object.values(day[1])[1])}>Delete</button>
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
                                                        <button className="dayPlanDelete" onClick={(e) => handleDeleteFromItinerary(e, day[0], Object.values(day[1])[2])}>Delete</button>
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
            {suggestingA ? (
                <>
                    <button className='buttonG'>Suggesting...</button>
                </>
            ) : (
                <>
                    <button onClick={(e) => handleSuggestActivities(e)} className='button'>Suggest Activities</button>
                </>
            )}
            {suggestingR ? (
                <>
                    <button className='buttonG'>Suggesting...</button>
                </>
            ) : (
                <>
                    <button onClick={(e) => handleSuggestRestaurants(e)} className='button'>Suggest Restaurants</button>
                </>
            )}
            {generatingI ? (
                <>
                    <button className='buttonG'>Generating...</button>
                </>
            ) : (
                <>
                    <button onClick={(e) => handleGenerateItinerary(e)} className='button'>Generate Itinerary</button>
                </>
            )}
        </div>

        <div className='selectionContainer'>
          {/* Placeholder for TripOptions Component */}
          <ul className='optionList'>
          <li onClick={(e) => handleAddToItinerary(e, options[0])} className='option'>{options[0]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[1])} className='option'>{options[1]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[2])} className='option'>{options[2]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[3])} className='option'>{options[3]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[4])} className='option'>{options[4]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[5])} className='option'>{options[5]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[6])} className='option'>{options[6]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[7])} className='option'>{options[7]}</li>
          <li onClick={(e) => handleAddToItinerary(e, options[8])} className='option'>{options[8]}</li>
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
