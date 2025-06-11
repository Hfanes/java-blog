import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/v1";

class ApiService {
  // Hold the singleton instance
  static instance = null;

  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
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
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("refreshToken expired", error.response?.status);
        if (error.response?.status === 401) {
          // Redirect to /refresh endpoint
          // If refreshToken = valid -> update refreshToken & accessToken
          // If refreshToken != valid -> login
          try {
            const response = await this.refresh();
            localStorage.setItem("token", response.jwtToken);

            //resend previous request with new token
            error.config.headers[
              "Authorization"
            ] = `Bearer ${response.jwtToken}`;
            return this.apiClient.request(error.config);
          } catch (refreshError) {
            // Refresh failed
            localStorage.removeItem("token");

            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        } else if (error.response?.status === 403) {
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );

    ApiService.instance = this;
  }

  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async refresh() {
    try {
      //IMPORTANT to use differente axios instance because otherwise it will be an infinite loop
      //because this is called when 401, this returns 401 and then calls this function again
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing tokens", error);
      throw error;
    }
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

  async getPostByUser() {
    try {
      const response = await this.apiClient.get(`/posts/my-posts`, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching postByUser", error);
      throw error;
    }
  }
  async getPostDrafts() {
    try {
      const response = await this.apiClient.get(`/posts/drafts`, {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching postByUser", error);
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

  async updatePost(editingPostId, data) {
    try {
      const response = await this.apiClient.put(
        `/posts/${editingPostId}`,
        data,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error updating post", error);
      throw error;
    }
  }
  async createPost(data) {
    try {
      const response = await this.apiClient.post(
        `/posts`,
        data,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error creating post", error);
      throw error;
    }
  }
  async deletePost(postId) {
    try {
      const response = await this.apiClient.delete(
        `/posts/${postId}`,
        { requiresAuth: true } //token
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting tag", error);
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
