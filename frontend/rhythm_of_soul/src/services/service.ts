import { Account } from "../model/account";
import axios from "axios";
import { APIResponse } from "../model/APIResponse";
import { Introspect } from "../model/Introspect";
import { User } from "../model/User";
const API_URL = "http://localhost:8080/identity/auth";

class LoginService {
  async login(account: Account): Promise<APIResponse<any>> {
    const response = await axios.post<APIResponse<any>>(
      `${API_URL}/login`,
      account,{ withCredentials: true }
    );
    return response.data;
  }
  async verifyToken(): Promise<APIResponse<Introspect>> {
    const response = await axios.get<APIResponse<Introspect>>(
      `${API_URL}/introspect`,{withCredentials: true}
    );
    return response.data;
  }
  async sign_up(User: User): Promise<APIResponse<any>> {
    const response = await axios.post<APIResponse<any>>(
      "http://localhost:8080/identity/users",
      User
    );
    return response.data;
  }
}
export default new LoginService();

