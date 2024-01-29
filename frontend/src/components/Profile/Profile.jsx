import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserNotes, clearNoteErrors, selectUserNotesArray } from '../../store/notes';
import NoteBox from '../Notes/NoteBox';

function Profile () {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const userNotes = useSelector(selectUserNotesArray);
  
  useEffect(() => {
    dispatch(fetchUserNotes(currentUser._id));
    return () => dispatch(clearNoteErrors());
  }, [currentUser, dispatch]);

  if (userNotes.length === 0) {
    return <div>{currentUser.username} has no Notes</div>;
  } else {
    return (
      <>
        <h2>All of {currentUser.username}&apos;s Notes</h2>
        {userNotes.map(note => (
          <NoteBox
            key={note._id}
            note={note}
          />
        ))}
      </>
    );
  }
}

export default Profile;
