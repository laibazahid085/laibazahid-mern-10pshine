import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Notes.css";

const NoteEditor = ({ selectedNote, onSave, onDelete, notes }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const maxContentChars = 1500;
  const maxTitleChars = 30;

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTitleError("");
    } else {
      setTitle("");
      setContent("");
      setTitleError("");
    }
  }, [selectedNote]);

  const getCharCount = () => {
    const text = quillRef.current?.getEditor().getText() || "";
    return text.trim().length;
  };

  const handleContentChange = (value) => {
    const editor = quillRef.current?.getEditor();
    const plainText = editor?.getText() || "";
    const charCount = plainText.trim().length;

    if (charCount <= maxContentChars) {
      setContent(value);
    } else {
      const trimmedText = plainText.trim().slice(0, maxContentChars);
      editor.setText(trimmedText + " ");
      setContent(editor.root.innerHTML);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const isDuplicate = notes.some(
      (note) =>
        note.title.trim().toLowerCase() === newTitle.trim().toLowerCase() &&
        (!selectedNote || note._id !== selectedNote._id)
    );

    if (!newTitle.trim()) {
      setTitleError("Title is required");
    } else if (isDuplicate) {
      setTitleError("This title is already used");
    } else {
      setTitleError("");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || titleError) {
      return;
    }

    setLoading(true);
    try {
      await onSave({ title, content });
      toast.success(selectedNote ? "Note updated!" : "Note created!");
      setTitle("");
      setContent("");
      setTitleError("");
    } catch {
      toast.error("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setTitleError("");
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
              setTitleError("");
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
        onChange={handleTitleChange}
        maxLength={maxTitleChars}
        disabled={loading}
      />

      {/* ✅ Title error + character count in one line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
          marginBottom: "8px",
        }}
      >
        {titleError ? (
          <span style={{ color: "red", fontSize: "0.85rem" }}>{titleError}</span>
        ) : (
          <span></span>
        )}

        <span className="char-count">{title.length} / {maxTitleChars}</span>
      </div>

      <ReactQuill
        ref={quillRef}
        className="quill-editor"
        theme="snow"
        value={content}
        onChange={handleContentChange}
        readOnly={loading}
        placeholder="Write your note here..."
      />
      <p className="char-count">{getCharCount()} / {maxContentChars}</p>

      <div className="editor-buttons">
        <button
          className="primary-btn"
          onClick={handleSave}
          disabled={loading || !!titleError}
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

        <button className="clear-btn" onClick={handleClear} disabled={loading}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
