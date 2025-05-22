import axios from 'axios';
import { PostDetailResponse, PostResponse,PlaylistResponse, PostWithUserInfo } from '../model/post/post';
import { APIResponse } from '../model/APIResponse';
import { Album, DetailPostResponse, Track } from '../model/post/Album';
import { PlaylistData } from '../model/post/Playlist';
import { Song,SongEditForm,SongDetail } from '../model/post/Song';
import { CommentCreationRequest } from '../model/post/Comment';
import { DecodedToken, getAccessToken } from '../utils/tokenManager';
import { apiConfig } from '../config';
import apiClient from './api';
import { Playlist } from '../components/songs/AddToPlaylistModal';
import { jwtDecode } from 'jwt-decode';
const API_BASE_URL = 'http://localhost:8484/content';


const accessToken = getAccessToken();
export const fetchPostDetail = async (postId: string): Promise<PostDetailResponse> => {
  const response = await axios.get<PostDetailResponse>(
    `${API_BASE_URL}/posts/detailPost/${postId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return response.data;
};
export const postSong = async (account_id: string): Promise<PostResponse[]> => {
  const response = await axios.get<APIResponse<PostResponse[]>>(`${API_BASE_URL}/posts/${account_id}/songs` );
  return response.data.result;
};
export const addSongToPlaylist = async (postId: string , songId: string): Promise<APIResponse<any>> => {
  const response = await axios.put<APIResponse<any>>(
    `${API_BASE_URL}/posts/${postId}?songId=${songId}`,null,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
export const getSongRecently = async (): Promise<PostResponse[]>  => {
  const response = await axios.get<APIResponse<PostResponse[]>>(`${API_BASE_URL}/posts/songs/recently` );
  return response.data.result;
}

export const likePost = (postId: string) => {
	apiClient.post(apiConfig.endpoints.user.likePost(postId));
};
export const unlikePost = (postId: string) => {
	apiClient.delete(apiConfig.endpoints.user.likePost(postId));
};

export const repost = async (postId: string) => {
  await axios.post(`${API_BASE_URL}/posts/${postId}/repost`);
};

export const addComment = async (content: CommentCreationRequest): Promise<APIResponse<any>> => {
	const response = await apiClient.post(
		apiConfig.endpoints.user.addComment,
		content
	);
	return response.data;
};

export const editComment = async ( commentId: string, content: string) => {
  await axios.put(`${API_BASE_URL}/comments?commentId=${commentId}`, { content });
};

export const deleteComment = async ( commentId: string ) => {
  await axios.delete(`${API_BASE_URL}/comments?commentId=${commentId}`);
};

export const getTopLevelComment = async ( postId: string ) => {
  const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
  return response.data;
};

export const getReplies = async ( parentCommentId: string ) => {
  await axios.get(`${API_BASE_URL}/comments/replies/${parentCommentId}`);
};

export const getTopSongWeekly = async (page: number, size: number) => {
  const response = await axios.get(`${API_BASE_URL}/top/songs/weekly?page=${page}&size=${size}`)
  return response.data.result;
}

export const likeComment = async (commentId: string) => {
  await axios.post(`${API_BASE_URL}/comments/${commentId}/like`);
};
export const getPlaylist = async (account_id: string) : Promise<Playlist[]> => {
  const response = await axios.get<APIResponse<Playlist[]>>(`${API_BASE_URL}/posts/${account_id}/playlists`,{
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  } );
  return response.data.result;
};
export const getBasicPlaylist = async (songId : string) : Promise<APIResponse<PlaylistResponse[]>> => {
  let accountId = '';
  if(accessToken){
    const decodedToken = jwtDecode<DecodedToken>(accessToken);
    accountId = decodedToken.sub;
  }
  const response = await axios.get<APIResponse<PlaylistResponse[]>>(
    `${API_BASE_URL}/posts/playlist/${accountId}?songId=${songId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return response.data;
}
export const getAlbumOfUser = async(accountId : string) : Promise<APIResponse<Album>> => {
  const response = await axios.get(`${API_BASE_URL}/posts/${accountId}/album` );
  return response.data;
};
export const uploadFile = async (formData : {file : File, type : string} ): Promise<APIResponse<any>> => {

  const response = await axios.post<APIResponse<string>>(`${API_BASE_URL}/posts/uploadFile`,formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}
export const createALbum = async (formData: { title: string, isPublic: boolean, tags: string[], cover: string, image: string, scheduleAt: any, songIds: string[] }): Promise<APIResponse<any>> => {
	const response = await apiClient.post<APIResponse<String>>(
		apiConfig.endpoints.artist.createAlbum,
		JSON.stringify(formData)
	);
	return response.data;
}

export const createPlaylist = async (formData: { title: string, isPublic: boolean, tags: string[], cover: string, image: string }): Promise<APIResponse<any>> => {
	const response = await apiClient.post<APIResponse<String>>(
		apiConfig.endpoints.user.createPlaylist,
		JSON.stringify(formData)
	);
	return response.data;
}
export const getAlbumDetail = async (postId: string): Promise<APIResponse<DetailPostResponse>> => {
  const response = await axios.get(
    `${API_BASE_URL}/posts/detailPost/${postId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return response.data;
};
export const getPlaylistDetail = async (postId: string): Promise<APIResponse<PlaylistData>> => {
  const response = await axios.get(
    `${API_BASE_URL}/posts/detailPost/${postId}`
  );
  return response.data;
};
export const getTrack = async () : Promise<APIResponse<Track[]>> => {
  const response = await axios.get<APIResponse<Track[]>>(
    `${API_BASE_URL}/posts/songs`
  );
  return response.data;
}
export const fetchPlaylists = async (accountId: string): Promise<APIResponse<PostWithUserInfo[]>> => {
  const response = await axios.get<APIResponse<PostWithUserInfo[]>>(
    `${API_BASE_URL}/posts/${accountId}/playlists`
  );
  return response.data;
}
export const getSongs = async (accountId: string): Promise<APIResponse<Song[]>> => {
  const response = await axios.get<APIResponse<Song[]>>(
    `${API_BASE_URL}/posts/${accountId}/songs`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return response.data;
}
export const editSong = async (songId: string, formData: SongEditForm): Promise<APIResponse<any>> => {
	const response = await apiClient.put<APIResponse<any>>(
		apiConfig.endpoints.user.editSong(songId),
		JSON.stringify(formData)
	);
	return response.data;
}
export const getSongDetail = async (songId: string): Promise<APIResponse<SongDetail>> => {
  const response = await axios.get<APIResponse<SongDetail>>(
    `${API_BASE_URL}/posts/detailPost/${songId}`
  );
  return response.data;
}
export const recordListen = async ( postId: string): Promise<void> => {
  const sessionId =sessionStorage.getItem("session_id")
    await axios.post(`${API_BASE_URL}/posts/listen`, null, {params: {sessionId,postId},
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
};
export const updateAlbum = async (postId : string,formData : any): Promise<APIResponse<any>> => {
  const response = await axios.put<APIResponse<any>>(
    `${API_BASE_URL}/posts/updateAlbum/${postId}`,
    JSON.stringify(formData),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
export const updatePlaylist = async (postId : string,formData : any): Promise<APIResponse<any>> => {
  const response = await axios.put<APIResponse<any>>(
    `${API_BASE_URL}/posts/updatePlaylist/${postId}`,
    JSON.stringify(formData),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
export const editTextPost = async (postId: string, formData: any): Promise<APIResponse<any>> => {
  const response = await apiClient.put<APIResponse<any>>(
    apiConfig.endpoints.user.editTextPost(postId),
    JSON.stringify(formData),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return  response.data;
}  