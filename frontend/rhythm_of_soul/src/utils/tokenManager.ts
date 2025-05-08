import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number; // Thời gian hết hạn (Unix timestamp, giây)
  iat: number;
  scope: string;
  iss: string;
  sub: string;
}

interface TokenData {
  accessToken: string | null;
}

const tokenStore: TokenData = {
  accessToken: null,
};

// Lưu access token
export const setAccessToken = (token: string) => {
  tokenStore.accessToken = token;
};

// Lấy access token
export const getAccessToken = (): string | null => {
  if (!tokenStore.accessToken) {
    return null;
  }

  try {
    const decoded  = jwtDecode<DecodedToken>(tokenStore.accessToken);
    const exp = decoded.exp;

    // Kiểm tra token còn hợp lệ
    if (exp && Date.now() >= exp * 1000) {
      clearAccessToken();
      return null;
    }

    return tokenStore.accessToken;
  } catch (error) {
    console.error('Invalid JWT:', error);
    clearAccessToken();
    return null;
  }
};

export const clearAccessToken = () => {
  tokenStore.accessToken = null;
};