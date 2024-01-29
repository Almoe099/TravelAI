import { createSelector } from 'reselect';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_NOTES = "notes/RECEIVE_NOTES";
const RECEIVE_USER_NOTES = "notes/RECEIVE_USER_NOTES";
const RECEIVE_NEW_NOTE = "notes/RECEIVE_NEW_NOTE";
const RECEIVE_NOTE_ERRORS = "notes/RECEIVE_NOTE_ERRORS";
const CLEAR_NOTE_ERRORS = "notes/CLEAR_NOTE_ERRORS";

const receiveNotes = notes => ({
  type: RECEIVE_NOTES,
  notes
});

const receiveUserNotes = notes => ({
  type: RECEIVE_USER_NOTES,
  notes
});

const receiveNewNote = note => ({
  type: RECEIVE_NEW_NOTE,
  note
});

const receiveErrors = errors => ({
  type: RECEIVE_NOTE_ERRORS,
  errors
});

export const clearNoteErrors = errors => ({
    type: CLEAR_NOTE_ERRORS,
    errors
});

export const fetchNotes = () => async dispatch => {
  try {
    const res = await jwtFetch ('/api/notes');
    const notes = await res.json();
    dispatch(receiveNotes(notes));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchUserNotes = id => async dispatch => {
  try {
    const res = await jwtFetch(`/api/notes/user/${id}`);
    const notes = await res.json();
    dispatch(receiveUserNotes(notes));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const composeNote = data => async dispatch => {
  try {
    const res = await jwtFetch('/api/notes/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const note = await res.json();
    dispatch(receiveNewNote(note));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

const selectAllNotes = state => state.notes.all;
const selectUserNotes = state => state.notes.user;
export const selectAllNotesArray = createSelector(selectAllNotes, 
 (notes) => Object.values(notes) 
);
export const selectUserNotesArray = createSelector(selectUserNotes,
  (notes) => Object.values(notes)
);

const nullErrors = null;

export const noteErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_NOTE_ERRORS:
      return action.errors;
    case RECEIVE_NEW_NOTE:
    case CLEAR_NOTE_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const notesReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
  switch(action.type) {
    case RECEIVE_NOTES:
      return { ...state, all: action.notes, new: undefined};
    case RECEIVE_USER_NOTES:
      return { ...state, user: action.notes, new: undefined};
    case RECEIVE_NEW_NOTE:
      return { ...state, new: action.note};
    case RECEIVE_USER_LOGOUT:
      return { ...state, user: {}, new: undefined }
    default:
      return state;
  }
};

export default notesReducer;
