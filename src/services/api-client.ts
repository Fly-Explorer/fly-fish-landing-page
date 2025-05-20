import { RequestOptions, ApiError } from '@/types/api';

type FetchOptions = {
  headers?: Record<string, string>;
  method?: string;
  body?: string | FormData;
  credentials?: RequestCredentials;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization if needed
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`;
    // }

    return headers;
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  async post<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { headers: customHeaders, ...restOptions } = options;

    const fetchOptions: FetchOptions = {
      method: options.method || 'GET',
      headers: {
        ...this.getHeaders(),
        ...customHeaders,
      },
      credentials: 'include',
      ...restOptions,
    };

    try {
      const response = await fetch(url, fetchOptions);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data: unknown;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          data,
        } as ApiError;
      }

      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
export default ApiClient; 