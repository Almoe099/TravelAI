import './TripShow.css'

const TripShow = () => {




    return (
        <div className='TripShowMainContainer'>

            <div className="TripShowContainer1">

                <div className="TripDetailsContainer">
                    <div className='TripInfoContainer'>

                        <div className='TripInfo'>
                        <div className='TripLocation'>
                            <h1>Trip Location</h1>
                        </div>

                        <div className='TripDate'>
                            <h1>Trip Date</h1>
                        </div>

                        </div>

                        <div className='TripButtonContainer'>

                            <button className='activityButton'>Activities</button>
                            <button className='restaurantButton'>Restaurants</button>
                            <button className='itineraryButton'>Generate Itinerary</button>

                        </div>

                    <div className='selectionContainer'>
                        {/* < TripOptions /> */}
                        <ul>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>
                            <div className='optionDiv'> 
                                <button className='plus'>+</button>
                                <li className='option'>hello</li>
                            </div>

                        </ul>
                    </div>

                    </div>
                </div>

                <div className="itineraryContainer">

                    <h1 className='intineraryH1'>Your Itinerary List</h1>
                    {/* <Itinerary /> */}
                    <ul className='itineraryList'>
                        <li className='dayList'> 
                        <div className='subHeader'>Day 1</div>
                        <p className='dayPlans'>wejfniuqwctub2hubrtvywyrxpboW8ECP8PYWT8IROEINAUVUCUTUAW8TUN0UW0UTCN9UWNU9W98TUV8BUW8T9VU8B9W</p>
                        </li>
                        <li className='dayList'> 
                        <div className='subHeader'>Day 1</div>
                        <p className='dayPlans'>wejfniuqwctub2hubrtvywyrxpboW8ECP8PYWT8IROEINAUVUCUTUAW8TUN0UW0UTCN9UWNU9W98TUV8BUW8T9VU8B9W</p>
                        </li>
                        <li className='dayList'> 
                        <div className='subHeader'>Day 1</div>
                        <p className='dayPlans'>wejfniuqwctub2hubrtvywyrxpboW8ECP8PYWT8IROEINAUVUCUTUAW8TUN0UW0UTCN9UWNU9W98TUV8BUW8T9VU8B9W</p>
                        </li>
                        <li className='dayList'> 
                        <div className='subHeader'>Day 1</div>
                        <p className='dayPlans'>wejfniuqwctub2hubrtvywyrxpboW8ECP8PYWT8IROEINAUVUCUTUAW8TUN0UW0UTCN9UWNU9W98TUV8BUW8T9VU8B9W</p>
                        </li>
                        <li className='dayList'> 
                        <div className='subHeader'>Day 1</div>
                        <p className='dayPlans'>wejfniuqwctub2hubrtvywyrxpboW8ECP8PYWT8IROEINAUVUCUTUAW8TUN0UW0UTCN9UWNU9W98TUV8BUW8T9VU8B9W</p>
                        </li>
                        <li className='dayList'> 
                        <div className='subHeader'>Day 1</div>
                        <p className='dayPlans'>wejfniuqwctub2hubrtvywyrxpboW8ECP8PYWT8IROEINAUVUCUTUAW8TUN0UW0UTCN9UWNU9W98TUV8BUW8T9VU8B9W</p>
                        </li>

                    </ul>
                </div>

            </div>

        </div>
    )

}

export default TripShow