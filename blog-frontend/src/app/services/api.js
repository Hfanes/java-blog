import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/v1";

const token = localStorage.getItem("jwtToken");

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

  getPostById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}`, error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post", error);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}`, error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${id}`, error);
      throw error;
    }
  },
};

export default api;
