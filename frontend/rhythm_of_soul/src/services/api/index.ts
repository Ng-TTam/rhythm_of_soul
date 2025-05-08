import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { apiConfig, envConfig } from '../../config';
import { getAccessToken, setAccessToken, clearAccessToken } from '../../utils/tokenManager';

const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
  withCredentials: true, // Gửi cookie (refresh token)
});

// Interceptor for request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy access token
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log request trong môi trường dev
    if (envConfig.isDev) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 401 (access token hết hạn hoặc không hợp lệ)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (cookie sẽ tự động gửi)
        const response = await apiClient.post(apiConfig.endpoints.auth.refresh_token, {});
        const { accessToken } = response.data;

        setAccessToken(accessToken);

        // Thêm access token mới vào request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Thử lại request gốc
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, xóa token và redirect
        clearAccessToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Xử lý lỗi 403 (không đủ quyền)
    if (error.response?.status === 403) {
      console.error('Forbidden: Insufficient permissions');
    }

    return Promise.reject(error);
  }
);

export default apiClient;