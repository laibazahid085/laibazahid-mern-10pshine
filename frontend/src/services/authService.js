// src/services/authService.js
import axios from "axios";

// ✅ Base URL for user-related endpoints
const API_URL = "http://localhost:5000/api/users";

// ✅ LOGIN: POST /api/users/login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);

    // ✅ Save token if present
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data; // Return user data
  } catch (error) {
    // ❌ Forward error to UI (e.g., Login.jsx)
    throw error;
  }
};

// ✅ SIGNUP: POST /api/users/signup
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};
