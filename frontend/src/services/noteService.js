// src/services/noteService.js

import axios from "axios";

// ✅ Create a reusable Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token automatically to every request using interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Get all notes
export const getNotes = async () => {
  const response = await API.get("/notes");
  return response.data;
};

// ✅ Create a new note
export const createNote = async (noteData) => {
  const response = await API.post("/notes", noteData);
  return response.data;
};

// ✅ Update an existing note
export const updateNote = async (noteId, noteData) => {
  const response = await API.put(`/notes/${noteId}`, noteData);
  return response.data;
};

// ✅ Delete a note
export const deleteNote = async (noteId) => {
  const response = await API.delete(`/notes/${noteId}`);
  return response.data;
};