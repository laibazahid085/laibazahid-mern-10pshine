const Note = require("../models/Note");

// ✅ GET all notes for the logged-in user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// ✅ POST - Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // 🛡️ Validation: don't allow empty title/content
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      user: req.userId,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// ✅ PUT - Update existing note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title: title.trim(), content: content.trim() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// ✅ DELETE - Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

