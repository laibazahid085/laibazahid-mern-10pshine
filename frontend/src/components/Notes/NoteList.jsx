import { useEffect, useState } from "react";
import axios from "axios";
import "./NoteList.css";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(response.data.notes); // Adjust based on backend response shape
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="note-list">
      <h2>Your Notes</h2>
      {error && <p className="error-msg">{error}</p>}

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoteList;
