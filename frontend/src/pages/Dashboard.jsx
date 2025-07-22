import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteList from "../Notes/NoteList";
import NoteEditor from "../Notes/NoteEditor";
import Navbar from "../Shared/Navbar"; // ✅ Import shared navbar
import { getNotes } from "../../services/noteService";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const allNotes = await getNotes();
        setNotes(allNotes);
      } catch (err) {
        console.error("Failed to fetch notes", err);
        navigate("/"); // Optional: redirect if not authenticated
      }
    };
    fetchNotes();
  }, [navigate]);

  const handleSave = (savedNote) => {
    if (selectedNote) {
      setNotes((prev) =>
        prev.map((note) => (note._id === savedNote._id ? savedNote : note))
      );
    } else {
      setNotes((prev) => [...prev, savedNote]);
    }
    setSelectedNote(null);
  };

  const handleDelete = (deletedNoteId) => {
    setNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
    setSelectedNote(null);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="main-content">
        <NoteList notes={notes} onSelectNote={setSelectedNote} />
        <NoteEditor
          selectedNote={selectedNote}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Dashboard;
