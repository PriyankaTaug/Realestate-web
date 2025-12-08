/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

// Create a configured axios instance with proper timeout and error handling
// This ensures all API requests have consistent configuration
const createConfiguredAxiosClient = (): AxiosInstance => {
    const client = axios.create({
        timeout: 30000, // 30 seconds timeout
        // Don't set default Content-Type - let each request set it based on its data type
        withCredentials: false,
    });

    // Request interceptor for token injection
    client.interceptors.request.use(
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
                }
            }
            
            // If FormData is present, remove any Content-Type header to let axios set it with boundary
            // Also check for FormDataConstructor (Node.js form-data package)
            const isFormData = config.data instanceof FormData || 
                              (config.data && typeof (config.data as any).getHeaders === 'function');
            
            if (isFormData && config.headers) {
                // Remove Content-Type to let axios/browser set it automatically with boundary
                delete config.headers['Content-Type'];
                delete config.headers['content-type'];
                
                if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                    console.log('[Interceptor] Removed Content-Type header for FormData request');
                }
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor - just pass errors through
    // Detailed error handling and logging happens in sendRequest function
    // This avoids duplicate logging and ensures we have full request context
    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            // Simply reject - let sendRequest handle all error logging
            return Promise.reject(error);
        }
    );

    return client;
};

// Use a singleton pattern to avoid creating multiple instances
let configuredAxiosClient: AxiosInstance | null = null;
const getConfiguredAxiosClient = (): AxiosInstance => {
    if (!configuredAxiosClient) {
        configuredAxiosClient = createConfiguredAxiosClient();
    }
    return configuredAxiosClient;
};
// Use browser FormData when available, fallback to Node.js form-data for SSR
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormDataConstructor = typeof FormData !== 'undefined' ? FormData : require('form-data');

import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

export const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};

export const isString = (value: any): value is string => {
    return typeof value === 'string';
};

export const isStringWithValue = (value: any): value is string => {
    return isString(value) && value !== '';
};

export const isBlob = (value: any): value is Blob => {
    return (
        typeof value === 'object' &&
        typeof value.type === 'string' &&
        typeof value.stream === 'function' &&
        typeof value.arrayBuffer === 'function' &&
        typeof value.constructor === 'function' &&
        typeof value.constructor.name === 'string' &&
        /^(Blob|File)$/.test(value.constructor.name) &&
        /^(Blob|File)$/.test(value[Symbol.toStringTag])
    );
};

export const isFormData = (value: any): value is FormData => {
    return value instanceof FormData;
};

export const isSuccess = (status: number): boolean => {
    return status >= 200 && status < 300;
};

export const base64 = (str: string): string => {
    try {
        return btoa(str);
    } catch (err) {
        // @ts-ignore
        return Buffer.from(str).toString('base64');
    }
};

export const getQueryString = (params: Record<string, any>): string => {
    const qs: string[] = [];

    const append = (key: string, value: any) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };

    const process = (key: string, value: any) => {
        if (isDefined(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            } else {
                append(key, value);
            }
        }
    };

    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });

    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }

    return '';
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
    const encoder = config.ENCODE_PATH || encodeURI;

    const path = options.url
        .replace('{api-version}', config.VERSION)
        .replace(/{(.*?)}/g, (substring: string, group: string) => {
            if (options.path?.hasOwnProperty(group)) {
                return encoder(String(options.path[group]));
            }
            return substring;
        });

    // Ensure BASE doesn't have trailing slash and path starts with /
    const base = config.BASE.endsWith('/') ? config.BASE.slice(0, -1) : config.BASE;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    const url = `${base}${normalizedPath}`;
    if (options.query) {
        return `${url}${getQueryString(options.query)}`;
    }
    return url;
};

