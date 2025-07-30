import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Notes.css";

const NoteEditor = ({ selectedNote, onSave, onDelete }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

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
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required!");
      return;
    }

    setLoading(true);
    try {
      await onSave({ title, content });
      toast.success(selectedNote ? "Note updated!" : "Note created!");
      setTitle("");
      setContent("");
    } catch {
      toast.error("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
  };

  const handleDelete = () => {
    if (!selectedNote) return;

    confirmAlert({
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this note?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setLoading(true);
            try {
              await onDelete(selectedNote._id);
              toast.success("Note deleted!");
              setTitle("");
              setContent("");
            } catch {
              toast.error("Failed to delete note.");
            } finally {
              setLoading(false);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  return (
    <div className="note-editor">
      <input
        className="note-title-input"
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />

      <ReactQuill
        ref={quillRef}
        className="quill-editor"
        theme="snow"
        value={content}
        onChange={setContent}
        readOnly={loading}
        placeholder="Write your note here..."
      />

      <div className="editor-buttons">
        <button
          className="primary-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {selectedNote ? "Update" : "Save"}
        </button>

        {selectedNote && (
          <button
            className="danger-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>
        )}

        <button
          className="clear-btn"
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
