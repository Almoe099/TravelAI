import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as tripActions from "../../store/trips.js"
import './MakeTrip.css'

function MakeTrip() {
    let [location, setLocation] = useState("USA");
    let [dates, setDates] = useState([]);
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
        dispatch(tripActions.composeTrip({location, dates, authorId}));
    }

    function handleAddDate(e) {
        e.preventDefault();

        let arr2 = [];
        for (let i = 0; i < dates.length; i++) {
            arr2.push(dates[i]);
        }
        arr2.push(newDate);
        setDates(arr2);
        console.log(dates);
    }
    function handleClearDates(e) {
        e.preventDefault();

        setDates([]);
        console.log(dates);
    }

    return (
        <>
            <div className="tripHolder">
            <p className="tripText">Location: </p>
            <input className="tripInput" onChange={(e) => setLocation(e.target.value)} value={location}></input>
            <p className="tripText">Dates: </p>
            {dates.map((date) => 
                <p className="tripText" key={date.toString()}>{date.toString()}</p>
            )}
            <input className="tripInput" onChange={(e) => setNewDate(e.target.value)} value={newDate}></input>
            <div className="tripHolder2">
                <button onClick={(e) => handleAddDate(e)} className='tripButton'>Add Date</button>
                <button onClick={(e) => handleClearDates(e)} className='tripButton'>Clear Dates</button>
                <button onClick={(e) => handleCreateTrip(e)} className='tripButton'>Create Trip</button>
            </div>
            </div>
            <div className="tripHolder">


            </div>
        </>
    )
}

export default MakeTrip;