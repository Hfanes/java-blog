import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/v1";

class ApiService {
  // Hold the singleton instance
  static instance = null;

  // Private constructor (enforced by convention)
  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }
    // You can setup axios instance here if needed
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      // You can add headers, interceptors here if needed
    });

    ApiService.instance = this;
  }

  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async login(data) {
    try {
      const response = await this.apiClient.post(`/auth/login`, data);
      return response.data;
    } catch (error) {
      console.error("Error logging in", error);
      throw error;
    }
  }
  async register(data) {
    try {
      const response = await this.apiClient.post(`/auth/register`, data);
      return response.data;
    } catch (error) {
      console.error("Error logging in", error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const response = await this.apiClient.get(`/auth/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user", error);
      throw error;
    }
  }

  async getPosts(queryParams = {}) {
    try {
      const response = await this.apiClient.get(`/posts`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts", error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await this.apiClient.get(`/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories", error);
      throw error;
    }
  }

  async getTags() {
    try {
      const response = await this.apiClient.get(`/tags`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tags", error);
      throw error;
    }
  }

  async getPostById(id) {
    try {
      const response = await this.apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching postById", error);
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
