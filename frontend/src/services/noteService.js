import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/notes",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchNotes = () => API.get("/");
export const getNoteById = (id) => API.get(`/${id}`);
export const createNote = (data) => API.post("/", data);
export const updateNote = (id, data) => API.put(`/${id}`, data);
export const deleteNote = (id) => API.delete(`/${id}`);
