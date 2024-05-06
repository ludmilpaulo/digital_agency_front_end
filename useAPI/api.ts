"use client";
import axios from "axios";

//export const baseAPI = "http://127.0.0.1";

export const baseAPI = "https://maindoagency.pythonanywhere.com"; // Ensure this is correctly pointing to your Django backend

const api = axios.create({
  baseURL: baseAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const language = localStorage.getItem("language") || "en"; // Default to English
  config.headers["Accept-Language"] = language;
  return config;
});

export default api;

// Use this `api` instance to make all backend calls
