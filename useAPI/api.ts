"use client";
import axios from "axios";
// Use environment variable if set, otherwise default to localhost for development
export const baseAPI = process.env.NEXT_PUBLIC_BASE_API || "http://127.0.0.1:8000"
// Production: "https://maindoagency.pythonanywhere.com"

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
