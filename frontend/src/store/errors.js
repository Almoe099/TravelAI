import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { noteErrorsReducer } from './notes';

export default combineReducers({
  session: sessionErrorsReducer,
  notes: noteErrorsReducer
});
