export interface CommentCreationRequest { 
  postId: string;
  content: string;
  parentId: string | null;
}