import { FortuneContentSchema } from "@hoshino/domain";
import { z } from "zod";

const getApiBaseUrl = () => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  }
  return "http://localhost:3000";
};

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  constructor(public status: number, public message: string, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

export async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorMessage = "Unknown error";
    let errorData = null;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody.message || res.statusText;
      errorData = errorBody;
    } catch {
      errorMessage = res.statusText;
    }
    throw new ApiError(res.status, errorMessage, errorData);
  }
  return res.json();
}

export async function fetchWithTimeout(resource: RequestInfo, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export const apiClient = {
  fortune: {
    list: async (options: { timeout?: number } = {}) => {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/fortunes`, options);
      const data = await handleResponse(res);
      
      if (!Array.isArray(data)) {
         console.error("API Error: Expected array but got", typeof data);
         throw new ApiError(500, "Invalid response format: expected array");
      }

      const validItems: FortuneContent[] = [];
      const errors: any[] = [];

      data.forEach((item, index) => {
        const parsed = FortuneContentSchema.safeParse(item);
        if (parsed.success) {
          validItems.push(parsed.data);
        } else {
          errors.push({ index, error: parsed.error });
        }
      });

      if (errors.length > 0) {
        console.error(`API Validation Warning: ${errors.length} items failed validation and were omitted.`, errors);
      }
      
      return validItems;
    },
    get: async (id: string, options: { timeout?: number } = {}) => {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/fortunes/${id}`, options);
      const data = await handleResponse(res);
      const parsed = FortuneContentSchema.safeParse(data);
      if (!parsed.success) {
        console.error("API Validation Error (get):", parsed.error);
        throw new ApiError(500, "Invalid response from server");
      }
      return parsed.data;
    },
  },
};
