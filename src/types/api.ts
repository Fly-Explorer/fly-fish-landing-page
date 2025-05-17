export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers?: Headers;
}

export interface ApiError {
  status: number;
  statusText: string;
  data: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 