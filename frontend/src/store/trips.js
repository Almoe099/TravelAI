import { createSelector } from 'reselect';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const CREATE_TRIP = "trips/CREATE_TRIP";
const RECEIVE_TRIPS = "trips/RECEIVE_TRIPS";
const RECEIVE_TRIP = "trips/RECEIVE_TRIP";
const REMOVE_TRIP = "trips/REMOVE_TRIP";
const RECEIVE_TRIP_ERRORS = "trips/RECEIVE_TRIP_ERRORS";

const createTrip = trip => ({
  type: CREATE_TRIP,
  trip
});

const receiveTrips = trips => ({
  type: RECEIVE_TRIPS,
  trips
});

const receiveTrip = trip => ({
  type: RECEIVE_TRIP,
  trip
});

const removeTrip = tripId => ({
  type: REMOVE_TRIP,
  tripId
});

const receiveErrors = errors => ({
  type: RECEIVE_TRIP_ERRORS,
  errors
});

const selectAllTrips = state => state.trips.all;

export const selectAllTripsArray = createSelector(selectAllTrips, 
  (trips) => Object.values(trips) 
);

export const selectTrip = (tripId) => (state) => {
  return state.trips[tripId]
}


export const fetchTrips = () => async dispatch => {
  try {
    const res = await jwtFetch ('/api/trips');
    const trips = await res.json();
    dispatch(receiveTrips(trips))
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode == 400){
      dispatch(receiveErrors(resBody.errors))
    }
  }
}

export const fetchTrip = (tripId) => async dispatch => {
  try {
    const res = await jwtFetch (`/api/trips/${tripId}`);
    const trips = await res.json();
    dispatch(receiveTrip(trips))
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode == 400){
      return dispatch(receiveErrors(resBody.errors))
    }
  }
}


export const composeTrip = data => async dispatch => {
  try {
    const res = await jwtFetch('/api/trips/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const trip = await res.json();
    dispatch(receiveTrip(trip));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};


export const updateTrip = trip => async dispatch => {
  try {
    const res = await jwtFetch(`/api/trips/${trip.id}`, {
      method: 'PATCH',
      body: JSON.stringify(trip)
    });
    const tripData = await res.json();
    dispatch(receiveTrip(tripData));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const deleteTrip = tripId => async dispatch => {
  try {
    const res = await jwtFetch(`/api/trips/${tripId}`, {
      method: 'DELETE',
      body: JSON.stringify(tripId)
    });
    const tripData = await res.json();
    dispatch(removeTrip(tripData));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};




export const postTrip = (data) => async dispatch => {
    try {
        console.log(data);
        console.log("DATA");
        const res = await jwtFetch('/api/trips/', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        // console.log(res);
        // const trip = await res;
        const trip = await res.json();
        console.log(trip);
        console.log("DONE!");
        dispatch(createTrip(trip));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

const tripsReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    switch(action.type) {
      case CREATE_TRIP:
        state["trip"] = action.trip;
        return { ...state};
      case RECEIVE_TRIPS:
        return {...state, all: action.trips, new: undefined}
      case RECEIVE_TRIP:
        return {...state, user: action.trip.id, new: undefined}
      case REMOVE_TRIP:
        delete state[action.trip.id]
        return state
      case RECEIVE_USER_LOGOUT:
        return { ...state, user: {}, new: undefined }
      default:
        return state;
    }
  };
  
  export default tripsReducer;