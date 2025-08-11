const Note = require("../models/Note");

// Helper function to strip HTML tags and get plain text length
const getPlainTextLength = (html) => {
  const text = html.replace(/<[^>]*>/g, '').trim(); // strip HTML and trim
  return text.length;
};

// Get all notes for the authenticated user
exports.getNotes = async (req, res) => {
  try {
    req.log.info(`Fetching notes for user ${req.user.id}`);

    const notes = await Note.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    req.log.error(`Error fetching notes: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Basic validations
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (title.length > 30) {
      return res.status(400).json({ message: "Title exceeds 30 characters" });
    }

    if (getPlainTextLength(content) > 1500) {
      return res.status(400).json({ message: "Content exceeds 1500 characters" });
    }

    // Check for duplicate title (case-insensitive)
    const existingNote = await Note.findOne({
      user: req.user.id,
      title: { $regex: `^${title}$`, $options: "i" },
    });

    if (existingNote) {
      return res.status(409).json({ message: "Note with this title already exists" });
    }

    const note = new Note({
      user: req.user.id,
      title,
      content,
    });

    await note.save();
    req.log.info(`Note created by user ${req.user.id} - Note ID: ${note._id}`);

    res.status(201).json(note);
  } catch (error) {
    req.log.error(`Error creating note: ${error.message}`);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;

    // Basic validations
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (title.length > 30) {
      return res.status(400).json({ message: "Title exceeds 30 characters" });
    }

    if (getPlainTextLength(content) > 1500) {
      return res.status(400).json({ message: "Content exceeds 1500 characters" });
    }

    // Check for duplicate title in other notes
    const duplicateNote = await Note.findOne({
      user: req.user.id,
      title: { $regex: `^${title}$`, $options: "i" },
      _id: { $ne: noteId },
    });

    if (duplicateNote) {
      return res.status(409).json({ message: "Another note with this title already exists" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user.id },
      { title, content },
      { new: true }
    );

    if (!note) {
      req.log.warn(`Note not found or unauthorized - ID: ${noteId}`);
      return res.status(404).json({ message: "Note not found" });
    }

    req.log.info(`Note updated - ID: ${noteId} by user ${req.user.id}`);
    res.status(200).json(note);
  } catch (error) {
    req.log.error(`Error updating note: ${error.message}`);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      user: req.user.id,
    });

    if (!note) {
      req.log.warn(`Note not found or unauthorized delete - ID: ${noteId}`);
      return res.status(404).json({ message: "Note not found" });
    }

    req.log.info(`Note deleted - ID: ${noteId} by user ${req.user.id}`);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    req.log.error(`Error deleting note: ${error.message}`);
    res.status(500).json({ message: "Failed to delete note" });
  }
};
