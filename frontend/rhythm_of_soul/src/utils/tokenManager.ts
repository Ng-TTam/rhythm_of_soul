import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

export interface DecodedToken {
  exp: number; // Thời gian hết hạn (Unix timestamp, giây)
  iat: number;
  scope: string;
  iss: string;
  sub: string;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const SESSION_ID_KEY = 'session_id';

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

// Tạo hoặc lấy sessionId (gọi bất kỳ lúc nào, kể cả chưa đăng nhập)
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4(); // Sinh UUID ngẫu nhiên
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};