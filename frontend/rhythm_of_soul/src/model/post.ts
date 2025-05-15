export interface Tag {
  id: string;
  name: string;
}

export interface SongContent {
  title: string;
  mediaUrl: string;
  imageUrl: string;
  coverUrl: string;
  songId?: string;
  tags: string[];
}
export interface ContentResponse {
  title?: string;
  mediaUrl?: string;
  imageUrl?: string;
  coverUrl?: string;
  tags?: string[];
  songIds?: SongContent[];
}
export interface PlaylistResponse {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  tracks: number;
}
export type PostType = 'TEXT' | 'SONG' | 'ALBUM' | 'PLAYLIST';

export interface PostResponse {
  id: string;
  account_id: string;
  type: PostType;
  caption?: string;
  content?: ContentResponse | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  _public: boolean;
}
export interface PostRequest {
  account_id: string;
  type: PostType;
  caption?: string;
  content?: ContentResponse | null;
  isPublic: boolean;
}
export interface PostWithUserInfo extends PostResponse {
  username: string;
  userAvatar: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  avatar: string;
}

export interface TextPostCardProps {
  post: PostWithUserInfo;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
}

export interface SongPostCardProps {
  post: PostWithUserInfo;
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onLike: () => void;
  onComment: () => void;
}

export interface CollectionPostCardProps {
  post: PostWithUserInfo;
  playingTrackId: string | null;
  likedTracks: { [key: string]: boolean };
  onPlayTrack: (songId: string) => void;
  onLike: () => void;
  onComment: () => void;
}

export interface PostModalProps {
  onClose: () => void;
  onPost: (postData: any) => void;
  currentUsername: string;
  currentUserAvatar: string;
  currentUserId: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface SongContent {
  title: string;
  mediaUrl: string;
  imageUrl: string;
  coverUrl: string;
  songId?: string;
  tags: string[];
}


export interface Post {
  id: string;
  account_id: string;
  type: PostType;
  caption?: string;
  content?: ContentResponse | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  _public: boolean;
  username?: string;
  userAvatar?: string;
}

export interface Comment {
  id: string;
  account_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  username?: string;
  userAvatar?: string;
  likes?: number;
}

export interface PostDetailResponse {
  code: number;
  message: string | null;
  data: {
    post: Post;
    likes: any[];
    comments: Comment[];
  };
}

export const currentUser: User = {
  id: '5678',
  username: 'Current User',
  avatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg'
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const formatPlays = (plays: number): string => {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
  return plays.toString();
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};