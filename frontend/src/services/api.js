import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://smart-stay-23y7.onrender.com/api",
});

export default api;
