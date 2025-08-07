// src/services/authService.js

import axios from "axios";

// ✅ Create an Axios instance for auth-related requests
const API = axios.create({
  baseURL: "http://localhost:5000/api/users", // Make sure this matches your backend
});

// ✅ Login user → POST /api/users/login
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || error; // return meaningful error to frontend
  }
};

// ✅ Signup user → POST /api/users/signup
export const signupUser = async (userData) => {
  try {
    const res = await API.post("/signup", userData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Get user profile → GET /api/users/profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  try {
    const res = await API.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Logout user (client-side only)
export const logoutUser = () => {
  localStorage.removeItem("token");
};
