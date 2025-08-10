import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteEditor from "../components/Notes/NoteEditor";
import Navbar from "../components/Shared/Navbar";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const allNotes = await getNotes();
        setNotes(allNotes);
      } catch (err) {
        console.error("Failed to fetch notes", err);
        navigate("/");
      }
    };

    fetchNotes();

    const name = localStorage.getItem("newlySignedUpUser");
    if (name) {
      toast.success(`🎉 Welcome, ${name}!`, {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("newlySignedUpUser");
    }
  }, [navigate]);

  const handleSave = async (noteData) => {
    try {
      if (selectedNote) {
        const updated = await updateNote(selectedNote._id, noteData);
        setNotes((prev) =>
          prev.map((note) => (note._id === updated._id ? updated : note))
        );
      } else {
        const newNote = await createNote(noteData);
        setNotes((prev) => [newNote, ...prev]);
      }
      setSelectedNote(null);
      setIsCreating(false);
      setShowSavedNotes(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setSelectedNote(null);
      setIsCreating(false);
      setShowSavedNotes(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note || null);
    setShowSavedNotes(false);
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsCreating(true);
    setShowSavedNotes(false);
  };

  return (
    <div className="dashboard-container">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notes={notes}
        onSelectNote={handleNoteSelect}
        setShowSavedNotes={setShowSavedNotes}
      />

      <div className="main-content">
        <div className="scrollable-area">
          {showSavedNotes && (
            <div className="saved-notes-container">
              {notes.length > 0 ? (
                <>
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="saved-note-card"
                      onClick={() => handleNoteSelect(note)}
                    >
                      <h3>{note.title || "Untitled"}</h3>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: note.content?.slice(0, 100) || "No content...",
                        }}
                      ></div>
                    </div>
                  ))}

                  {/* ✅ Always show this button below notes */}
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: "2rem",
                    }}
                  >
                    <button className="primary-btn" onClick={handleCreateNew}>
                      + Create New Note
                    </button>
                  </div>
                </>
              ) : (
                <p className="no-notes-msg">
                  No saved notes found. <br /> <br />
                  <button className="primary-btn" onClick={handleCreateNew}>
                    + Create New Note
                  </button>
                </p>
              )}
            </div>
          )}

          {!selectedNote && !isCreating && !showSavedNotes && (
            <div style={{ margin: "auto" }}>
              <button className="primary-btn" onClick={handleCreateNew}>
                + Create New Note
              </button>
            </div>
          )}

          {(selectedNote || (isCreating && !showSavedNotes)) && (
            <NoteEditor
              selectedNote={selectedNote}
              onSave={handleSave}
              onDelete={handleDelete}
              notes={notes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
