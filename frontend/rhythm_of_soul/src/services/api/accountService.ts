import apiClient from './index';
import { apiConfig } from '../../config';
import { APIResponse } from '../../model/APIResponse';

export const getUsers = async (
  page: number,
  size: number,
  roles?: string,
  status?: string,
  keySearch?: string
): Promise<APIResponse<any>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (roles) params.append('roles', roles);
  if (status) params.append('status', status);
  if (keySearch) params.append('keySearch', keySearch);

  const response = await apiClient.get<APIResponse<any>>(
    `${apiConfig.endpoints.user.get_users}?${params.toString()}`
  );
  return response.data;
};

export const lockUser = async (userId: string, reason: string) => {
  const response = await apiClient.patch<APIResponse<any>>(
    apiConfig.endpoints.admin.lock_user(userId),
    { reason }
  );
  return response.data;
};



export const unlockUser = async (userId: string) => {
  const response = await apiClient.patch<APIResponse<any>>(
    apiConfig.endpoints.admin.unlock_user(userId)
  );
  return response.data;
};
