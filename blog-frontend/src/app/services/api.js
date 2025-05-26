import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/v1";

const api = {
  login: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      console.error("Error logging in", error);
      throw error;
    }
  },

  getPosts: async (queryParams = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  },
  getTags: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tags`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  },
};

export default api;
