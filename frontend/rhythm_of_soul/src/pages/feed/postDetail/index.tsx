import {  useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopLevelComment, addComment } from '../../../services/postService';
import { CommentCreationRequest } from '../../../model/post/Comment';
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

// Current user
const currentUser: User = {
  id: '123',
  username: 'CurrentUser',
  avatar: '/assets/images/default/avatar.jpg'
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
          src={currentUser.avatar}
          alt={currentUser.username}
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
export default function CommentSection() {

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
        }
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
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
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