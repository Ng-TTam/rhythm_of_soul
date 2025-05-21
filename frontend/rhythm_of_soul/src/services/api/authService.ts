import apiClient from './index';
import { apiConfig } from '../../config';
import { setAccessToken } from '../../utils/tokenManager';
import { APIResponse } from '../../model/APIResponse';
import { RegisterRequest } from '../../model/auth/RegisterRequest';
import { ResetPasswordRequest } from '../../model/auth/ResetPasswordRequest';
import { LoginRequest } from '../../model/auth/LoginRequest';
import { TokenResponse } from '../../model/auth/TokenResponse';

export const login = async (data: LoginRequest): Promise<APIResponse<TokenResponse>> => {
  const response = await apiClient.post<APIResponse<TokenResponse>>(
    apiConfig.endpoints.auth.login,
    data
  );

  setAccessToken(response.data.result.token);
  return response.data;
};


export const register = async (data: RegisterRequest): Promise<APIResponse<TokenResponse>> => {
  const response = await apiClient.post<APIResponse<TokenResponse>>(
    apiConfig.endpoints.auth.register,
    data
  );

  setAccessToken(response.data.result.token);
  return response.data;
};


export const refreshToken = async (): Promise<APIResponse<TokenResponse>> => {
  const response = await apiClient.post<APIResponse<TokenResponse>>(
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