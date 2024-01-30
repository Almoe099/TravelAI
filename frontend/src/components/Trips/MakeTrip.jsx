import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as tripActions from "../../store/trips.js"
import './MakeTrip.css'

function MakeTrip() {
    let [location, setLocation] = useState("");
    let [startDate, setStartDate] = useState("");
    let [endDate, setEndDate] = useState("");
    let [newDate, setNewDate] = useState("");
    let sessionUser = useSelector(state => state.session.user);
    let newTrip = useSelector(state => state.trips.new);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(newTrip);
    }, [newTrip])

    function handleCreateTrip(e) {
        e.preventDefault();
        let authorId = sessionUser._id;
        let startdate = startDate;
        let enddate = endDate;
        dispatch(tripActions.composeTrip({location, startdate, enddate, authorId}));
    }

    function handleClearDates(e) {
        e.preventDefault();
    }

    return (
        <>
            <div className="tripHolder">
                <p className="tripText">Location: </p>
                <input className="tripInput" onChange={(e) => setLocation(e.target.value)} value={location}></input>
                <p className="tripText">Dates: </p>
                {/* {dates.map((date) => 
                    <p className="tripText" key={date.toString()}>{date.toString()}</p>
                )} */}
                <input className="tripInput" onChange={(e) => setNewDate(e.target.value)} value={newDate}></input>
                <div className="tripHolder2">
                    {/* <button onClick={(e) => handleAddDate(e)} className='tripButton'>Add Date</button> */}
                    {/* <button onClick={(e) => handleClearDates(e)} className='tripButton'>Clear Dates</button> */}
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
                        <p></p>
                    </div>
                </>
            )}
        </>
    )
}

export default MakeTrip;