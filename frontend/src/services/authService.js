// src/services/authService.js

import axios from "axios";

// ✅ Create an Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/users", // 🔁 Make sure this matches .env in production
});

// ✅ Add Authorization token to every request (if available)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Login user → POST /login
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Signup user → POST /signup
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

// ✅ Get profile → GET /profile
export const getProfile = async () => {
  try {
    const res = await API.get("/profile");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Logout user (client-side only)
export const logoutUser = () => {
  localStorage.removeItem("token");
};
