import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  exp: number; // Thời gian hết hạn (Unix timestamp, giây)
  iat: number;
  scope: string;
  iss: string;
  sub: string;
}

const ACCESS_TOKEN_KEY = 'accessToken';

// Lưu access token vào sessionStorage
export const setAccessToken = (token: string) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Lấy access token từ sessionStorage và kiểm tra hạn
export const getAccessToken = (): string | null => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const exp = decoded.exp;

    // Nếu token hết hạn, xoá và trả null
    if (exp && Date.now() >= exp * 1000) {
      clearAccessToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Invalid JWT:', error);
    clearAccessToken();
    return null;
  }
};

// Xoá token khỏi sessionStorage
export const clearAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};