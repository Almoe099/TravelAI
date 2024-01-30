import jwtFetch from './jwt';

const CREATE_TRIP = "trips/CREATE_TRIP";

const createTrip = trip => ({
    type: CREATE_TRIP,
    trip
});

export const postTrip = (data) => async dispatch => {
    try {
        const res = await jwtFetch('/api/trips/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const trip = await res.json();
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
            return { 
                ...state, 
                all: { ...state.all, [action.trip.id]: action.trip } // Assuming each trip has a unique 'id'
            };
        default:
            return state;
    }
};
  
export default tripsReducer;
