import { useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import { getAllNotes } from "../../services/noteService";

const NoteList = ({ searchQuery }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getAllNotes();
        setNotes(response.notes || []);
      } catch (error) {
        console.error("Failed to fetch notes", error);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="note-list">
      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

export default NoteList;
