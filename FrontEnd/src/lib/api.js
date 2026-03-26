import axios from "axios";

const rawApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3002/pennypilot";

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
