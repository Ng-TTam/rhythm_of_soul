export interface Song {
  id: string ;
  content: {
    imageUrl: string;
    title: string;
    tags: string[];
    mediaUrl: string;
  };
  caption?: string;
  _public: boolean;
  like_count?: number;
  comment_count?: number;
  view_count?: number;
  created_at: string;
  account_id: string; 
}

export interface SongEditForm {
  title: string;
  caption: string;
  tags: string[];
}
export interface Comment {
  id: string;
  account_id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface Post {
  content: {
    imageUrl?: string;
    title: string;
    tags: string[];
    coverUrl?: string;
    mediaUrl?: string;
  };
  caption?: string;
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  _public: boolean;
  account_id: string;
}

export interface SongDetail {
  post: Post;
  likes: Array<{ id: string; user: { name: string; avatar: string }; created_at: string }>;
  comments?: Comment[];
}