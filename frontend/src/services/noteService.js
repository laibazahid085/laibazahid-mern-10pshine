import axios from "axios";

const API_URL = "http://localhost:5000/api/notes"; // Update if using different port

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Get all notes
export const getNotes = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new note
export const createNote = async (noteData) => {
  const token = getToken();
  const response = await axios.post(API_URL, noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update existing note
export const updateNote = async (noteId, noteData) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/${noteId}`, noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a note
export const deleteNote = async (noteId) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
