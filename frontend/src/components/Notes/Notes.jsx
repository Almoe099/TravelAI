import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNoteErrors, fetchNotes, selectAllNotesArray } from '../../store/notes';
import NoteBox from './NoteBox';

function Notes () {
  const dispatch = useDispatch();
  const notes = useSelector(selectAllNotesArray);
  
  useEffect(() => {
    dispatch(fetchNotes());
    return () => dispatch(clearNoteErrors());
  }, [dispatch])

  if (notes.length === 0) return <div>There are no Notes</div>;
  
  return (
    <>
      <h2>All Notes</h2>
      {notes.map(note => (
        <NoteBox key={note._id} note={note} />
      ))}
    </>
  );
}

export default Notes;
