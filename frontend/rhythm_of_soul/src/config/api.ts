import { config } from './environment';

const contentURL = 'http://localhost:8484'
// Định nghĩa kiểu cho endpoints
interface AuthEndpoints {
  login: string;
  log_out: string;
  register: string;
  refresh_token: string;
  reset_pass: string;
  reset_pass_verify: string;
}

interface UserEndpoints {
  get_by_pre_email: (preEmail: string) => string;
  update: (userId: string) => string;
  profile: string;
  assign_artist: string;
  get_users: string;
  searchUser: () => string;
  follow: (userId: string) => string;
  unfollow: (userId: string) => string;
  getFollowingIds: (userId: string) => string;
  getFollowers: (userId: string) => string;
  getFollowing: (userId: string) => string;
  createPlaylist: string;
  editSong: (songId: string) => string;
  likePost: (postId: string) => string;
  unlikePost: (postId: string) => string;
  addComment: string;
  editComment: (commentId: string) => string;
  deleteComment: (commentId: string) => string;
}

interface ArtistEndpoints {
  createAlbum: string;
}

interface AdminEndpoints {
  lock_user: (userId: string) => string;
  unlock_user: (userId: string) => string;
}

interface NotificationEndpoints {
  getListNoti: (userId: string) => string;
  markAllRead: (userId: string) => string;
  getLatestNoti: (userId: string, days?: number) => string;
}

interface UploadEndpoints {
  presignedUrl: (objectName: string, contentType: string) => string;
}

interface ApiEndpoints {
  auth: AuthEndpoints;
  user: UserEndpoints;
  artist: ArtistEndpoints;
  admin: AdminEndpoints;
  notification: NotificationEndpoints;
  upload: UploadEndpoints;
}

export const apiConfig = {
  baseUrl: config.apiBaseUrl,
  endpoints: {
    auth: {
      login: `${config.apiBaseUrl}/identity/auth/login`,
      log_out: `${config.apiBaseUrl}/identity/auth/logout`,
      register: `${config.apiBaseUrl}/identity/api/sign-up`,
      refresh_token: `${config.apiBaseUrl}/identity/auth/refresh`,
      reset_pass: `${config.apiBaseUrl}/identity/reset-password/request`,
      reset_pass_verify: `${config.apiBaseUrl}/identity/reset-password/verify`,
    },
    user: {
      get_by_pre_email: (preEmail: string) => `${config.apiBaseUrl}/identity/users/${preEmail}`,
      update: (userId: string) => `${config.apiBaseUrl}/identity/users/${userId}`,
      profile: `${config.apiBaseUrl}/identity/users/me`,
      assign_artist: `${config.apiBaseUrl}/identity/users/assign-artist`,
      get_users: `${config.apiBaseUrl}/identity/accounts`,
      searchUser: () => `${config.apiBaseUrl}/identity/users/searchUser`,
      follow: (userId: string) => `${config.apiBaseUrl}/identity/follow/${userId}`,
      unfollow: (userId: string) => `${config.apiBaseUrl}/identity/unfollow/${userId}`,
      getFollowingIds: (userId: string) => `${config.apiBaseUrl}/identity/${userId}/followingIds`,
      getFollowers: (userId: string) => `${config.apiBaseUrl}/identity/${userId}/followers`,
      getFollowing: (userId: string) => `${config.apiBaseUrl}/identity/${userId}/following`,
      createPlaylist: `${contentURL}/content/posts/playlist`,
      editSong: (songId: string) => `${contentURL}/content/posts/${songId}`,
      likePost: (postId: string) => `${contentURL}/content/likes?postId=${postId}`,
      unlikePost: (postId: string) => `${contentURL}/content/likes?postId=${postId}`,
      addComment: `${contentURL}/content/comments`,
      editComment: (commentId: string, content: string) => `${contentURL}/content/comments?commentId=${commentId}`,
      deleteComment: (commentId: string) => `${contentURL}/content/comments?commentId=${commentId}`,
    },
    artist: {
      createAlbum: `${contentURL}/content/posts/album`,
    },
    admin: {
      lock_user: (userId: string) => `/identity/account/lock/${userId}`,
      unlock_user: (userId: string) => `/identity/account/unlock/${userId}`,
    },
    notification: {
      getListNoti: (userId: string) => `http://localhost:8081/notification/listNoti?userId=${userId}`,
      markAllRead: (userId: string) => `http://localhost:8081/notification/mark-all-read/${userId}`,
      getLatestNoti: (userId: string, days: number = 7) =>
        `http://localhost:8081/notification/latest/${userId}?days=${days}`,
    },
    upload: {
      presignedUrl: (objectName: string, contentType: string) =>
        `${config.apiBaseUrl}/identity/api/upload/presigned-url?objectName=${objectName}&contentType=${encodeURIComponent(contentType)}`
    },

  } as ApiEndpoints,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
};