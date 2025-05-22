export interface Song {
  id: string;
  mediaUrl?: string;
  imageUrl?: string;
  title?: string;
  artist?: string;
  tags?: string[];
}
export interface CurrentUser {
  id: string;
  username: string;
  avatar: string;
}
export interface  AddPlaylistModalProps {
  show: boolean;
  onHide: () => void;
  onCreate: (playlistData: {
    title: string;
    isPublic: boolean;
    cover?: File;
    image? : File
    tags: string[];
  }) => Promise<void>;
  isCreating: boolean;
  error?: string | null;
}



export interface PlaylistData {
  post: {
    content: {
      coverUrl?: string;
      title?: string;
      songIds?: Song[];
      imageUrl?: string;
      tags?: string[];
      description?: string;
    };
    type?: string;
    created_at?: string;
    view_count?: number;
    like_count?: number;
    comment_count?: number;
    caption?: string;
  };
  comments?: {
    user?: { 
      avatar?: string; 
      username?: string 
    };
    created_at?: string;
    content?: string;
  }[];
  isLiked?: boolean;
}
export interface EditPlaylistModalProps {
  show: boolean;
  onHi: () => void;
  onEditPlaylist: (newAlbum: {
    title: string;
    isPublic: boolean;
    tags: string[];
    coverUrl: string;
    imageUrl: string;
    tracks: string[];
    caption: string;
  }) => Promise<void>;
  postId ?: string;
}