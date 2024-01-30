import { createSelector } from 'reselect';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const CREATE_ITINERARY = "trips/CREATE_ITINERARY";
const RECEIVE_ITINERARIES = "trips/RECEIVE_ITINERARIES";
const RECEIVE_ITINERARY = "trips/RECEIVE_ITINERARY";
const REMOVE_ITINERARY = "trips/REMOVE_ITINERARY";
const RECEIVE_ITINERARY_ERRORS = "trips/RECEIVE_ITINERARY_ERRORS";

const createItinerary = itinerary => ({
  type: CREATE_ITINERARY,
  itinerary
});

const receiveItineraries = itineraries => ({
  type: RECEIVE_ITINERARIES,
  itineraries
});

const receiveItinerary = itinerary => ({
  type: RECEIVE_ITINERARY,
  itinerary
});

const removeItinerary = itineraryId => ({
  type: REMOVE_ITINERARY,
  itineraryId
});

const receiveErrors = errors => ({
  type: RECEIVE_ITINERARY_ERRORS,
  errors
});

// const selectAllItineraries = state => state.itineraries.all;

// export const selectAllItinerariesArray = createSelector(selectAllItineraries, 
//   (itineraries) => Object.values(itineraries) 
// );

// export const selectTrip = (itineraryId) => (state) => {
//   return state.itineraries[itineraryId]
// }


export const fetchItineraries = () => async dispatch => {
  try {
    const res = await jwtFetch ('/api/itineraries');
    const trips = await res.json();
    console.log("!!!");
    console.log(itineraries);
    dispatch(receiveTrips(trips))
  } catch (err) {
    const resBody = await err;
    if (resBody.statusCode == 400){
      dispatch(receiveErrors(resBody.errors))
    }
  }
}

export const fetchItinerary = (itineraryId) => async dispatch => {
  try {
    const res = await jwtFetch (`/api/itineraries/${itineraryId}`);
    const itinerary = await res.json();
    dispatch(receiveItinerary(itinerary))
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode == 400){
      return dispatch(receiveErrors(resBody.errors))
    }
  }
}


export const composeItinerary = data => async dispatch => {
  try {
    console.log("=======");
    console.log(data);
    const res = await jwtFetch('/api/itineraries/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const itinerary = await res.json();
    dispatch(createItinerary(itinerary));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};


export const updateItinerary = itinerary => async dispatch => {
  try {
    const res = await jwtFetch(`/api/itineraries/${itinerary.id}`, {
      method: 'PATCH',
      body: JSON.stringify(itinerary)
    });
    const itineraryData = await res.json();
    dispatch(receiveItinerary(itineraryData));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const deleteItinerary = itineraryId => async dispatch => {
  console.log(itineraryId);
    try {
    const res = await jwtFetch(`/api/itineraries/${itineraryId}`, {
      method: 'DELETE'
    //   body: JSON.stringify(tripId)
    });
        const itineraryData = await res.json();  // success
        dispatch(removeItinerary(itineraryId));
  } catch(err) {
    const resBody = await err;
    if (resBody.statusCode === 500) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const generateItinerary = (data) => async dispatch => {
    try {
        console.log(data);
        console.log("DATA");
        const res = await jwtFetch('/api/itineraries/GPT', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        const itinerary = await res.json();
        console.log(itinerary);
        console.log("DONE!");
        dispatch(createItinerary(itinerary));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

const itinerariesReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    switch(action.type) {
      case CREATE_ITINERARY:
        return {
            ...state, all: { ...state.all, [action.itinerary._id]: action.itinerary }, new: action.itinerary
            };
      case RECEIVE_ITINERARIES:
        return {...state, all: action.itineraries, new: undefined}
      case RECEIVE_ITINERARY:
        return {...state, user: action.itinerary.id, new: action.itinerary}
      case REMOVE_ITINERARY:
        // console.log("hit");
        // console.log(state.trips);
        // console.log(state.trips.all);
        // console.log(action.tripId);
        // delete state.trips.all[action.tripId];
        return state;
      case RECEIVE_USER_LOGOUT:
        return { ...state, user: {}, new: undefined }
      default:
        return state;
    }
  };
  
  export default itinerariesReducer;