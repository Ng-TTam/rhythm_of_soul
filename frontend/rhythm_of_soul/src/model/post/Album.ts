export interface Album {
  id: string;
  title: string;
  tracks: number;
  isPublic: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  coverUrl: string;
  imageUrl: string;
  tags?: string[];
  createdAt: string;
  caption?: string;
  isLiked: boolean;
  scheduleAt?: Date | null;
}
export interface AlbumResponse {
  album: Album;
  songs: Track[];
}
export interface AddAlbumModalProps {
  show: boolean;
  onHide: () => void;
  onAddAlbum: (newAlbum: {
    title: string;
    isPublic: boolean;
    tags: string[];
    coverImage: File | null;
    image: File | null;
    tracks: string[];
    scheduleAt: Date | null;
  }) => Promise<void>;
 
}
export interface EditAlbumModalProps {
  show: boolean;
  onHi: () => void;
  onEditAlbum: (newAlbum: {
    title: string;
    isPublic: boolean;
    tags: string[];
    coverUrl: string;
    imageUrl: string;
    tracks: string[];
    caption ?: string;
    scheduleAt: Date | null;
  }) => Promise<void>;
  postId ?: string;
}

export interface Track {
  songId: string;
  title: string;
  imageUrl: string;
}
export interface Song {
  title: string;
  mediaUrl: string;
  imageUrl: string;
  coverUrl: string;
  songId: string;
  tags: string[];
  artist?: string;
}

export interface AlbumContent {
  title: string;
  imageUrl: string;
  coverUrl: string;
  tags: string[];
  songIds: Song[];
}

export interface AlbumDetail {
  id: string;
  user_id: string;
  type: string;
  caption: string;
  content: AlbumContent;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  _public: boolean;
  schedule_at: string;
}

export interface Comment {
  id: string;
  content: string;
  account_id: string;
  username: string;
  avatar: string;
  created_at: string;
}

export interface DetailPostResponse {
  post: AlbumDetail;
  likes: string[];
  comments: Comment[];
}