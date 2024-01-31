import { createSelector } from 'reselect';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const SELECT_ITINERARY = "itineraries/SELECT_ITINERARY";
const CREATE_ITINERARY = "itineraries/CREATE_ITINERARY";
const CREATE_SUGGESTIONS = "itineraries/CREATE_SUGGESTIONS";
const CLEAR_SELECTED = "itineraries/CLEAR_SELECTED";
const RECEIVE_ITINERARIES = "itineraries/RECEIVE_ITINERARIES";
const UPDATE_ITINERARY = "itineraries/UPDATE_ITINERARY";
const RECEIVE_ITINERARY = "itineraries/RECEIVE_ITINERARY";
const REMOVE_ITINERARY = "itineraries/REMOVE_ITINERARY";
const RECEIVE_ITINERARY_ERRORS = "itineraries/RECEIVE_ITINERARY_ERRORS";

const createItinerary = itinerary => ({
  type: CREATE_ITINERARY,
  itinerary
});
const createSuggestions = suggestions => ({
    type: CREATE_SUGGESTIONS,
    suggestions
})

const receiveItineraries = itineraries => ({
  type: RECEIVE_ITINERARIES,
  itineraries
});

const updatingItinerary = itinerary => ({
    type: UPDATE_ITINERARY,
    itinerary
  });
const receiveItinerary = itinerary => ({
  type: RECEIVE_ITINERARY,
  itinerary
});
const selectItinerary = itinerary => ({
    type: SELECT_ITINERARY,
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

const clearSelected = () => ({
    type: CLEAR_SELECTED
});

export const clearingSelected = () => async dispatch => {
    dispatch(clearSelected());
}

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
    const itineraries = await res.json();
    dispatch(receiveItineraries(itineraries))
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

export const selectingItinerary = (itinerary) => async dispatch => {
    console.log("====!");
    console.log(itinerary);
    dispatch(selectItinerary(itinerary));
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
    console.log("!=======!");
    console.log(itinerary);
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
        console.log("TEST");
        dispatch(updatingItinerary(itineraryData));
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

// CHATGPT STUFF
export const suggestActivities = (data) => async dispatch => {
    try {
        const res = await jwtFetch('/api/itineraries/GPT/activities', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        const suggestions = await res.json();
        dispatch(createSuggestions(suggestions));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};
export const suggestRestaurants = (data) => async dispatch => {
    try {
        const res = await jwtFetch('/api/itineraries/GPT/restaurants', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        const suggestions = await res.json();
        dispatch(createSuggestions(suggestions));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const generateItinerary = (data) => async dispatch => {
    try {
        // console.log(data);
        // console.log("DATA");
        const res = await jwtFetch('/api/itineraries/GPT', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        const itinerary = await res.json();
        dispatch(createItinerary(itinerary));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

const itinerariesReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    let newAll = Object.values({ ...state.all });
    console.log(newAll);

    switch(action.type) {
        case CREATE_SUGGESTIONS:
            return {...state, suggestions: action.suggestions}
        case SELECT_ITINERARY:
            return {...state, selected: action.itinerary}
        case CLEAR_SELECTED:
            return {...state, selected: null}
        case CREATE_ITINERARY:
            newAll.push(action.itinerary);
            return {
                ...state, all: newAll, new: action.itinerary, selected: action.itinerary
                };
        case RECEIVE_ITINERARIES:
            return {...state, all: action.itineraries, new: undefined}
        case RECEIVE_ITINERARY:
            newAll.push(action.itinerary);
            return {...state, all: newAll, user: action.itinerary._id, new: action.itinerary, selected: action.itinerary}
        case UPDATE_ITINERARY:
            // console.log("LOG");
            // console.log(action.itinerary);
            // console.log(action.itinerary.data);
            // console.log(action.itinerary.data.updatedItinerary);
            let i = newAll.findIndex((ele) => ele._id === action.itinerary.data.updatedItinerary._id);
            newAll[i] = action.itinerary.data.updatedItinerary;
            return {...state, all: newAll, user: action.itinerary.data.updatedItinerary._id, new: action.itinerary.data.updatedItinerary, selected: action.itinerary.data.updatedItinerary}
        
        case REMOVE_ITINERARY:
            let updatedAll = { ...state.all };
            let u2 = Object.entries(updatedAll).filter((entry) => entry[1]._id !== action.itineraryId);
            let updatedAll2 = Object.fromEntries(u2);

            return {
                ...state,
                all: updatedAll2
            };
        case RECEIVE_USER_LOGOUT:
            return { ...state, user: {}, new: undefined }
        default:
            return state;
    }
  };
  
  export default itinerariesReducer;