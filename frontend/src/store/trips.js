
import jwtFetch from './jwt';
const CREATE_TRIP = "trips/CREATE_TRIP";
const createTrip = trip => ({
    type: CREATE_TRIP,
    trip
  });


export const generateTrip = (data) => async dispatch => {
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
      default:
        return state;
    }
  };
  
  export default tripsReducer;