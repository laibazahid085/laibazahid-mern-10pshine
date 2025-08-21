// src/services/authService.js

import axios from "axios";

// ✅ Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ POST /api/auth/login
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ POST /api/auth/signup
export const signupUser = async (userData) => {
  try {
    const res = await API.post("/auth/signup", userData);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ GET /api/users/profile
export const getProfile = async () => {
  try {
    const res = await API.get("/users/profile");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};
