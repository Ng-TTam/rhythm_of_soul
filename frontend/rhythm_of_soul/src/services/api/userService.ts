import apiClient from './index';
import { apiConfig } from '../../config';
import { User } from '../../model/profile/UserProfile';
import { APIResponse } from '../../model/APIResponse';
import { AssignArtistRequest } from '../../model/profile/AssignArtistRequest';
import { UpdateUserRequest } from '../../model/profile/UpdateUserRequest';
import axios from 'axios';

import { PageResponse } from '../../model/PageRespone';

interface AssignArtistResponse {
}

interface SearchUserResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: User[];
}
export interface UserInfo {
  account_id: string;
  first_name: string;
  last_name: string;
  avatar : string;
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
  return response.data.result;
};

export const assignArtist = async (data: AssignArtistRequest): Promise<AssignArtistResponse> => {
  const response = await apiClient.post(apiConfig.endpoints.user.assign_artist, data);
  return response.data;
};

export const searchUsers = async (searchKey: string, token: string, page: number): Promise<SearchUserResponse> => {
  console.log("token: ", token);
  const response = await apiClient.get<APIResponse<SearchUserResponse>>(
    apiConfig.endpoints.user.searchUser(),
    {
      params: { page, size: 5, searchKey },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("response: ", response);

  return response.data.result; 
};

export const followUser = async (userId: string, token: string): Promise<void> => {
  await apiClient.post(apiConfig.endpoints.user.follow(userId), {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const unfollowUser = async (userId: string, token: string): Promise<void> => {
  await apiClient.delete(apiConfig.endpoints.user.unfollow(userId), {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getUserByAccountId = async (accountIdId: string): Promise<APIResponse<UserInfo>> => {
  const response = await axios.get<APIResponse<UserInfo>>(
    `http://localhost:8080/identity/users/information/${accountIdId}`
  )
  return response.data;
}
export const getFollowingIds = async (userId: string, token: string): Promise<string[]> => {
  const response = await apiClient.get<APIResponse<string[]>>(
    apiConfig.endpoints.user.getFollowingIds(userId),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("data: ", response.data);

  // Trả về danh sách userId đang follow
  return response.data.result;
};

export const getPresignedUrl = async (objectName: string, contentType: string, token: string) => {
  const response = await apiClient.get<{ url: string; objectUrl: string }>(
    apiConfig.endpoints.upload.presignedUrl(objectName, contentType),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const getFollowers = async (userId: string, token: string): Promise<User[]> => {
  const response = await apiClient.get<APIResponse<User[]>>(
    apiConfig.endpoints.user.getFollowers(userId),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.result;
};
export const getFollowing = async (userId: string, token: string): Promise<User[]> => {
  const response = await apiClient.get<APIResponse<User[]>>(
    apiConfig.endpoints.user.getFollowing(userId),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.result;
};

export const getAssignArtist = async (
  page: number,
  size: number,
  keySearch?: string,
  status?: string
): Promise<PageResponse<User>> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (keySearch) params.append("searchKey", keySearch);
  if (status) params.append('status', status);

  const response = await apiClient.get<APIResponse<PageResponse<User>>>(
    `${apiConfig.endpoints.user.get_assigned_artist}?${params.toString()}`
  );

  return response.data.result; 
};

export const upgradeArtist = async (userId: string) => {
  const res = await apiClient.post<APIResponse<any>>(apiConfig.endpoints.user.upgradeArtist(userId));
  return res.data;
};

export const revokeArtist = async (userId: string) => {
  const res = await apiClient.post<APIResponse<any>>(apiConfig.endpoints.user.revokeArtist(userId));
  return res.data;
};