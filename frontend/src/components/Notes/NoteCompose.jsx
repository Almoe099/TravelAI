import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNoteErrors, composeNote } from '../../store/notes';
import NoteBox from './NoteBox';
import './NoteCompose.css';

function NoteCompose () {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const author = useSelector(state => state.session.user);
  const newNote = useSelector(state => state.notes.new);
  const errors = useSelector(state => state.errors.notes);

  useEffect(() => {
    return () => dispatch(clearNoteErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(composeNote({ text })); 
    setText('');
  };

  const update = e => setText(e.currentTarget.value);

  return (
    <>
      <form className="compose-note" onSubmit={handleSubmit}>
        <input 
          type="textarea"
          value={text}
          onChange={update}
          placeholder="Write your note..."
          required
        />
        <div className="errors">{errors?.text}</div>
        <input type="submit" value="Submit" />
      </form>
      <div className="note-preview">
        <h3>Note Preview</h3>
        {text ? <NoteBox note={{text, author}} /> : undefined}
      </div>
      <div className="previous-note">
        <h3>Previous Note</h3>
        {newNote ? <NoteBox note={newNote} /> : undefined}
      </div>
    </>
  )
}

export default NoteCompose;
