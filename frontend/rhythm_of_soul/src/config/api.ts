import { config } from './environment';

// Định nghĩa kiểu cho endpoints
interface AuthEndpoints {
  login: string;
  register: string;
  refresh_token: string;
}

interface UserEndpoints {
  get_by_pre_email: (preEmail: string) => string;
  update: (userId: string) => string;
  profile: string;
  assign_artist: string;
}

interface ArtistEndpoints {
  //add endpoint
}

interface ApiEndpoints {
  auth: AuthEndpoints;
  user: UserEndpoints;
  artist: ArtistEndpoints;
}

export const apiConfig = {
  baseUrl: config.apiBaseUrl,
  endpoints: {
    auth: {
      login: `${config.apiBaseUrl}/identity/auth/login`,
      register: `${config.apiBaseUrl}/identity/api/sign-up`,// change to server rendering in future
      refresh_token: `${config.apiBaseUrl}/identity/auth/refresh-token`, // Sửa lỗi từ sign-up
    },
    user: {
      get_by_pre_email: (preEmail: string) => `${config.apiBaseUrl}/identity/users/${preEmail}`,
      update: (userId: string) => `${config.apiBaseUrl}/identity/users/${userId}`,
      profile: `${config.apiBaseUrl}/identity/users`,
      assign_artist: `${config.apiBaseUrl}/identity/users/assign-artist`,
    },
    artist: {
    },
  } as ApiEndpoints,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
};