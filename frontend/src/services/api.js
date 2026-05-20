import axios from "axios";

const NODE_GATEWAY_URL = "http://localhost:5000/api";
const SPRINGBOOT_URL = "http://localhost:8080/api";

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Authentication
  login: async (username, password) => {
    const res = await axios.post(`${SPRINGBOOT_URL}/auth/login`, { username, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        username: res.data.username,
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role
      }));
    }
    return res.data;
  },

  register: async (username, password, email, fullName) => {
    const res = await axios.post(`${SPRINGBOOT_URL}/auth/register`, {
      username,
      password,
      email,
      fullName
    });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  // Gateway AI Scan
  scanFoodImage: async (imageInput) => {
    const headers = { ...getAuthHeader() };
    
    // Check if input is base64 string
    if (typeof imageInput === "string") {
      headers["Content-Type"] = "application/json";
      const res = await axios.post(`${NODE_GATEWAY_URL}/gateway/scan`, { image: imageInput }, { headers });
      return res.data;
    } 
    // Otherwise handle multipart file upload
    else {
      const formData = new FormData();
      formData.append("image", imageInput);
      headers["Content-Type"] = "multipart/form-data";
      
      const res = await axios.post(`${NODE_GATEWAY_URL}/gateway/scan`, formData, { headers });
      return res.data;
    }
  },

  // Spring Boot Data (User)
  getScanHistory: async () => {
    const res = await axios.get(`${SPRINGBOOT_URL}/scans/history`, {
      headers: getAuthHeader()
    });
    return res.data;
  },

  getRecentScans: async (limit = 4) => {
    try {
      const res = await axios.get(`${SPRINGBOOT_URL}/scans/history`, {
        headers: getAuthHeader()
      });
      return res.data?.slice(0, limit) || [];
    } catch (err) {
      console.error("Failed to fetch recent scans:", err);
      return [];
    }
  },

  getDailyAnalytics: async () => {
    const res = await axios.get(`${SPRINGBOOT_URL}/analytics/daily`, {
      headers: getAuthHeader()
    });
    return res.data;
  },

  // Admin APIs
  getAdminUsers: async () => {
    const res = await axios.get(`${SPRINGBOOT_URL}/admin/users`, {
      headers: getAuthHeader()
    });
    return res.data;
  },

  toggleUserStatus: async (userId) => {
    const res = await axios.put(`${SPRINGBOOT_URL}/admin/users/${userId}/toggle-status`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  },

  getAdminScans: async () => {
    const res = await axios.get(`${SPRINGBOOT_URL}/admin/scans`, {
      headers: getAuthHeader()
    });
    return res.data;
  },

  getAdminStats: async () => {
    const res = await axios.get(`${SPRINGBOOT_URL}/admin/stats`, {
      headers: getAuthHeader()
    });
    return res.data;
  }
};
