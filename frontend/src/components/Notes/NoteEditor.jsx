import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Notes.css";
import { createNote, updateNote, deleteNote } from "../../services/noteService";

const NoteEditor = ({ selectedNote, onSave, onDelete }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote]);

  const handleSave = async () => {
    const noteData = { title, content };
    if (selectedNote) {
      const updated = await updateNote(selectedNote._id, noteData);
      onSave(updated);
    } else {
      const newNote = await createNote(noteData);
      onSave(newNote);
    }

    setTitle("");
    setContent("");
  };

  const handleDelete = async () => {
    if (selectedNote) {
      await deleteNote(selectedNote._id);
      onDelete(selectedNote._id); // Notify parent to remove from list
    }
    setTitle("");
    setContent("");
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <div className="editor-buttons">
        <button className="primary-btn" onClick={handleSave}>
          {selectedNote ? "Update" : "Save"}
        </button>

        {selectedNote && (
          <button className="danger-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
