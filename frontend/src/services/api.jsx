import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("sc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sc_token");
      localStorage.removeItem("sc_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/profile", data),
};

// ── Subjects ──────────────────────────────────────────────────
export const subjectAPI = {
  generate: (data) => API.post("/subjects/generate", data),
  refine: (data) => API.post("/subjects/refine", data),
  abTest: (data) => API.post("/subjects/ab-test", data),
};

// ── History ───────────────────────────────────────────────────
export const historyAPI = {
  getAll: (params) => API.get("/history", { params }),
  getStats: () => API.get("/history/stats"),
  deleteOne: (id) => API.delete(`/history/${id}`),
  clearAll: () => API.delete("/history"),
};

// ── Saved ─────────────────────────────────────────────────────
export const savedAPI = {
  getAll: () => API.get("/saved"),
  save: (data) => API.post("/saved", data),
  update: (id, data) => API.put(`/saved/${id}`, data),
  delete: (id) => API.delete(`/saved/${id}`),
};

export default API;