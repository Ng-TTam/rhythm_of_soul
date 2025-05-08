import apiClient from './index';
import { apiConfig } from '../../config';
import { User } from '../../model/profile/UserProfile';
import { APIResponse } from '../../model/APIResponse';

interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber: string;
  avatar?: string ;
  cover?: string;
  artistProfile?: {
    stageName: string;
    bio: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
  };
  // artist: boolean; // user is artist can update artist profile
}

interface AssignArtistRequest {
    stageName: string;
    bio: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
}

interface AssignArtistResponse {
}


export const getUserByPreEmail = async (preEmail: string): Promise<User> => {
  const response = await apiClient.get<APIResponse<User>>(
    apiConfig.endpoints.user.get_by_pre_email(preEmail)
  );
  return response.data.result;
};

export const updateUser = async (userId: string, data: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put<APIResponse<User>>(
    apiConfig.endpoints.user.update(userId), data);
  return response.data.result;
};

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get(apiConfig.endpoints.user.profile);
  return response.data;
};

export const assignArtist = async (data: AssignArtistRequest): Promise<AssignArtistResponse> => {
  const response = await apiClient.post(apiConfig.endpoints.user.assign_artist, data);
  return response.data;
};