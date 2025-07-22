import { Link } from "react-router-dom";

const NoteCard = ({ note }) => {
  const formattedDate = new Date(note.updatedAt || note.date).toLocaleDateString();

  return (
    <Link to={`/note/${note._id}`} className="note-card">
      <h3>{note.title}</h3>
      <p dangerouslySetInnerHTML={{ __html: note.content.slice(0, 120) + "…" }} />
      <span className="note-date">{formattedDate}</span>
    </Link>
  );
};

export default NoteCard;