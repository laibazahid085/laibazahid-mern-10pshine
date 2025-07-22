import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update if your backend uses a different path

// LOGIN
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);

  // Save token to localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// SIGNUP
export const signupUser = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);

  // Save token if backend returns one
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// LOGOUT (optional)
export const logoutUser = () => {
  localStorage.removeItem("token");
};
