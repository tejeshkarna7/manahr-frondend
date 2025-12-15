import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { ApiResponse } from '@/types';
import { getSession } from 'next-auth/react';

// Token management
class TokenManager {
  static async getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const session = await getSession();
    return session?.accessToken || null;
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.refreshTokenKey);
    localStorage.removeItem(config.userKey);
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // If 401, session expired - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API client wrapper with error handling
class ApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message = axiosError.response?.data?.message || axiosError.message || 'An error occurred';
      throw new Error(message);
    }
    throw error;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data.data as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data.data as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data.data as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data.data as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data.data as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  // For responses with full ApiResponse structure
  async getResponse<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async postResponse<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // For file uploads
  async uploadFile<T = any>(url: string, formData: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data.data as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  // For downloading files
  async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get raw axios instance for custom operations
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const api = new ApiClient(apiClient);
export { TokenManager };

// Export axios instance for direct access if needed
export default apiClient;
