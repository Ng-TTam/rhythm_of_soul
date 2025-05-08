import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJyaHl0aG1fb2Zfc291bC5jb20iLCJzdWIiOiI2MWY4MzhmZC03NTI2LTRkNjYtOGYyOS02ZDMzMzljNWI4NWIiLCJleHAiOjE3NDY2OTI5MDMsImlhdCI6MTc0NjY4OTMwMywic2NvcGUiOiJST0xFX0FETUlOIn0.k099Ma3MH-2w4Q_GGkvzPkCTQ9owW8XXuCIB3d-WDSh0ZeTIPv79veAhdl9P0DP0Mu8Aac8FGR-qMDKzp_vFBw';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token,
  },
});

export const getUsers = async (
  page: number,
  size: number,
  roles?: string,
  status?: string,
  keySearch?: string
) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (roles) params.append('roles', roles);
  if (status) params.append('status', status);
  if (keySearch) params.append('keySearch', keySearch);

  const response = await axiosInstance.get(`/identity/accounts?${params.toString()}`);
  return response.data;
};



export const lockUser = async (userId: string, reason: string) => {
  const response = await axiosInstance.patch(
    `/identity/account/lock/${userId}`,
    { reason } 
  );
  return response.data;
};



export const unlockUser = async (userId: string) => {
  const response = await axiosInstance.patch(`/identity/account/unlock/${userId}`);
  return response.data;
};

