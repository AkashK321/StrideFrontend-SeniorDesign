/**
 * API service for making HTTP requests to the backend.
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "https://t0j5kv142j.execute-api.us-east-1.amazonaws.com/prod";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ApiError {
  error: string;
}

/**
 * Makes a POST request to the login endpoint.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(error.error || `Login failed: ${response.statusText}`);
  }

  return data as LoginResponse;
}
