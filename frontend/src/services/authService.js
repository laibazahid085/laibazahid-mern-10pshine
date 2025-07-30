import axios from "axios";

// ✅ FIXED: Correct base URL
const API_URL = "http://localhost:5000/api/users";

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

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};
