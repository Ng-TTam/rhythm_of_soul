import apiClient from './index';
import { apiConfig } from '../../config';
import { setAccessToken } from '../../utils/tokenManager';
import { APIResponse } from '../../model/APIResponse';

interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginResponse {
  token: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
}


export const login = async (data: LoginRequest): Promise<APIResponse<LoginResponse>> => {
  const response = await apiClient.post<APIResponse<LoginResponse>>(
    apiConfig.endpoints.auth.login,
    data
  );

  setAccessToken(response.data.result.token);
  return response.data;
};


export const register = async (data: RegisterRequest): Promise<APIResponse<RegisterResponse>> => {
  const response = await apiClient.post<APIResponse<RegisterResponse>>(
    apiConfig.endpoints.auth.register,
    data
  );

  setAccessToken(response.data.result.token);
  return response.data;
};


export const refreshToken = async (): Promise<APIResponse<LoginResponse>> => {
  const response = await apiClient.post<APIResponse<LoginResponse>>(
    apiConfig.endpoints.auth.refresh_token,
    {}
  );

  setAccessToken(response.data.result.token);
  return response.data;
};