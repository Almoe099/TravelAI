
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './TripShow.css';
import * as tripActions from "../../store/trips";
import * as itineraryActions from "../../store/itineraries";
import gsap from 'gsap';
import Share from '../Share/Share';

import { FaPlus } from 'react-icons/fa';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';


const TripShow = () => {
    const { tripId } = useParams();
    const trip = useSelector(tripActions.selectTrip({tripId}))
    const sessionUser = useSelector(state => state.session.user);
    const myTrip = useSelector(state => state.trips.new);
    const myItinerary = useSelector(state => state.itineraries.selected);
    const itineraries = useSelector(state => state.itineraries.all);
    const mySuggestions = useSelector(state => state.itineraries.suggestions);
    const myGeneration = useSelector(state => state.itineraries.generation);
    const GPTErrors = useSelector(state => state.itineraries.GPTErrors);
    const [check, setCheck] = useState(false);
    const [options, setOptions] = useState(["", "", "", "", "", "", "", "", ""]);
    const [modalOpen, setModalOpen] = useState(null);
    const [suggestingA, setSuggestingA] = useState(false);
    const [suggestingR, setSuggestingR] = useState(false);
    const [generatingI, setGeneratingI] = useState(false);
    const [activeEdit, setActiveEdit] = useState([]);
    const [activeValue, setActiveValue] = useState("");
    const [shareModal, setShareModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [suggestionErrors, setSuggestionErrors] = useState([]);
    const closeModal = () => setIsModalOpen(false);
    const [clickListener, setClickListener] = useState(false);

    // prefs
    const [cuisineType, setCuisineType] = useState("");
    const [setting, setSetting] = useState("");
    const [mealType, setMealType] = useState("");
    const [interests, setInterests] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const [activity, setActivity] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch();

    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        // Trigger the fade-in effect after the component mounts
        setPageLoaded(true);
      }, []);



    useEffect(() => {
        // console.log("hit");
        dispatch(tripActions.fetchTrip(tripId));
        dispatch(itineraryActions.clearingSelected());
        dispatch(itineraryActions.clearingSuggestions());
        dispatch(itineraryActions.clearingGeneration());
        dispatch(itineraryActions.clearingChatGPTErrors());
        dispatch(itineraryActions.fetchItineraries());
        setCheck(false);
    }, [])

    // useEffect(() => {
    //     // console.log("hit");
    //     // dispatch(itineraryActions.clearingSuggestions());
    // }, [tripId])



    

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
        }
    }, [myItinerary])



    useEffect(() => {
        if (options.some(option => option.trim() !== "")) {
          // Animate the selectionContainer and its child li elements
          gsap.from('.selectionContainer', { opacity: 0, duration: 1, y: -50 });
          gsap.from('.option', { opacity: 0, duration: 1, y: -20, stagger: 0.2 });
        }
      }, [options]);

      


    useEffect(() => {
        // need to make sure we've cleared stuff before we load options.
        if (check) {
            if (mySuggestions !== null && mySuggestions !== undefined) {
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
        }
    }, [mySuggestions])

    useEffect(() => {
        if (myGeneration !== null && myGeneration !== undefined) {
            if (generatingI) {
                setGeneratingI(false);
                handleUpdateGeneratedItinerary();
            }
        }
    }, [myGeneration])

    useEffect(() => {
        if (modalOpen) {
            if (!clickListener) {
                // console.log(clickListener);
                document.addEventListener("click", handleHide, {capture: true});
                setClickListener(true);
            }
        } else {
        //   console.log(clickListener);
          document.removeEventListener("click", handleHide, {capture: true});
          setClickListener(false);
        }
    }, [modalOpen])
    
    const handleHide = useCallback((e) => {
        e.preventDefault();

        // console.log(`classname: ${e.target.className}`);
        // console.log(`id: ${e.target.id}`);

        if (!e.target.id.includes("modal") && !e.target.className.includes("modal")) {
            handleCloseModal(e);
            document.removeEventListener("click", handleHide, {capture: true});
            setClickListener(false);
        }
    }, [])

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
            dispatch(itineraryActions.selectingItinerary(itinerary));
        } else {
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
    function handleAddToItineraryModal(e, myActivity) {
        e.preventDefault();
        if (myActivity !== "") {
            setActivity(myActivity);
            setModalOpen("OPTIONS");
        }
    }
    function handleAddToItinerary(e, myActivity, myDate){
        e.preventDefault();

        let canPlace = false;

        let itinerary = Object.entries(myItinerary.itinerary);
        let used = false;

        // first, check if you have an empty spot to put something...
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (itinerary[i][0] === myDate) {
                    // set.
                    if (Object.entries(itinerary[i][1])[j][1] === "") {
                        canPlace = true;
                    }
                }
            }
        }

        if (!canPlace) {
            let error = "There are no open activity slots on this date."
            let myErrors = [];
            myErrors.push(error);
            setErrors(myErrors);
            return;
        }

        setErrors([]);
        setModalOpen(null);
        setActivity("");
        setDate("");

        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (!used) {
                    if (itinerary[i][0] === myDate && Object.entries(itinerary[i][1])[j][1] === "") {
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
        itinerary = Object.fromEntries(itinerary);
        let author = sessionUser._id;
        let trip = myTrip._id;
        let id = myItinerary._id
        dispatch(itineraryActions.updateItinerary({itinerary, author, trip, id}));
    }
    function handleDeleteFromItinerary(e, myDay, myActivity) {
        e.preventDefault();
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

    useEffect(() => {
        if (modalOpen !== null) {
            gsap.to("#profile-modal", { scale: 1, autoAlpha: 1, ease: "back.out(1.7)", duration: 0.5 });
        }
    }, [modalOpen]);
      
    const handleCloseModal = (e) => {
        e.preventDefault();
        setErrors([]);
        setSuggestionErrors([]);
        gsap.to("#profile-modal", { scale: 0.95, autoAlpha: 0, ease: "back.in(1.7)", duration: 0.5, onComplete: () => setModalOpen(null) });
    };

    function checkIfItineraryEmpty() {
        let activities = Object.values(myItinerary.itinerary);

        // console.log(myItinerary);
        // console.log(activities);
        for (let i = 0; i < activities.length; i++) {
            let plans = Object.values(activities[i]);
            // console.log(plans);
            for (let j = 0; j < plans.length; j++) {
                if (plans[j] !== "") {
                    // console.log(plans[j]);
                    // console.log(false);
                    return false;
                }
            }
        }
        // console.log(true);
        return true;
    }

    function handleSuggestActivitiesModal(e) {
        e.preventDefault();
        if (!suggestingA && !suggestingR && !generatingI) {
            if (modalOpen === null) {
                setModalOpen("ACTIVITIES");
            }
        }
    }
    function handleSuggestRestaurantsModal(e) {
        e.preventDefault();
        if (!suggestingA && !suggestingR && !generatingI) {
            if (modalOpen === null) {
                setModalOpen("RESTAURANTS");
            }
        }
    }
    function handleGenerateItineraryModal(e) {
        e.preventDefault();
        if (!suggestingA && !suggestingR && !generatingI) {
            if (modalOpen === null) {
                if (!checkIfItineraryEmpty()) {
                    setModalOpen("GENERATE");
                } else {
                    handleGenerateItinerary(e);
                }
            }
        }
    }
    function handleSuggestActivities(e, isSpecific) {
        e.preventDefault();

        if (!suggestingA && !suggestingR && !generatingI) {
            // console.log("chatgpt");
            let location = myTrip.location;
            if (isSpecific) {
                let myErrors = [];
                if (timeOfDay === "") {
                    myErrors.push("Please input a time of day");
                }
                if (interests === "") {
                    myErrors.push("Please input your interests");
                }
                if (myErrors.length > 0) {
                    setSuggestionErrors(myErrors);
                } else {
                    setSuggestingA(true);
                    setModalOpen(null);
                    setSuggestionErrors([]);
                    dispatch(itineraryActions.suggestActivities({location, timeOfDay, interests}));
                }
            } else {
                setSuggestingA(true);
                setModalOpen(null);
                setSuggestionErrors([]);
                dispatch(itineraryActions.suggestActivities({location}));
            }
        }
    }

    function handleSuggestRestaurants(e, isSpecific) {
        e.preventDefault();

        if (!suggestingA && !suggestingR && !generatingI) {
            // console.log("chatgpt");
            let location = myTrip.location;
            if (isSpecific) {
                let myErrors = [];
                if (mealType === "") {
                    myErrors.push("Please input a meal type");
                }
                if (setting === "") {
                    myErrors.push("Please input your setting");
                }
                if (cuisineType === "") {
                    myErrors.push("Please input a cuisine type")
                }

                if (myErrors.length > 0) {
                    setSuggestionErrors(myErrors);
                } else {
                    setSuggestingR(true);
                    setModalOpen(null);
                    setSuggestionErrors([]);
                    dispatch(itineraryActions.suggestRestaurants({location, mealType, setting, cuisineType}));
                }
            } else {
                setSuggestingR(true);
                setModalOpen(null);
                setSuggestionErrors([]);
                dispatch(itineraryActions.suggestRestaurants({location}));
            }
        }
    }
    function handleGenerateItinerary(e) {
        e.preventDefault();
        
        if (!suggestingA && !suggestingR && !generatingI) {
            // console.log("chatgpt");
            setGeneratingI(true);
            setModalOpen(null);
            handleClearItinerary(e);

            let location = myTrip.location;
            let days = Object.keys(myItinerary.itinerary).length;
            // let days = myItinerary.itinerary 

            
            dispatch(itineraryActions.generateItinerary({location, days}));
        }
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
    function handleEditFromItinerary(e, myDay, myActivity, myIndex) {
        e.preventDefault();
        setActiveEdit([myDay, myActivity, myIndex]);
        setActiveValue(myActivity);
    }

    function handleSaveToItinerary(e) {
        e.preventDefault();
        let itinerary = Object.entries(myItinerary.itinerary);
        let used = false;
        for (let i = 0; i < itinerary.length; i++) {
            for (let j = 0; j < Object.entries(itinerary[i][1]).length; j++) {
                if (!used) {
                    if (itinerary[i][0] === activeEdit[0] && Object.entries(itinerary[i][1])[j][1] === activeEdit[1]) {
                        // set.
                        let newDay = Object.assign(itinerary[i][1]);
                        newDay = Object.entries(newDay);
                        newDay[j][1] = activeValue;
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
        let id = myItinerary._id;
        setActiveEdit([]);
        setActiveValue("");
        dispatch(itineraryActions.updateItinerary({itinerary, author, trip, id}));
    }

    function checkForActiveEdit(myDay, myActivity, myIndex) {
        if (activeEdit[0] === myDay) {
            if (activeEdit[1] === myActivity) {
                if (activeEdit[2] === myIndex) {
                    return true;
                }
            }
        }
        return false;
    }
    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
    }
    function removeComma(str1) {
        return str1;
    }

    function getShareText() {
        let paragraph = `${Object.entries(myItinerary.itinerary).map(day => 
            `\n${formatTripDate(day[0], "long")} : 
            ${Object.values(day[1]).map(newActivity => `\n${newActivity}`).join("")}\n`
            ).join("")}\n\n`
        return `Hey!  Checkout my trip to ${myItinerary.trip.location}.  Here's what I'm planning on doing:  \n${paragraph}`
    }

    const handleShareTrip = () => {
        setShareModal(true)
    }

    const handleMessage = () => {

        return JSON.stringify(myItinerary)
    }


    function showItinerary() {
        if (myItinerary.itinerary === undefined) {
            return;
        }

        return (
            <>
            {Object.entries(myItinerary.itinerary).map(day => (
                <div key={day[0]}>
                    <h2 className='subHeader'>{formatTripDate(day[0], "short")}</h2>
                    <div className="dayPlanBox">
                        {Object.entries(day[1]).map(([time, activity], index) => (
                            <div className="dayPlanHolder" key={time}>
                                {activity === "" ? (
                                    checkForActiveEdit(day[0], activity, index) ? (
                                        <>
                                            <div className="dayPlanTextHolder">
                                                <input className="dayPlanInput" type="text" onChange={(e) => setActiveValue(e.target.value)} value={activeValue}></input>
                                            </div>
                                            <div className="dayPlanH2">
                                            <button onClick={(e) => handleSaveToItinerary(e, day[0], activeValue, time)} className="dayPlanSave">Save</button>
                                            </div>
                                        </>
                                    ) : (
                                        <button className="dayPlanPlus" onClick={(e) => handleEditFromItinerary(e, day[0], activity, index)}>Add Event</button>
                                    )
                                ) : (
                                    checkForActiveEdit(day[0], activity, index) ? (
                                        <>
                                            <div className="dayPlanTextHolder">
                                                <input className="dayPlanInput" type="text" onChange={(e) => setActiveValue(e.target.value)} value={activeValue}></input>
                                            </div>
                                            <div className="dayPlanH2">
                                                <button onClick={(e) => handleSaveToItinerary(e, day[0], activeValue, time)} className="dayPlanSave">Save</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="dayPlanTextHolder">
                                                <p className="dayPlans">{activity}</p>
                                            </div>
                                            <div className="dayPlanH">
                                            <button className="icon-button-edit" onClick={(e) => handleEditFromItinerary(e, day[0], activity, index)}>
    <FaEdit />
</button>
<button className="icon-button-delete" onClick={(e) => handleDeleteFromItinerary(e, day[0], activity, time)}>
    <FaTrash />
</button>
                                            </div>
                                        </>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
        
        )
    }

    if (myTrip === null || myTrip === undefined) {
        return null;
    }
    if (myItinerary === null || myItinerary === undefined) {
        return null;
    }

    function settingDate(e) {
        e.preventDefault();
        setDate(e.target.value);
    }
  return (
    <>
        {modalOpen !== null && (
            <>
                {(modalOpen === "ACTIVITIES" || modalOpen === "RESTAURANTS") ? (
                    <>
                        {modalOpen === "ACTIVITIES" ? (
                            <>
                                <div id="profile-modal">
                                    <p className='pModalText' id="modal-ele">Input Your Activity Preferences...</p>
                                    
                                    {suggestionErrors.length > 0 ? (
                                        <>
                                            {suggestionErrors.map(error => <p className="tripErrors" id="modal-ele">{error}</p>)}
                                        </>
                                    ) : (
                                        <>

                                        </>
                                    )}
                                    <div className="modalLine" id="modal-ele"></div>
                                    <label id="modal-ele">
                                        Interests:
                                        <input type="text" id="modal-ele" onChange={(e) => setInterests(e.target.value)} value={interests} />
                                    </label>
                                    <label id="modal-ele">
                                        Time of Day:
                                        <input type="text" id="modal-ele" onChange={(e) => setTimeOfDay(e.target.value)} value={timeOfDay} />
                                    </label>
                                    
                                    <button id="modal-ele" onClick={(e) => handleSuggestActivities(e, true)}>Suggest With These Preferences</button>
                                    <button id="modal-ele" onClick={(e) => handleSuggestActivities(e, false)}>Suggest Popular Activities</button>
                                    {/* <button onClick={(e) => handleSuggestActivities(e, false)}>Skip</button> */}
                                    <button id="modal-ele" onClick={(e) => handleCloseModal(e)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div id="profile-modal">
                                    <p className='pModalText' id="modal-ele">Input Your Restaurant Preferences...</p>
                                    {suggestionErrors.length > 0 ? (
                                        <>
                                            {suggestionErrors.map(error => <p className="tripErrors" id="modal-ele">{error}</p>)}
                                        </>
                                    ) : (
                                        <>

                                        </>
                                    )}
                                    <div className="modalLine" id="modal-ele"></div>
                                    <label id="modal-ele">
                                        Type of Cuisine:
                                        <input type="text" id="modal-ele" onChange={(e) => setCuisineType(e.target.value)} value={cuisineType} />
                                    </label>
                                    <label id="modal-ele">
                                        Ambiance / Setting: 
                                        <input type="text" id="modal-ele" onChange={(e) => setSetting(e.target.value)} value={setting} />
                                    </label>
                                    <label id="modal-ele">
                                        Meal Type:
                                        <input type="text" id="modal-ele" onChange={(e) => setMealType(e.target.value)} value={mealType} />
                                    </label>
                                    
                                    <button id="modal-ele" onClick={(e) => handleSuggestRestaurants(e, true)}>Suggest With These Preferences</button>
                                    <button id="modal-ele" onClick={(e) => handleSuggestRestaurants(e, false)}>Suggest Popular Restaurants</button>
                                    <button id="modal-ele" onClick={(e) => handleCloseModal(e)}>Cancel</button>
                                </div>
                            </>
                        )}
                    </>
                    
                ) : (
                    <>
                        {modalOpen === "OPTIONS" ? (
                            <>
                                <div id="profile-modal">
                                    <p className='pModalText' id="modal-ele">Select A Day.</p>
                                    <div className="modalLine" id="modal-ele"></div>
                                    <div className="selectHolder" id="modal-ele">
                                        <select name="dates" className="modal-ele" id="date-select" onChange={(e) => settingDate(e, this)}>
                                            <option id="modal-ele" value="">--Please choose an option--</option>
                                            {Object.keys(myItinerary.itinerary).map(myDate => 
                                                <option id="modal-ele" value={myDate}>{formatTripDate(myDate, "short")}</option>
                                            )}
                                        </select>
                                    </div>
                                    {errors.map(error => <p className="tripErrors" id="modal-ele">{error}</p>)}
                                    <button id="modal-ele" onClick={(e) => handleAddToItinerary(e, activity, date)}>Accept</button>
                                    {/* <button onClick={(e) => handleSuggestActivities(e, false)}>Skip</button> */}
                                    <button id="modal-ele" onClick={(e) => handleCloseModal(e)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                {modalOpen === "GENERATE" ? (
                                    <>
                                        <div id="profile-modal">
                                            <p className='pModalText' id="modal-ele">Clicking Accept will clear your itinerary and fill out a new one for you.  Do you want to proceed?</p>
                                            <div className="modalLine" id="modal-ele"></div>
                                            {/* <div className="selectHolder" id="modal-ele">
                                                <select name="dates" className="modal-ele" id="date-select" onChange={(e) => settingDate(e, this)}>
                                                    <option id="modal-ele" value="">--Please choose an option--</option>
                                                    {Object.keys(myItinerary.itinerary).map(myDate => 
                                                        <option id="modal-ele" value={myDate}>{formatTripDate(myDate, "short")}</option>
                                                    )}
                                                </select>
                                            </div> */}
                                            {/* {errors.map(error => <p className="tripErrors" id="modal-ele">{error}</p>)} */}
                                            <button id="modal-ele" onClick={(e) => handleGenerateItinerary(e)}>Accept</button>
                                            {/* <button onClick={(e) => handleSuggestActivities(e, false)}>Skip</button> */}
                                            <button id="modal-ele" onClick={(e) => handleCloseModal(e)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
            
        )}
    
    <div className={`TripShowMainContainer ${pageLoaded ? 'fadeInUpAnimation' : ''}`}>
      <div className="TripDetailsHalf">
        <div className='TripInfo'>
          <h1 className='TripLocation'>Trip Location: {myTrip.location}</h1>
          <h1 className='TripDate'>Trip Dates: {formatTripDate(myTrip.startdate, "long")} - {formatTripDate(myTrip.enddate, "long")} </h1>
        </div>

        <div className='TripButtonContainer'>
            {suggestingA ? (
                <div className='buttonG' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loaderDiv">
                        <p className="loaderText">Suggesting</p>
                        <div className="loader"></div>
                    </div>
                </div>
            ) : (
                <>
                    <button onClick={(e) => handleSuggestActivitiesModal(e)} className='button'>Suggest Activities</button>
                </>
            )}
            {suggestingR ? (
                <div className='buttonG' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loaderDiv">
                        <p className="loaderText">Suggesting</p>
                        <div className="loader"></div>
                    </div>
                </div>
            ) : (
                <>
                    <button onClick={(e) => handleSuggestRestaurantsModal(e)} className='button'>Suggest Restaurants</button>
                </>
            )}
            {generatingI ? (
                <div className='buttonG' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loaderDiv">
                        <p className="loaderText">Generating</p>
                        <div className="loader"></div>
                    </div>
                </div>
            ) : (
                <>
                    <button onClick={(e) => handleGenerateItineraryModal(e)} className='button'>Generate Itinerary</button>
                </>
            )}
        </div>

        <div className='selectionContainer'>
    {(GPTErrors === undefined || GPTErrors === null) ? (
        <>
        </>
    ) : (
        <>
            <p className="tripErrors">{GPTErrors}</p>
        </>
    )}
  {options.some(option => option.trim() !== "") && (
    <ul className='optionList'>
      {options.map((option, index) => 
        option.trim() !== "" && (
          <li key={index} onClick={(e) => handleAddToItineraryModal(e, option)} onDrop={(ev) => drop(ev)} className='option' draggable="true">
            <FaPlus className="addIcon" /> {option}
          </li>
        )
      )}
    </ul>
  )}
</div>

      </div>

      <div className="ItineraryHalf">
        <div className="ItineraryTopBar">
            
            <h1 className='yourItinerary'>Your Itinerary</h1>
            <div className="shareclearbuttonHolder">
      {/* <button onClick={(e) => handleShareTrip(e)} className='clearButton'>Share My Trip</button> */}
      
          <Share
            url={`https://travelaiapp.onrender.com/`}
            title="Upcoming Trip Details"
            text={getShareText()}
            onClose={closeModal}
            className="clearButton"
          />
      <button onClick={(e) => handleClearItinerary(e)} className='clearButton'>Clear Itinerary</button>
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
    </>
  );
};

export default TripShow;