export const getFormData = (options: ApiRequestOptions): FormData | undefined => {
    if (options.formData) {
        // Ensure formData is an object, not already a FormData instance
        if (options.formData instanceof FormData || (options.formData && typeof (options.formData as any).getHeaders === 'function')) {
            // Already a FormData instance, return as-is
            return options.formData as FormData;
        }
        
        const formData = new FormDataConstructor();

        const appendFormDataValue = (key: string, value: any) => {
            // Handle File/Blob objects directly
            if (isBlob(value) || (typeof File !== 'undefined' && value instanceof File)) {
                formData.append(key, value);
                if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                    console.log(`[FormData] Appended file: ${key}`, { 
                        name: (value as File).name, 
                        size: (value as File).size, 
                        type: (value as File).type 
                    });
                }
            } else if (isString(value)) {
                formData.append(key, value);
                if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && key !== 'images') {
                    console.log(`[FormData] Appended string: ${key} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
                }
            } else if (value === null || value === undefined) {
                // Skip null/undefined values
                return;
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                // Convert numbers and booleans to strings
                formData.append(key, String(value));
                if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                    console.log(`[FormData] Appended ${typeof value}: ${key} = ${value}`);
                }
            } else {
                // For other types, stringify (but this shouldn't happen for form data)
                formData.append(key, JSON.stringify(value));
                if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                    console.log(`[FormData] Appended JSON: ${key} = ${JSON.stringify(value).substring(0, 50)}...`);
                }
            }
        };

        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            console.log('[FormData] Constructing FormData from:', Object.keys(options.formData));
        }

        Object.entries(options.formData)
            .filter(([_, value]) => isDefined(value))
            .forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // For arrays, append each item with the same key (important for multiple files)
                    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                        console.log(`[FormData] Processing array: ${key} with ${value.length} items`);
                    }
                    value.forEach((v, index) => {
                        if (isDefined(v)) {
                            appendFormDataValue(key, v);
                        } else if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                            console.log(`[FormData] Skipping undefined item at index ${index} in array ${key}`);
                        }
                    });
                } else {
                    appendFormDataValue(key, value);
                }
            });

        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            // Log FormData entries (note: FormData.entries() is not available in all environments)
            console.log('[FormData] FormData constructed successfully');
        }

        return formData;
    }
    return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

export const resolve = async <T>(options: ApiRequestOptions, resolver?: T | Resolver<T>): Promise<T | undefined> => {
    if (typeof resolver === 'function') {
        return (resolver as Resolver<T>)(options);
    }
    return resolver;
};

export const getHeaders = async (config: OpenAPIConfig, options: ApiRequestOptions, formData?: FormData): Promise<Record<string, string>> => {
    const [token, username, password, additionalHeaders] = await Promise.all([
        resolve(options, config.TOKEN),
        resolve(options, config.USERNAME),
        resolve(options, config.PASSWORD),
        resolve(options, config.HEADERS),
    ]);

    // form-data package (Node.js) has getHeaders, browser FormData does not
    const formHeaders = (formData && typeof (formData as any).getHeaders === 'function') 
        ? (formData as any).getHeaders() 
        : {}

    const headers = Object.entries({
        Accept: 'application/json',
        ...additionalHeaders,
        ...options.headers,
        ...formHeaders,
    })
    .filter(([_, value]) => isDefined(value))
    .reduce((headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
    }), {} as Record<string, string>);

    if (isStringWithValue(token)) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (isStringWithValue(username) && isStringWithValue(password)) {
        const credentials = base64(`${username}:${password}`);
        headers['Authorization'] = `Basic ${credentials}`;
    }

    // Only set Content-Type if formData is not present
    // When formData is present, axios will set Content-Type automatically with boundary
    if (!formData && options.body !== undefined) {
        if (options.mediaType) {
            headers['Content-Type'] = options.mediaType;
        } else if (isBlob(options.body)) {
            headers['Content-Type'] = options.body.type || 'application/octet-stream';
        } else if (isString(options.body)) {
            headers['Content-Type'] = 'text/plain';
        } else if (!isFormData(options.body)) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return headers;
};

export const getRequestBody = (options: ApiRequestOptions): any => {
    // Don't return body if formData is present - they should be mutually exclusive
    if (options.formData) {
        return undefined;
    }
    if (options.body) {
        return options.body;
    }
    return undefined;
};

export const sendRequest = async <T>(
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    formData: FormData | undefined,
    headers: Record<string, string>,
    onCancel: OnCancel,
    axiosClient: AxiosInstance
): Promise<AxiosResponse<T>> => {
    const source = axios.CancelToken.source();

    // Ensure baseURL is not set when url is already absolute (starts with http:// or https://)
    // This prevents axios from prepending baseURL to an already complete URL
    // If axiosClient has a baseURL configured at instance level, we need to override it
    const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
    // Ensure FormData is used when present, and body is undefined
    let requestData = formData || body;
    
    // If FormData is present, ensure body is not used
    if (formData && body) {
        console.warn('[Request] Both formData and body are present, using formData');
        requestData = formData;
    }
    
    // Verify FormData is actually a FormData instance
    if (formData && !(formData instanceof FormData) && typeof (formData as any).getHeaders !== 'function') {
        console.error('[Request] formData is not a FormData instance!', typeof formData, formData);
        throw new Error('FormData must be an instance of FormData');
    }
    
    const requestConfig: AxiosRequestConfig = {
        url,
        headers,
        data: requestData,
        method: options.method,
        withCredentials: config.WITH_CREDENTIALS,
        withXSRFToken: config.CREDENTIALS === 'include' ? config.WITH_CREDENTIALS : false,
        cancelToken: source.token,
        // When URL is absolute, set baseURL to empty string to override any instance-level baseURL
        // When URL is relative, use config.BASE
        baseURL: isAbsoluteUrl ? '' : config.BASE,
        // Don't transform FormData - let axios handle it natively
        transformRequest: formData && (formData instanceof FormData || typeof (formData as any).getHeaders === 'function')
            ? [(data) => data] // No transformation for FormData
            : undefined, // Use default transform for other data types
    };
    
    // Debug logging
    if (formData && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        const isFormDataInstance = requestData instanceof FormData;
        const isNodeFormData = requestData && typeof (requestData as any).getHeaders === 'function';
        console.log('[Request] Sending data:', {
            type: isFormDataInstance ? 'FormData (browser)' : isNodeFormData ? 'FormData (node)' : typeof requestData,
            isFormData: isFormDataInstance || isNodeFormData,
            contentType: headers['Content-Type'] || headers['content-type'] || 'not set (will be set by axios)',
        });
    }

    onCancel(() => source.cancel('The user aborted a request.'));

    try {
        return await axiosClient.request(requestConfig);
    } catch (error) {
        const axiosError = error as AxiosError<T>;
        if (axiosError.response) {
            return axiosError.response;
        }
        
        // Enhanced error logging for network errors
        const isNetworkError = axiosError.code === 'ERR_NETWORK' || 
                              axiosError.code === 'ECONNREFUSED' ||
                              axiosError.code === 'ETIMEDOUT' ||
                              axiosError.message === 'Network Error' || 
                              (axiosError.message && axiosError.message.includes('Network Error'));
        
        if (isNetworkError) {
            const debugAPI = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEBUG_API === 'true') ||
                            (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_DEBUG_API === 'true');
            
            // Log network errors if debug mode is on, otherwise log always
            // Use requestConfig for URL info since it's guaranteed to exist
            // Fallback to axiosError.config if available
            const errorUrl = requestConfig.url || axiosError.config?.url || 'unknown';
            const errorMethod = requestConfig.method || axiosError.config?.method || 'unknown';
            const errorBaseURL = requestConfig.baseURL || axiosError.config?.baseURL || config.BASE || 'unknown';
            
            // Build full URL safely
            const isAbsoluteUrl = errorUrl.startsWith('http://') || errorUrl.startsWith('https://');
            const fullUrl = isAbsoluteUrl 
                ? errorUrl 
                : (errorBaseURL && errorUrl ? `${errorBaseURL}${errorUrl}` : errorUrl);

            // Log error details using individual console.error calls to avoid serialization issues
            console.error('[API Network Error]');
            console.error('  Message:', axiosError.message || 'Unknown network error');
            console.error('  Code:', axiosError.code || 'UNKNOWN');
            console.error('  Method:', errorMethod);
            console.error('  URL:', errorUrl);
            console.error('  Base URL:', errorBaseURL);
            console.error('  Full URL:', fullUrl);
            
            // Check if BASE URL is configured
            if (!config.BASE || config.BASE.trim() === '') {
                console.error('  Warning: API BASE URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable.');
            }
            
            // Create a more descriptive error message
            const errorMessage = `Network request failed: ${errorMethod.toUpperCase()} ${fullUrl}\n` +
                `Error: ${axiosError.message || 'Unknown network error'}\n` +
                `Code: ${axiosError.code || 'UNKNOWN'}\n` +
                `Please check:\n` +
                `1. Backend server is running at ${config.BASE || 'undefined'}\n` +
                `2. CORS is properly configured\n` +
                `3. Network connectivity is available`;
            
            console.error(errorMessage);
        }
        
        throw error;
    }
};

export const getResponseHeader = (response: AxiosResponse<any>, responseHeader?: string): string | undefined => {
    if (responseHeader) {
        const content = response.headers[responseHeader];
        if (isString(content)) {
            return content;
        }
    }
    return undefined;
};

export const getResponseBody = (response: AxiosResponse<any>): any => {
    if (response.status !== 204) {
        return response.data;
    }
    return undefined;
};

export const catchErrorCodes = (options: ApiRequestOptions, result: ApiResult): void => {
    const errors: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        ...options.errors,
    }

    const error = errors[result.status];
    if (error) {
        // For validation errors (422), include detailed error information from response body
        let errorMessage = error;
        
        if (result.status === 422 && result.body) {
            try {
                // Try to extract validation details from the response body
                const body = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
                
                // Handle FastAPI validation error format
                if (body.detail) {
                    if (Array.isArray(body.detail)) {
                        // Multiple validation errors
                        const validationErrors = body.detail.map((err: any) => {
                            if (err.loc && err.msg) {
                                return `${err.loc.join('.')}: ${err.msg}`;
                            }
                            return JSON.stringify(err);
                        }).join('; ');
                        errorMessage = `Validation Error: ${validationErrors}`;
                    } else if (typeof body.detail === 'string') {
                        errorMessage = `Validation Error: ${body.detail}`;
                    } else {
                        errorMessage = `Validation Error: ${JSON.stringify(body.detail)}`;
                    }
                } else if (body.message) {
                    errorMessage = `Validation Error: ${body.message}`;
                } else {
                    errorMessage = `Validation Error: ${JSON.stringify(body)}`;
                }
            } catch (e) {
                // If parsing fails, use the default error message
                errorMessage = error;
            }
        }
        
        throw new ApiError(options, result, errorMessage);
    }

    if (!result.ok) {
        const errorStatus = result.status ?? 'unknown';
        const errorStatusText = result.statusText ?? 'unknown';
        const errorBody = (() => {
            try {
                return JSON.stringify(result.body, null, 2);
            } catch (e) {
                return undefined;
            }
        })();

        throw new ApiError(options, result,
            `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`
        );
    }
};

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @param axiosClient The axios client instance to use
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions, axiosClient: AxiosInstance = getConfiguredAxiosClient()): CancelablePromise<T> => {
    return new CancelablePromise(async (resolve, reject, onCancel) => {
        try {
            // Validate BASE URL is configured
            if (!config.BASE || config.BASE.trim() === '') {
                const errorMessage = 'API BASE URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable or configure OpenAPI.BASE.';
                console.error(errorMessage);
                reject(new Error(errorMessage));
                return;
            }

            const url = getUrl(config, options);
            const formData = getFormData(options);
            const body = getRequestBody(options);
            
            // Critical: If options.formData exists but getFormData returned undefined, that's an error
            if (options.formData && !formData) {
                console.error('[Request] options.formData was provided but getFormData returned undefined!', options.formData);
                throw new Error('Failed to create FormData from options.formData');
            }
            
            // Debug: Log what we're sending
            if (formData && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                console.log('[Request] FormData created:', {
                    isFormData: formData instanceof FormData,
                    isNodeFormData: typeof (formData as any).getHeaders === 'function',
                });
                // Try to log FormData entries if possible
                if (formData instanceof FormData) {
                    const entries: string[] = [];
                    try {
                        for (const [key] of formData.entries()) {
                            entries.push(key);
                        }
                        console.log('[Request] FormData keys:', entries);
                    } catch (e) {
                        console.log('[Request] Could not iterate FormData entries');
                    }
                }
            }
            
            const headers = await getHeaders(config, options, formData);

            if (!onCancel.isCancelled) {
                const response = await sendRequest<T>(config, options, url, body, formData, headers, onCancel, axiosClient);
                const responseBody = getResponseBody(response);
                const responseHeader = getResponseHeader(response, options.responseHeader);

                const result: ApiResult = {
                    url,
                    ok: isSuccess(response.status),
                    status: response.status,
                    statusText: response.statusText,
                    body: responseHeader ?? responseBody,
                };

                catchErrorCodes(options, result);

                resolve(result.body);
            }
        } catch (error) {
            reject(error);
        }
    });
};
