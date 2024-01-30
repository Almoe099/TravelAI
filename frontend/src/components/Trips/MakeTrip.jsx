import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as tripActions from "../../store/trips.js"
import './MakeTrip.css'

function MakeTrip() {
    let [location, setLocation] = useState("USA");
    let [dates, setDates] = useState(["March 1", "March 2"]);
    let sessionUser = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    function handleCreateTrip(e) {
        e.preventDefault();
        let authorId = sessionUser._id;
        dispatch(tripActions.composeTrip({location, dates, authorId}));
    }

    return (
        <div className="holder4">
            <p>Location: </p>
            <p>Dates: </p>
            <button onClick={(e) => handleCreateTrip(e)} className='tripButton'>Create Trip</button>
        </div>

    )
}

export default MakeTrip;