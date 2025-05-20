import apiClient from ".";
import { apiConfig } from "../../config";
import { APIResponse } from "../../model/APIResponse";
import { CommentCreationRequest } from "../../model/post/Comment";
import { SongEditForm } from "../../model/post/Song";

export const createALbum = async (formData: { title: string, isPublic: boolean, tags: string[], cover: string, image: string, accountId: string, scheduleAt: any, songIds: string[] }): Promise<APIResponse<any>> => {
	const response = await apiClient.post<APIResponse<String>>(
		apiConfig.endpoints.artist.createAlbum,
		JSON.stringify(formData)
	);
	return response.data;
}

export const createPlaylist = async (formData: { title: string, isPublic: boolean, tags: string[], cover: string, image: string, accountId: string }): Promise<APIResponse<any>> => {
	const response = await apiClient.post<APIResponse<String>>(
		apiConfig.endpoints.user.createPlaylist,
		JSON.stringify(formData)
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

export const likePost = (postId: string) => {
	apiClient.post(apiConfig.endpoints.user.likePost(postId));
};
export const unlikePost = (postId: string) => {
	apiClient.delete(apiConfig.endpoints.user.likePost(postId));
};

export const addComment = async (content: CommentCreationRequest): Promise<APIResponse<any>> => {
	const response = await apiClient.post(
		apiConfig.endpoints.user.addComment,
		content
	);
	return response.data;
};

export const editComment = async (commentId: string, content: string) => {
	const response = await apiClient.put(
		apiConfig.endpoints.user.editComment(commentId),
		{ content }
	);
	return response.data;
};

export const deleteComment = async (commentId: string) => {
	await apiClient.post(apiConfig.endpoints.user.deleteComment(commentId));
};