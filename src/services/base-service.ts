import ApiClient, { apiClient } from './api-client';
import { PaginatedResponse } from '@/types/api';

export default abstract class BaseService<T> {
  protected apiClient: ApiClient;
  protected endpoint: string;

  constructor(endpoint: string, client: ApiClient = apiClient) {
    this.apiClient = client;
    this.endpoint = endpoint;
  }

  async getAll(params?: Record<string, string>): Promise<T[]> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return this.apiClient.get<T[]>(url);
  }

  async getPaginated(page = 1, pageSize = 10, params?: Record<string, string>): Promise<PaginatedResponse<T>> {
    const queryParams = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...params
    };
    const queryString = new URLSearchParams(queryParams).toString();
    return this.apiClient.get<PaginatedResponse<T>>(`${this.endpoint}?${queryString}`);
  }

  async getById(id: string | number): Promise<T> {
    return this.apiClient.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    return this.apiClient.post<T>(this.endpoint, data);
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    return this.apiClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  async patch(id: string | number, data: Partial<T>): Promise<T> {
    return this.apiClient.patch<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string | number): Promise<void> {
    return this.apiClient.delete<void>(`${this.endpoint}/${id}`);
  }
} 