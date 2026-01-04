import type { WorkerResponse } from './worker.types';

/**
 * Worker invoke options
 */
export interface WorkerInvokeOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Worker client configuration
 */
export interface WorkerClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

/**
 * Invoke a Cloudflare Worker
 */
export async function invokeWorker<TRequest = unknown, TResponse = unknown>(
  url: string,
  method: string,
  body?: TRequest,
  options?: WorkerInvokeOptions
): Promise<WorkerResponse<TResponse>> {
  const { headers = {}, timeout = 30000, retries = 0, retryDelay = 1000 } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error | null = null;
  let attempts = 0;

  while (attempts <= retries) {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText,
            details: errorData,
          },
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as TResponse,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      attempts++;

      if (attempts <= retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempts));
      }
    }
  }

  clearTimeout(timeoutId);

  return {
    success: false,
    error: {
      code: 'WORKER_INVOKE_FAILED',
      message: lastError?.message || 'Failed to invoke worker',
    },
  };
}

/**
 * Worker client for making requests to Cloudflare Workers
 */
export class WorkerClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: WorkerClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultHeaders = config.defaultHeaders || {};
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make a GET request
   */
  async get<T = unknown>(
    path: string,
    options?: WorkerInvokeOptions
  ): Promise<WorkerResponse<T>> {
    return invokeWorker<undefined, T>(
      `${this.baseUrl}${path}`,
      'GET',
      undefined,
      {
        timeout: this.timeout,
        ...options,
        headers: { ...this.defaultHeaders, ...options?.headers },
      }
    );
  }

  /**
   * Make a POST request
   */
  async post<TRequest = unknown, TResponse = unknown>(
    path: string,
    body?: TRequest,
    options?: WorkerInvokeOptions
  ): Promise<WorkerResponse<TResponse>> {
    return invokeWorker<TRequest, TResponse>(
      `${this.baseUrl}${path}`,
      'POST',
      body,
      {
        timeout: this.timeout,
        ...options,
        headers: { ...this.defaultHeaders, ...options?.headers },
      }
    );
  }

  /**
   * Make a PUT request
   */
  async put<TRequest = unknown, TResponse = unknown>(
    path: string,
    body?: TRequest,
    options?: WorkerInvokeOptions
  ): Promise<WorkerResponse<TResponse>> {
    return invokeWorker<TRequest, TResponse>(
      `${this.baseUrl}${path}`,
      'PUT',
      body,
      {
        timeout: this.timeout,
        ...options,
        headers: { ...this.defaultHeaders, ...options?.headers },
      }
    );
  }

  /**
   * Make a PATCH request
   */
  async patch<TRequest = unknown, TResponse = unknown>(
    path: string,
    body?: TRequest,
    options?: WorkerInvokeOptions
  ): Promise<WorkerResponse<TResponse>> {
    return invokeWorker<TRequest, TResponse>(
      `${this.baseUrl}${path}`,
      'PATCH',
      body,
      {
        timeout: this.timeout,
        ...options,
        headers: { ...this.defaultHeaders, ...options?.headers },
      }
    );
  }

  /**
   * Make a DELETE request
   */
  async delete<T = unknown>(
    path: string,
    options?: WorkerInvokeOptions
  ): Promise<WorkerResponse<T>> {
    return invokeWorker<undefined, T>(
      `${this.baseUrl}${path}`,
      'DELETE',
      undefined,
      {
        timeout: this.timeout,
        ...options,
        headers: { ...this.defaultHeaders, ...options?.headers },
      }
    );
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authorization header
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}

/**
 * Create a worker client instance
 */
export function createWorkerClient(config: WorkerClientConfig): WorkerClient {
  return new WorkerClient(config);
}

