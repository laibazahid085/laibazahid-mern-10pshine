const Note = require("../models/Note");

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
