import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Image, 
  Badge, 
  Form, 
  InputGroup,
  Alert
} from 'react-bootstrap';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill';
import { BsHeart } from '@react-icons/all-files/bs/BsHeart';
import { BsHeartFill } from '@react-icons/all-files/bs/BsHeartFill';
import { BsChat } from '@react-icons/all-files/bs/BsChat';
import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { BsClock } from '@react-icons/all-files/bs/BsClock';
import { MdRepeat } from '@react-icons/all-files/md/MdRepeat';
import { BsReply } from '@react-icons/all-files/bs/BsReply';
import { MdPublic } from '@react-icons/all-files/md/MdPublic';
import {MdLock} from '@react-icons/all-files/md/MdLock';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { toggleePlay, setAudio } from '../../reducers/audioReducer';
import  {SongDetail} from '../../model/post/Song';
import { getSongDetail } from '../../services/postService';
export default function PostSongDetail() {
  const [songDetail, setSongDetail] = useState<SongDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const postId = useParams<{ songId: string }>();
  
  const dispatch = useAppDispatch();
  const audioState = useAppSelector(state => state.audio);
  
  useEffect(() => {
    const fetchSongDetail = async () => {
      try {
        const response = await getSongDetail(postId.songId ?? '');
        
        if (response.code !== 200) {
          throw new Error( response.message );
        }
        
        setSongDetail(response.result);
        
        // Reset like state when a new song is loaded
        setIsLiked(false);
      } catch (err) {
        console.error(err);
        setSongDetail(null);
      }
    };
    
    fetchSongDetail();
  }, [postId]);
  
  const handlePlaySong = () => {
    if (!songDetail) return;
    
    const { post } = songDetail;
    
    if (audioState.mediaUrlSong === post.content.mediaUrl) {
      dispatch(toggleePlay(!audioState.play));
    } else {
      dispatch(setAudio({
        play: true,
        imageSong: post.content.imageUrl || '',
        titleSong: post.content.title,
        artistSong: post.account_id,
        mediaUrlSong: post.content.mediaUrl || ''
      }));
    }
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you would call an API to like/unlike the post
  };
  
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    // Mock adding a comment locally
    if (songDetail) {
      const updatedDetail = {
        ...(songDetail ?? {}),
        comments: [
          {
            id: `temp-${Date.now()}`,
            account_id: "current-user",
            content: newComment,
            created_at: new Date().toISOString(),
            user: { name: "Current User", avatar: "/api/placeholder/40/40" }
          },
          ...(songDetail.comments || [])
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
  
  const handleOpenCommemtt = () => {
    setShowComment(!showComment);
  };
  
  // No song detail
  if (!songDetail) {
    return (
      <Container>
        <Alert variant="warning">Song not found</Alert>
      </Container>
    );
  }
  
  const { post, comments } = songDetail;
  const displayComments = showAllComments 
    ? (comments ?? []) 
    : (comments ?? []).slice(0, 3);
  
  // Check if current song is playing
  const isCurrentSongPlaying = audioState.mediaUrlSong === post.content.mediaUrl && audioState.play;
  
  return (
    <Container className="py-4">
      <Row>
        {/* Left column: Song info and player */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            {/* Song cover and play button */}
            <div className="position-relative">
              <Card.Img 
                variant="top"
                src={post.content.imageUrl || "/assets/images/default/avatar.jpg"} 
                alt={post.content.title}
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              <div 
                className="position-absolute top-50 start-50 translate-middle p-3 bg-dark bg-opacity-50 rounded-circle"
                style={{ cursor: 'pointer' }}
                onClick={handlePlaySong}
                aria-label={isCurrentSongPlaying ? "Pause song" : "Play song"}
              >
                {isCurrentSongPlaying ? 
                  <BsPauseFill size={50} color="white" /> : 
                  <BsPlayFill size={50} color="white" />
                }
              </div>
              
              <div className="position-absolute bottom-0 start-0 m-3 p-2 bg-dark bg-opacity-50 rounded">
                {post._public ? 
                  <MdPublic size={20} color="white" className="me-1" /> : 
                  <MdLock size={20} color="white" className="me-1" />
                }
                <span className="ms-2 text-white">
                  {post._public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
            
            <Card.Body>
              <Card.Title as="h3" className="fw-bold">{post.content.title}</Card.Title>
              {post.caption && <Card.Text>{post.caption}</Card.Text>}
              
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
                  <Badge bg="primary" className="me-1" key={idx}>{tag}</Badge>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="mt-4 d-flex">
                <Button 
                  variant={isLiked ? 'danger' : 'outline-danger'} 
                  className="me-2"
                  onClick={toggleLike}
                >
                  {isLiked ? <BsHeartFill /> : <BsHeart />}
                  <span className="ms-1">
                    {post.like_count + (isLiked ? 1 : 0)}
                  </span>
                </Button>
                
                <Button variant="outline-primary" className="me-2"
                onClick={handleOpenCommemtt}>
                  <BsChat />
                  <span className="ms-1">{post.comment_count}</span>
                </Button>
                
                <Button variant="outline-secondary" className="me-2" >
                  <MdRepeat/>
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          { showComment &&
            <Card className="mt-4 shadow-sm">
              <Card.Header>
                <Card.Title as="h5">Comments ({post.comment_count})</Card.Title>
              </Card.Header>
              
              <Card.Body>
                {/* Comment input */}
                <div className="mb-4">
                  <InputGroup>
                    <Form.Control 
                      type="text" 
                      placeholder="Add a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit();
                        }
                      }}
                    />
                    <Button 
                      variant="primary"
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                    >
                      Comment
                    </Button>
                  </InputGroup>
                </div>
                
                {/* Comments list */}
                {displayComments.length > 0 ? (
                  <div>
                    {displayComments.map((comment) => (
                      <div key={comment.id} className="mb-3 p-3 border-bottom">
                        <div className="d-flex">
                          <Image 
                            src={comment.user?.avatar || "/api/placeholder/40/40"} 
                            alt="User" 
                            roundedCircle
                            className="me-2"
                            width={40} 
                            height={40} 
                          />
                          <div>
                            <div className="d-flex align-items-center">
                              <strong className="me-2">{comment.user?.name || 'Anonymous'}</strong>
                              <small className="text-muted">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </small>
                            </div>
                            <p className="mb-1">{comment.content}</p>
                            <Button variant="link" size="sm" className="text-muted p-0">
                              <BsReply /> Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(comments ?? []).length > 3 && (
                      <Button 
                        variant="link" 
                        className="p-0" 
                        onClick={() => setShowAllComments(!showAllComments)}
                      >
                        {showAllComments 
                          ? 'Show less comments' 
                          : `Show all ${comments?.length || 0} comments`}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-muted text-center">No comments yet. Be the first to comment!</p>
                )}
              </Card.Body>
            </Card>
          }
        </Col>
        
        {/* Right column: Likes and related info */}
        <Col lg={4}>
          
          {/* User info card */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <Card.Title as="h5">Posted by</Card.Title>
            </Card.Header>
            
            <Card.Body>
              <div className="d-flex align-items-center">
                <Image 
                  src="/api/placeholder/64/64" 
                  alt="User" 
                  roundedCircle
                  className="me-3"
                  width={64} 
                  height={64} 
                />
                <div>
                  <h6 className="mb-0">User ID: {post.account_id}</h6>
                  <Button variant="outline-primary" size="sm" className="mt-2">
                    Follow
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {/* Related content */}
          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title as="h5">Related Songs</Card.Title>
            </Card.Header>
            
            <Card.Body>
              <p className="text-muted text-center">Related songs would appear here</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}