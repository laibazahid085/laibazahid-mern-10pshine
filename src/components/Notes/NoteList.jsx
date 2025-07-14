import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteCard from "./NoteCard";
import { fetchNotes } from "../../services/noteService";
import "./Notes.css";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await fetchNotes();         // real API call
        setNotes(res.data);                     // assumes backend returns an array
      } catch (err) {
        setError(err.response?.data?.message || "Could not load notes");
      } finally {
        setLoading(false);
      }
    };
    getNotes();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading notes…</p>;
  if (error)   return <p className="error" style={{ textAlign: "center" }}>{error}</p>;
  if (!notes.length) return (
    <div className="notes-container">
      <h2 className="notes-title">📝 Your Notes</h2>
      <p>No notes yet. Click the button below to create one!</p>
      <button
        className="primary-btn create-btn"
        onClick={() => navigate("/note/new")}
      >
        + Create New Note
      </button>
    </div>
  );

  return (
    <div className="notes-container">
      <h2 className="notes-title">📝 Your Notes</h2>

      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>

      <button
        className="primary-btn create-btn"
        onClick={() => navigate("/note/new")}
      >
        + Create New Note
      </button>
    </div>
  );
};

export default NoteList;
