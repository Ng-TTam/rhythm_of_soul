import axios from 'axios';
import { PostDetailResponse, PostResponse,PlaylistResponse } from '../model/post';
import { APIResponse } from '../model/APIResponse';


const API_BASE_URL = 'http://localhost:8484';

export const fetchPostDetail = async (postId: string): Promise<PostDetailResponse> => {
  const response = await axios.get<PostDetailResponse>(
    `${API_BASE_URL}/posts/detailPost/${postId}`
  );
  return response.data;
};
export const postSong = async (account_id: string): Promise<PostResponse[]> => {
  const response = await axios.get<APIResponse<PostResponse[]>>(`${API_BASE_URL}/posts/${account_id}/songs` );
  return response.data.result;
};
export const likePost = async (postId: string) => {
  await axios.post(`${API_BASE_URL}/posts/${postId}/like`);
};

export const repost = async (postId: string) => {
  await axios.post(`${API_BASE_URL}/posts/${postId}/repost`);
};

export const addComment = async (postId: string, content: string) => {
  await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, { content });
};

export const likeComment = async (commentId: string) => {
  await axios.post(`${API_BASE_URL}/comments/${commentId}/like`);
};
export const getPlaylist = async (account_id: string) : Promise<PlaylistResponse[]> => {
  const response = await axios.get<APIResponse<PlaylistResponse[]>>(`${API_BASE_URL}/posts/${account_id}/playlists` );
  return response.data.result;
};