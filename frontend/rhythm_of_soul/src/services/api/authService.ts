import apiClient from './index';
import { apiConfig } from '../../config';
import { setAccessToken } from '../../utils/tokenManager';
import { APIResponse } from '../../model/APIResponse';
import { RegisterRequest } from '../../model/auth/RegisterRequest';
import { ResetPasswordRequest } from '../../model/auth/ResetPasswordRequest';
import { LoginRequest } from '../../model/auth/LoginRequest';

interface LoginResponse {
  token: string;
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

export const logout = async (): Promise<APIResponse<any>> => {
  const response = await apiClient.post<APIResponse<any>>(
    apiConfig.endpoints.auth.log_out
  );

  return response.data;
}

export const resetPasswordRequest = async (email: string): Promise<APIResponse<any>> => {
	const response = await apiClient.post<APIResponse<any>>(
		apiConfig.endpoints.auth.reset_pass,
		email
	);
	return response.data;
}

export const resetPasswordVerify = async (data: ResetPasswordRequest): Promise<APIResponse<any>> => {
	const response = await apiClient.post<APIResponse<any>>(
		apiConfig.endpoints.auth.reset_pass_verify,
		data
	);
	return response.data;
}