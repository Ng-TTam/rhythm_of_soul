import axios from "axios";
import { User } from "../model/profile/UserProfile";

const BASE_URL = "http://localhost:8080/identity";


class ProfileService{
      async getProfile(userId: string, token : string): Promise<User> {
        
        const response = await axios.get(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("ProfileService: ", response.data.result);
        return response.data.result;
      }
  

      async updateUserProfile(userId: string, updatedProfile: User, token :string): Promise<User> {
        const response = await axios.put<User>(`${BASE_URL}/users/${userId}`, updatedProfile,
          {
              
              headers: {
                Authorization: `Bearer ${token}`,
              },
          }
        );
        return response.data;
      }
}
const profileServiceInstance = new ProfileService();
export default profileServiceInstance;