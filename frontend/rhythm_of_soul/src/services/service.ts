import { Account } from "../model/account";
import axios from "axios";
import { APIResponse } from "../model/APIResponse";
import { Introspect } from "../model/Introspect";
import { User } from "../model/User";
import { Auth } from "../model/Auth";
const API_URL = "http://localhost:8080/identity/auth";

class LoginService {
  async login(account: Account): Promise<APIResponse<Auth>> {
    console.log("LoginService: ", account);
    const response = await axios.post<APIResponse<Auth>>(
      `${API_URL}/login`,
      account,{ withCredentials: true }
    );
    return response.data;
  }
  async verifyToken(): Promise<APIResponse<Introspect>> {
    const response = await axios.get<APIResponse<Introspect>>(
      `${API_URL}/introspect`,{withCredentials: true}
    );
    console.log("LoginService: ", response.data);
    return response.data;
  }
  async sign_up(User: User): Promise<APIResponse<any>> {
    const response = await axios.post<APIResponse<any>>(
      "http://localhost:8080/identity/users",
      User
    );
    return response.data;
  }
  async logout(): Promise<APIResponse<any>> {
    const response = await axios.post<APIResponse<any>>(
      `${API_URL}/logout`, 
      {},  // Body nếu có dữ liệu cần gửi, nếu không thì truyền {} (một object rỗng)
      {
        withCredentials: true  // Đặt config ở đây
      }
    );
    return response.data;
  }

  async resetPasswordRequest(email: string): Promise<APIResponse<any>> {
    const response = await axios.post<APIResponse<any>>(
      "http://localhost:8080/identity/reset-password/request",
      { email }
    );
    return response.data;
  }
  async resetPasswordVerify(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<APIResponse<any>> {
    const response = await axios.post(
      "http://localhost:8080/identity/reset-password/verify",
      data
    );
    return response.data;
  }
  
  
}
export default new LoginService();

