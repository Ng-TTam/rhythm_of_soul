import { useState, useEffect } from 'react';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill';
import { BsHeart } from '@react-icons/all-files/bs/BsHeart';
import { BsHeartFill } from '@react-icons/all-files/bs/BsHeartFill';
import { BsChat } from '@react-icons/all-files/bs/BsChat';
import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { BsClock } from '@react-icons/all-files/bs/BsClock';
import { BsDownload } from '@react-icons/all-files/bs/BsDownload';
import { BsReply } from '@react-icons/all-files/bs/BsReply';
import { useNavigate, useParams } from 'react-router-dom';
import { MdPublic } from '@react-icons/all-files/md/MdPublic';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface Post {
  content: {
    imageUrl: string;
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
  user_id: string;
}

interface SongDetail {
  post: Post;
  likes: Array<{ id: string; user: { name: string; avatar: string }; created_at: string }>;
  comments: Comment[];
}

export default function PostSongDetail() {
  const [songDetail, setSongDetail] = useState<SongDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const navigate = useNavigate();
  // Get postId from URL params or use default
  const postId = useParams<{ songId: string }>();
  console.log(postId) // In a real app, this would come from route params
  
  useEffect(() => {
    const fetchSongDetail = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:8484/posts/${postId.songId}`;
        console.log(url)
        const response = await fetch(url);
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch song details');
        }
        
        const data = await response.json();
        setSongDetail(data.result);
        
        // Reset states when a new song is loaded
        setIsPlaying(false);
        setIsLiked(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSongDetail();
  }, [postId]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Here you would also implement audio playback logic
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you would call an API to like/unlike the post
  };
  
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    // In a real app, you would call an API to post the comment
    console.log("Submitting comment:", newComment);
    
    // Mock adding a comment locally
    if (songDetail) {
      const updatedDetail = {
        ...(songDetail ?? {}),
        comments: [
          {
            id: `temp-${Date.now()}`,
            user_id: "current-user",
            content: newComment,
            created_at: new Date().toISOString(),
            user: { name: "Current User", avatar: "/api/placeholder/40/40" }
          },
          ...songDetail.comments
        ],
        post: {
          ...songDetail.post,
          comment_count: songDetail.post.comment_count + 1
        }
      };
      setSongDetail(updatedDetail);
    }
    
    setNewComment('');
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error: {error}
      </div>
    );
  }
  
  if (!songDetail) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Song not found
      </div>
    );
  }
  
  const { post, likes, comments } = songDetail;
  const displayComments = showAllComments ? comments : comments.slice(0, 3);
  
  return (
    <div className="container py-4">
      <div className="row">
        {/* Left column: Song info and player */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            {/* Song cover and play button */}
            <div className="position-relative">
              <img 
                src={post.content.imageUrl} 
                alt={post.content.title}
                className="card-img-top"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              <div 
                className="position-absolute top-50 start-50 translate-middle p-3 bg-dark bg-opacity-50 rounded-circle"
                style={{ cursor: 'pointer' }}
                onClick={togglePlay}
              >
                {isPlaying ? 
                  <BsPauseFill size={50} color="white" /> : 
                  <BsPlayFill size={50} color="white" />
                }
              </div>
              
              <div className="position-absolute bottom-0 start-0 m-3 p-2 bg-dark bg-opacity-50 rounded">
                {post._public ? 
                  <MdPublic size={24} color="white" /> : 
                  <MdPublic size={24} color="white" />
                }
                <span className="ms-2 text-white">
                  {post._public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
            
            {/* Song title and info */}
            <div className="card-body">
              <h3 className="card-title fw-bold">{post.content.title}</h3>
              {post.caption && <p className="card-text">{post.caption}</p>}
              
              <div className="d-flex align-items-center mt-3">
                <div className="me-3">
                  <BsClock className="text-muted me-1" />
                  <small className="text-muted">
                    {new Date(post.created_at).toLocaleDateString()}
                  </small>
                </div>
                
                <div className="me-3">
                  <BsEyeFill className="text-muted me-1" />
                  <small className="text-muted">{post.view_count} views</small>
                </div>
              </div>
              
              <div className="d-flex mt-3">
                {post.content.tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-primary me-1">{tag}</span>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="mt-4 d-flex">
                <button 
                  className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                  onClick={toggleLike}
                >
                  {isLiked ? <BsHeartFill /> : <BsHeart />}
                  <span className="ms-1">
                    {post.like_count + (isLiked ? 1 : 0)}
                  </span>
                </button>
                
                <button className="btn btn-outline-primary me-2">
                  <BsChat />
                  <span className="ms-1">{post.comment_count}</span>
                </button>
                
                <button className="btn btn-outline-secondary me-2">
                  <span className="ms-1">Share</span>
                </button>
                
                <button className="btn btn-outline-secondary">
                  <BsDownload />
                  <span className="ms-1">Download</span>
                </button>
              </div>
            </div>
            
            {/* Audio player would go here in a real implementation */}
            <div className="card-footer bg-light">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-primary me-2" 
                  onClick={togglePlay}
                >
                  {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
                </button>
                
                <div className="progress flex-grow-1">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: '0%' }} 
                    aria-valuenow={0} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
                
                <span className="ms-2">0:00 / 0:00</span>
              </div>
            </div>
          </div>
          
          {/* Comment section */}
          <div className="card mt-4 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="m-0">Comments ({post.comment_count})</h5>
            </div>
            
            <div className="card-body">
              {/* Comment input */}
              <div className="mb-4">
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Add a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCommentSubmit();
                      }
                    }}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </button>
                </div>
              </div>
              
              {/* Comments list */}
              {displayComments.length > 0 ? (
                <div>
                  {displayComments.map((comment) => (
                    <div key={comment.id} className="mb-3 p-3 border-bottom">
                      <div className="d-flex">
                        <img 
                          src={comment.user?.avatar || "/api/placeholder/40/40"} 
                          alt="User" 
                          className="rounded-circle me-2"
                          width="40" 
                          height="40" 
                        />
                        <div>
                          <div className="d-flex align-items-center">
                            <strong className="me-2">{comment.user?.name || 'Anonymous'}</strong>
                            <small className="text-muted">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-1">{comment.content}</p>
                          <button className="btn btn-sm text-muted p-0">
                            <BsReply /> Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {comments.length > 3 && (
                    <button 
                      className="btn btn-link p-0" 
                      onClick={() => setShowAllComments(!showAllComments)}
                    >
                      {showAllComments ? 'Show less comments' : `Show all ${comments.length} comments`}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-muted text-center">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column: Likes and related info */}
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="m-0">Likes ({likes.length})</h5>
            </div>
            
            <div className="card-body">
              {likes.length > 0 ? (
                <div>
                  {likes.map((like) => (
                    <div key={like.id} className="d-flex align-items-center mb-2">
                      <img 
                        src={like.user?.avatar || "/api/placeholder/32/32"} 
                        alt="User" 
                        className="rounded-circle me-2"
                        width="32" 
                        height="32" 
                      />
                      <div>
                        <strong>{like.user?.name || 'Anonymous'}</strong>
                        <small className="d-block text-muted">
                          {new Date(like.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No likes yet.</p>
              )}
            </div>
          </div>
          
          {/* User info card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="m-0">Posted by</h5>
            </div>
            
            <div className="card-body">
              <div className="d-flex align-items-center">
                <img 
                  src="/api/placeholder/64/64" 
                  alt="User" 
                  className="rounded-circle me-3"
                  width="64" 
                  height="64" 
                />
                <div>
                  <h6 className="mb-0">User ID: {post.user_id}</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related content would go here in a real implementation */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="m-0">Related Songs</h5>
            </div>
            
            <div className="card-body">
              <p className="text-muted text-center">Related songs would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}