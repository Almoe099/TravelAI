import './NoteBox.css';

function NoteBox ({ note: { text, author }}) {
  const { username } = author;
  return (
    <div className="note">
      <h3>{username}</h3>
      <p>{text}</p>
    </div>
  );
}

export default NoteBox;
