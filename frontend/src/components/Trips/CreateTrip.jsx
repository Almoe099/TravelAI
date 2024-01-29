import { useState, useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import OpenAI from "openai";

import './CreateTrip.css';
import { postTrip } from '../../store/trips';

// console.log(import.meta.env.VITE_SOME_KEY);
// let MY_KEY = import.meta.env.VITE_API_KEY;

// const openai = new OpenAI({ apiKey: MY_KEY, dangerouslyAllowBrowser: true });
// const openai = new OpenAI();

function CreateTrip() {
  const [response, setResponse] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [check, setCheck] = useState(null);

  const [name, setName] = useState("");
  const [weatherPref, setWeatherPref] = useState("");
  const [locationPref, setLocationPref] = useState("");
  const [interests, setInterests] = useState("");
  const [miscInfo, setMiscInfo] = useState("");
  const [prompt, setPrompt] = useState("");
  const [days, setDays] = useState(4);
  const [activitiesPerDay, setActivitiesPerDay] = useState(3);
  let myTrip = useSelector(state => state.trips.trip);

  const dispatch = useDispatch();

  useEffect(() => {
    if (myTrip !== null && myTrip !== undefined) {
        console.log("=============");
        console.log("=== TRIP ====");
        console.log(myTrip);
        console.log("=============");
        setItinerary(myTrip);
        // setResponse(myTrip);
    }
  }, [myTrip]);

  useEffect(() => {
    console.log("ITINERARY");
    console.log(itinerary);
  }, [itinerary])

  function checkStuff() {
      console.log("=====");
      console.log(itinerary);

      return "test";
  }

  function showItinerary() {


    return (
      <>
        <p className="textBold2">Your Trip</p>
        <div className='line2'></div>
        <p className="textBold">Location:</p>
        <p className="textNormal"> {itinerary.location}</p>
        <div className='line2'></div>
        <p className="textBold">Activities:</p>
        <div className='line3'></div>
        {console.log(itinerary.Activities)}
        {console.log(Object.entries(itinerary.Activities))}
        {Object.entries(itinerary.Activities).map((dayActivities) => 
        <>
          <div className='holder3'>
            <p className="textBold">{dayActivities[0]}</p>
            {Object.entries(dayActivities[1]).map((activity) => (
              <>
                <div className="holder2">
                  <p className="textNormal">{activity[0].charAt(0).toUpperCase() + activity[0].slice(1, -1) + " " + activity[0].slice(-1)}:</p>
                  <p className="textNormal2">{activity[1]}</p>
                </div>
                
              </>
            ))}
          </div>
        </>
        )}
      </>
    )
  }

  function generateResponse(e) {
    e.preventDefault();

    // console.log(days);
    // console.log(activitiesPerDay);

    if (check === null) {
        setCheck(true);
        //   main();
        let trip = {
            name: name, 
            weatherPref: weatherPref,
            locationPref: locationPref,
            interests: interests,
            miscInfo: miscInfo,
            days: days,
            activitiesPerDay: activitiesPerDay
        };
        dispatch(postTrip(trip));
    }
  }

  function clearTrip(e) {
    // setResponse(null);
    setCheck(null);
    setItinerary(null);
  }

  return (
    <div className="holder">
      <p className='header'>Hello from App!</p>

      <div className='line2'></div>
          <div className="holder2">
            <p className="textBoldB">Name:</p>
            <input className="tInput" onChange={(e) => setName(e.target.value)} value={name}></input>
          </div>
          <div className='line4'></div>
          <div className="holder2">
            <p className="textBoldB">Weather Preference:</p>
            <input className="tInput" onChange={(e) => setWeatherPref(e.target.value)} value={weatherPref}></input>
          </div>
          <div className='line4'></div>
          <div className="holder2">
            <p className="textBoldB">Location Preference:</p>
            <input className="tInput" onChange={(e) => setLocationPref(e.target.value)} value={locationPref}></input>
          </div>
          <div className='line4'></div>
          <div className="holder2">
            <p className="textBoldB">Your Interests:</p>
            <input className="tInput" onChange={(e) => setInterests(e.target.value)} value={interests}></input>
          </div>
          <div className='line4'></div>
          <div className="holder2">
            <p className="textBoldB">Other Misc Info:</p>
            <input className="tInput" onChange={(e) => setMiscInfo(e.target.value)} value={miscInfo}></input>
          </div>
          <div className='line4'></div>
          <div className='line2'></div>
          <div className="holder2">
            <p className="textBoldB">Number of Days For Trip</p>
            <input type="range" min="1" max="14" className="tInput" onChange={(e) => setDays(e.target.value)} value={days}></input>
            {days === "1" ? (
              <>
                <p className="textBoldB2">{days} Day</p>
              </>
            ) : (
              <>
                <p className="textBoldB2">{days} Days</p>
              </>
            )}
          </div>
          <div className='line4'></div>
          <div className="holder2">
            <p className="textBoldB">Number of Activities Per Day</p>
            <input type="range" min="1" max="5" className="tInput" onChange={(e) => setActivitiesPerDay(e.target.value)} value={activitiesPerDay}></input>
            {activitiesPerDay === "1" ? (
              <>
                <p className="textBoldB2">{activitiesPerDay} Activity</p>
              </>
            ) : (
              <>
                <p className="textBoldB2">{activitiesPerDay} Activities</p>
              </>
            )}
          </div>
          <div className='line4'></div>
          <div className='line2'></div>
          {check !== null && itinerary !== null ? (
            <>
              <button className="myButton" onClick={(e) => clearTrip(e)}>Clear Trip</button>
            </>
          ) : (
            <>
              <button className="myButton" onClick={(e) => generateResponse(e)}>Create Itinerary</button>
            </>
          )}
          <div className='line2'></div>
      {check !== null ? (
        <>
          {itinerary === null ? (
            <p className="textNormal">loading response. . .</p>
          ) : (
            <>
              <div className='line2'></div>
              <div className="line"></div>
              <div className='line2'></div>
              {showItinerary()}

              <div className='line2'></div>
              <div className="line"></div>
              <div className='line2'></div>
              <div className='holder2'>
                {/* <div className='holder4'>
                  <p className="textBoldS">ChatGPT Prompt (Raw)</p>
                  <p className="textNormalS">{prompt}</p>
                </div>
                <div className='holder4'>
                  <p className="textBoldS">ChatGPT Response (Raw)</p>
                  {/* <p className="textNormalS">{response}</p>
                </div> */}
              </div>
            </>
          )}
        </>
        ) : (
          <>
            {/* {showTester()} */}
          </>
        )}
    </div>
  )
}

export default CreateTrip;