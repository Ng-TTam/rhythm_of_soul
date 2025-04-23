import axios from "axios";
import { User } from "../model/UserProfile";
const BASE_URL = "http://localhost:3001";

class ProfileService{
    async getUserProfile(userId: string): Promise<User> {
        const response = await axios.get<User>(`${BASE_URL}/users/${userId}`);
        return response.data;
      }

      async updateUserProfile(userId: string, updatedProfile: User): Promise<User> {
        const response = await axios.put<User>(`${BASE_URL}/users/${userId}`, updatedProfile);
        return response.data;
      }
}
export default new ProfileService();