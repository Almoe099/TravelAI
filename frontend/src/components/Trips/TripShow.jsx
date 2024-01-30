import React from 'react';
import './TripShow.css';

const TripShow = () => {
  return (
    <div className='TripShowMainContainer'>
      <div className="TripDetailsHalf">
        <div className='TripInfo'>
          <h1 className='TripLocation'>Trip Location</h1>
          <h1 className='TripDate'>Trip Date</h1>
        </div>

        <div className='TripButtonContainer'>
          <button className='button activityButton'>Suggest Activities</button>
          <button className='button restaurantButton'>Suggest Restaurants</button>
          <button className='button itineraryButton'>Generate Itinerary</button>
        </div>

        <div className='selectionContainer'>
          {/* Placeholder for TripOptions Component */}
          <ul className='optionList'>
            <li className='option'>Option 1</li>
            <li className='option'>Option 2</li>
            <li className='option'>Option 3</li>
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
            <h2 className='subHeader'>Day 1</h2>
            <p className='dayPlans'>Itinerary details for Day 1...</p>
          </li>
          {/* Additional days would be listed here */}
        </ul>
      </div>
    </div>
  );
};

export default TripShow;
