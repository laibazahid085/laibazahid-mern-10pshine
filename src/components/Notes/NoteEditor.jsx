import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createNote,
  getNoteById,
  updateNote,
} from "../../services/noteService";
import "./Notes.css";

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchNote = async () => {
        try {
          setLoading(true);
          const res = await getNoteById(id);
          setTitle(res.data.title);
          setContent(res.data.content);
        } catch (err) {
          setError("Failed to load note.");
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Both fields are required");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await updateNote(id, { title, content });
      } else {
        await createNote({ title, content });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-container">
      <h2 className="notes-title">
        {isEditing ? "✏️ Edit Note" : "📝 Create Note"}
      </h2>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="rich-editor"
          />

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <button type="submit" className="primary-btn">
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="primary-btn"
              style={{ backgroundColor: "#ccc", color: "#000" }}
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NoteEditor;
