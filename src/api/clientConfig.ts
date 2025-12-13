"use client";

import axios, { AxiosInstance, AxiosError } from "axios";
import { OpenAPI } from "./client";

// Ensure BASE URL is always set, even during SSR
const getBaseUrl = () => {
  // Check environment variable first
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Fallback to default
  return "http://127.0.0.1:8000";
};

const baseUrl = getBaseUrl();
OpenAPI.BASE = baseUrl;

// Create a configured axios instance with proper timeout and error handling
export const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't set withCredentials by default - let individual requests handle it
  withCredentials: false,
});

// Request interceptor for debugging and token injection
apiClient.interceptors.request.use(
  (config) => {
    // Add token from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      try {
        const token = window.localStorage.getItem("kh_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // localStorage might not be available
        console.warn("Could not access localStorage:", e);
      }
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        timeout: config.timeout,
      });
    }
    
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Enhanced error logging
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error("[API Network Error]", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        fullURL: error.config?.baseURL && error.config?.url 
          ? `${error.config.baseURL}${error.config.url}` 
          : error.config?.url || 'unknown',
      });
      
      // Provide helpful error message
      const errorMessage = error.config?.baseURL 
        ? `Cannot connect to API server at ${error.config.baseURL}. Please ensure the backend is running.`
        : 'Network error: Unable to connect to the API server.';
      
      console.error(errorMessage);
    } else if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      const errorDetail = typeof errorData === 'object' && errorData !== null
        ? (errorData.detail || errorData.message || JSON.stringify(errorData))
        : String(errorData || 'Unknown error');
      
      console.error("[API Response Error]", {
        status: error.response.status,
        statusText: error.response.statusText,
        detail: errorDetail,
        data: errorData,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("[API No Response]", {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    }
    
    return Promise.reject(error);
  }
);

// Set token only on client side
if (typeof window !== "undefined") {
  try {
    const token = window.localStorage.getItem("kh_token");
    if (token) {
      OpenAPI.TOKEN = token;
    }
  } catch (e) {
    // localStorage might not be available in some contexts
    console.warn("Could not access localStorage:", e);
  }
}
