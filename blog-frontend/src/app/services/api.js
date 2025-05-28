import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/v1";

class ApiService {
  // Hold the singleton instance
  static instance = null;

  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }
    // You can setup axios instance here if needed
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      // You can add headers, interceptors here if needed
    });
    this.apiClient.interceptors.request.use(
      (config) => {
        if (config.requiresAuth) {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

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

  async updateCategory(editingCategoryId, data) {
    try {
      const response = await this.apiClient.put(
        `/categories/${editingCategoryId}`,
        data,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories", error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await this.apiClient.delete(
        `/categories/${categoryId}`,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting category", error);
      throw error;
    }
  }

  async createCategory(name) {
    try {
      const response = await this.apiClient.post(
        `/categories`,
        name,
        { requiresAuth: true } //token
        //
      );
      return response.data;
    } catch (error) {
      console.error("Error creating category", error);
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

  async updateTag(editingTagId, data) {
    try {
      const response = await this.apiClient.put(
        `/tags/${editingTagId}`,
        data,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tag", error);
      throw error;
    }
  }

  async deleteTag(tagId) {
    try {
      const response = await this.apiClient.delete(
        `/tags/${tagId}`,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting tag", error);
      throw error;
    }
  }

  async createTag(name) {
    try {
      const response = await this.apiClient.post(
        `/tags`,
        name,
        { requiresAuth: true } //token
        //
      );
      return response.data;
    } catch (error) {
      console.error("Error creating tag(s)", error);
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
