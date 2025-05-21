import {  use, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopLevelComment, addComment } from '../../../services/postService';
import { CommentCreationRequest } from '../../../model/post/Comment';
import { getAccessToken } from '../../../utils/tokenManager';
import { getUserByAccountId} from '../../../services/api/userService';
import { jwtDecode } from 'jwt-decode';
// Types
interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface Comment {
  id: string;
  accountId: string;
  content: string;
  username: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt: string | null;
  likes: number;
  isArtist?: boolean;
  child_comments?: Comment[];
}

// Helper to get relative time
const getRelativeTime = (timestamp: string) => {
  const now = new Date();
  const commentDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};




// Comment Form Component
interface CommentFormProps {
  onSubmit: (content: string, parentId?: string | null) => void;
  replyTo?: { id: string; username: string } | null;
  onCancelReply: () => void;
}

const CommentForm = ({ onSubmit, replyTo = null, onCancelReply }: CommentFormProps) => {
  const [commentContent, setCommentContent] = useState(
    replyTo ? `${replyTo.username} ` : ''
  );
  const accessToken = getAccessToken();
  let userId = '';
  if(accessToken){
    userId = jwtDecode(accessToken).sub || '';
  }
  const currentUser = useRef<User>({
    id: userId,
    username: 'User',
    avatar: '/assets/images/default/avatar.jpg'
  });
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUserByAccountId(userId);
      if (response.code === 200) {
        currentUser.current = {
          id: response.result.account_id,
          username: response.result.first_name + ' ' + response.result.last_name,
          avatar: response.result.avatar || '/assets/images/default/avatar.jpg'
        };
      }
    };
    fetchUser();
  }, [userId]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onSubmit(commentContent, replyTo?.id);
      setCommentContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {replyTo && (
        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-lg mb-2">
          <span>
            Replying to <span className="font-semibold text-blue-600">{replyTo.username}</span>
          </span>
          <button
            type="button"
            className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"
            onClick={onCancelReply}
            aria-label="Cancel reply"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-start gap-2">
        <img
          src={currentUser.current.avatar}
          alt={currentUser.current.username}
          className="w-8 h-8 rounded-full"
        />
        <textarea
          placeholder={replyTo ? `Reply to ${replyTo.username}...` : "Write a comment..."}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="flex-1 rounded-2xl resize-none p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
        <button
          type="submit"
          className={`rounded-full w-10 h-10 flex items-center justify-center ${commentContent.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          disabled={!commentContent.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

// Comment Item Component
interface CommentItemProps {
  comment: Comment;
  isLiked: boolean;
  isChild?: boolean;
  onLike: (id: string) => void;
  onReply: (id: string, username: string) => void;
  isReplyActive?: boolean;
  replyTo?: { id: string; username: string } | null;
  onSubmitReply: (content: string, parentId?: string | null) => void;
  onCancelReply: () => void;
}

const CommentItem = ({
  comment,
  isLiked,
  isChild,
  onLike,
  onReply,
  isReplyActive,
  replyTo,
  onSubmitReply,
  onCancelReply
}: CommentItemProps) => {
  // Parse mention in child comments
  const contentWithMention = isChild && comment.content.includes('@')
    ? comment.content.replace(/@(\w+)/, '<span class="text-blue-600 font-medium">@$1</span>')
    : comment.content;

  return (
    <div className={`${isChild ? 'mt-2 ml-10' : 'mt-4'}`}>
      <div className="flex">
        <img
          src={comment.userAvatar || '/api/placeholder/32/32'}
          alt={comment.username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <div className="flex items-center">
              <span className="font-semibold mr-2">{comment.username}</span>
              {comment.isArtist && (
                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Artist
                </span>
              )}
              {!comment.isArtist && (
                <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  User
                </span>
              )}
              <span className="text-xs text-gray-500">{getRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="mt-1" dangerouslySetInnerHTML={{ __html: contentWithMention }} />
          </div>
          <div className="flex gap-4 mt-1 ml-2">
            <button
              className={`text-xs font-semibold flex items-center ${isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => onLike(comment.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {comment.likes || 0}
            </button>
            <button
              className="text-xs font-semibold flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => onReply(comment.id, comment.username)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Reply
            </button>
          </div>
        </div>
      </div>

      {isReplyActive && replyTo?.id === comment.id && (
        <div className="ml-10 mt-2">
          <CommentForm
            onSubmit={onSubmitReply}
            replyTo={replyTo}
            onCancelReply={onCancelReply}
          />
        </div>
      )}
    </div>
  );
};

// Comment List Component
interface CommentListProps {
  comments: Comment[];
  likedComments: Record<string, boolean>;
  onLike: (id: string) => void;
  onReply: (id: string, username: string) => void;
  replyTo?: { id: string; username: string } | null;
  onSubmitReply: (content: string, parentId?: string | null) => void;
  onCancelReply: () => void;
}

const CommentList = ({
  comments,
  likedComments,
  onLike,
  onReply,
  replyTo,
  onSubmitReply,
  onCancelReply
}: CommentListProps) => {
  return (
    <div className="mt-4">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              isLiked={!!likedComments[comment.id]}
              onLike={onLike}
              onReply={onReply}
              isReplyActive={replyTo?.id === comment.id}
              replyTo={replyTo}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
            />

            {comment.child_comments && comment.child_comments.length > 0 && (
              <div className="ml-10">
                <CommentList
                  comments={comment.child_comments}
                  likedComments={likedComments}
                  onLike={onLike}
                  onReply={onReply}
                  replyTo={replyTo}
                  onSubmitReply={onSubmitReply}
                  onCancelReply={onCancelReply}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

// Main Comment Section Component
interface CommentSectionProps {
  commentCount: number;
  onAddComment: (newComment: Comment) => void;
}
const CommentSection: React.FC<CommentSectionProps> = ({
  commentCount,
  onAddComment
}) =>  {

  const [comments, setComments] = useState<Comment[]>([]);

  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);

  const postId = useParams().postId;
  console.log('Post ID:', postId);
  useEffect(() => {
    const fetchComments = async () => {
      const response = await getTopLevelComment(postId ?? '');
      console.log('Fetched comments:', response);
      if (response.code === 200) {
        setComments(
          response.result.map((comment: Comment) => ({
            ...comment,
            child_comments: comment.child_comments || []
          }))
        );
      }
    };
    fetchComments();
  }, [postId]);
  const fetchAddComments = async (content: CommentCreationRequest) => {
    try {
      const response = await addComment(content);
      console.log('Add comments:', response);
      if (response.code === 200) {
        return response.result;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
  const handleLike = (commentId: string) => {
    const newLikedState = !likedComments[commentId];
    setLikedComments(prev => ({ ...prev, [commentId]: newLikedState }));

    const updateLikes = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: newLikedState ? comment.likes + 1 : comment.likes - 1 };
        }
        if (comment.child_comments) {
          return { ...comment, child_comments: updateLikes(comment.child_comments) };
        }
        return comment;
      });
    };

    setComments(prev => updateLikes(prev));
  };

  const handleReply = (id: string, username: string) => {
    setReplyTo({ id, username });
  };

  const handleSubmitComment = (content: string, parentId?: string | null) => {
    const addCommentRequest: CommentCreationRequest = {
      content,
      postId: postId ?? '',
      parentId: parentId || null
    };
    let newComment = {
      id: '',
      accountId: '',
      content: '',
      username: '',
      userAvatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: null as string | null,
      likes: 0,
      isArtist: false // Default to regular user
    };
    fetchAddComments(addCommentRequest)
      .then((comment: Comment) => {
        newComment = {
          id: comment.id,
          accountId: comment.accountId,
          content: comment.content,
          username: comment.username,
          userAvatar: comment.userAvatar || '',
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          likes: 0,
          isArtist: comment.isArtist || false
        }
        commentCount++;
        onAddComment(newComment); 
        if (parentId) {
          const addReply = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  child_comments: [...(comment.child_comments || []), newComment]
                };
              }
              if (comment.child_comments) {
                return { ...comment, child_comments: addReply(comment.child_comments) };
              }
              return comment;
            });
          };

          setComments(prev => addReply(prev));
        } else {
          setComments(prev => [...prev, newComment]);
        }

        setReplyTo(null);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  return (
    <div className=" mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      {!replyTo && (
        <CommentForm
          onSubmit={handleSubmitComment}
          onCancelReply={() => setReplyTo(null)}
        />
      )}

      <CommentList
        comments={showAll ? comments : comments.slice(0, 3)}
        likedComments={likedComments}
        onLike={handleLike}
        onReply={handleReply}
        replyTo={replyTo}
        onSubmitReply={handleSubmitComment}
        onCancelReply={() => setReplyTo(null)}
      />

      {comments.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 font-medium mt-4 text-sm"
        >
          {showAll ? 'Show fewer comments' : `Show all ${comments.length} comments`}
        </button>
      )}
    </div>
  );
}
export default CommentSection;