import React from 'react';
import './TripShow.css';
import { FaPlus } from 'react-icons/fa';

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
          <li className='option'><FaPlus className='addIcon' /> Option 1</li>
          <li className='option'><FaPlus className='addIcon' /> Option 2</li>
          <li className='option'><FaPlus className='addIcon' /> Option 3</li>
          <li className='option'><FaPlus className='addIcon' /> Option 4</li>
          <li className='option'><FaPlus className='addIcon' /> Option 5</li>
          <li className='option'><FaPlus className='addIcon' /> Option 6</li>
          <li className='option'><FaPlus className='addIcon' /> Option 7</li>
          <li className='option'><FaPlus className='addIcon' /> Option 8</li>
          <li className='option'><FaPlus className='addIcon' /> Option 9</li>
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
            <h2 className='subHeader'>Day 2</h2>
            <p className='dayPlans'>Itinerary details for Day 2...</p>
            <h2 className='subHeader'>Day 3</h2>
            <p className='dayPlans'>Itinerary details for Day 3...</p>
            <h2 className='subHeader'>Day 4</h2>
            <p className='dayPlans'>Itinerary details for Day 4...</p>
            <h2 className='subHeader'>Day 5</h2>
            <p className='dayPlans'>Itinerary details for Day 5...</p>
          </li>
          {/* Additional days would be listed here */}
        </ul>
      </div>
    </div>
  );
};

export default TripShow;
