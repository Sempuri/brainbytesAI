import axios from "axios";

// Base URL setup
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true, // Enable cookies and auth headers
});

export default api;
