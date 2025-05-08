import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Row, Col, Form, ListGroup, CardBody } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRetweet } from '@react-icons/all-files/fa/FaRetweet';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaPaperPlane } from '@react-icons/all-files/fa/FaPaperPlane';

interface Comment {
    id: number;
    username: string;
    userAvatar: string;
    text: string;
    timestamp: string;
    likes: number;
}

interface Track {
    id: number;
    username: string;
    userAvatar: string;
    timePosted: string;
    title: string;
    content: string;
    duration: string;
    imageUrl: string;
    likes: number;
    retweets: number;
    plays: number;
    comments?: Comment[];
}

interface Playlist {
    id: number;
    title: string;
    username: string;
    userAvatar: string;
    content: string;
    likes: number;
    retweets: number;
    plays: number;
    imageUrl: string;
    timePosted: string;
    tracks: Track[];
    comments?: Comment[];
}

const mockPlaylist: Playlist = {
    id: 3,
    title: 'Lift Me Higher',
    userAvatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg',
    username: 'Kurt Fitzgerald',
    content: 'A collection of uplifting tracks to start your day right.',
    imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
    timePosted: '1 month ago',
    likes: 10,
    retweets: 5,
    plays: 10000,
    tracks: [
        {
            id: 4,
            username: 'Arcane, League Of Legends, Stromae, Pommer',
            userAvatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg',
            timePosted: '2 hours ago',
            title: 'Ma Meill...',
            content: 'A timeless classic.',
            duration: '2:57',
            imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
            likes: 1,
            retweets: 1,
            plays: 168000,
        },
        {
            id: 5,
            username: 'Macklemore feat. Kesha',
            userAvatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg',
            timePosted: '6 hours ago',
            title: 'Good Old Days (feat. Kesha)',
            content: 'Get pumped with this high-energy track!',
            duration: '1:53',
            imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
            likes: 6,
            retweets: 1,
            plays: 11900000,
        },
    ],
    comments: [
        {
            id: 3,
            username: 'Jane Doe',
            userAvatar: 'https://i1.sndcdn.com/avatars-000987654321-ef5gh6-t120x120.jpg',
            text: 'This playlist is just what I needed today!',
            timestamp: '3 days ago',
            likes: 12,
        }
    ]
};

// Mock posts data
const mockPosts: Array<Playlist> = [ mockPlaylist];

const currentUser = {
    username: 'Current User',
    avatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg'
};

const PostDetail: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    // Find the post based on the ID from URL parameters
    const post = mockPosts.find(p => p.id === Number(postId));

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [likedComments, setLikedComments] = useState<{ [key: number]: boolean }>({});
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const [likesCount, setLikesCount] = useState<number>(post?.likes || 0);
    const [repostsCount, setRepostsCount] = useState<number>(post?.retweets || 0);

    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const [showAllComments, setShowAllComments] = useState<boolean>(false);

    useEffect(() => {
        // Initialize comments from the post
        if (post && post.comments) {
            setComments(post.comments);
        }
    }, [post]);

    // If post not found, show error
    if (!post) {
        return (
            <Container className="my-5 text-center">
                <h2>Post not found</h2>
                <p>The post you're looking for doesn't exist or has been removed.</p>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            const newCommentObject: Comment = {
                id: Math.max(...comments.map(c => c.id), 0) + 1,
                username: currentUser.username,
                userAvatar: currentUser.avatar,
                text: newComment,
                timestamp: 'Just now',
                likes: 0,
            };

            setComments([newCommentObject, ...comments]);
            setNewComment('');

            // Focus back on the input after submitting
            if (commentInputRef.current) {
                commentInputRef.current.focus();
            }
        }
    };

    const handleCommentLike = (commentId: number) => {
        const wasLiked = likedComments[commentId];

        setComments(comments.map(comment =>
            comment.id === commentId
                ? { ...comment, likes: comment.likes + (wasLiked ? -1 : 1) }
                : comment
        ));

        setLikedComments(prev => ({
            ...prev,
            [commentId]: !wasLiked
        }));
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => prev + (isLiked ? -1 : 1));
    };

    const handleRepost = () => {
        setIsReposted(!isReposted);
        setRepostsCount(prev => prev + (isReposted ? -1 : 1));
    };

    const handlePlayPause = (id: number) => {
        if (playingTrackId === id) {
            setPlayingTrackId(null);
        } else {
            setPlayingTrackId(id);
            // In a real app, update play count and handle actual audio playback
        }
    };

    const formatPlays = (plays: number): string => {
        if (plays >= 1000000) {
            return `${(plays / 1000000).toFixed(1)}M`;
        } else if (plays >= 1000) {
            return `${(plays / 1000).toFixed(1)}K`;
        }
        return plays.toString();
    };

    return (
        <Container className="my-4 pb-5">
            <Row>
                <Row>
                    <Card className="bg-dark text-white mb-4 col-lg-4">
                        <Card.Img
                            variant="top"
                            src={post.imageUrl}
                            alt={post.title}
                            className="img-fluid"
                        />
                    </Card>

                    <Card className="bg-dark text-white mb-4 col-lg-8">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={post.userAvatar}
                                    alt={post.username}
                                    className="me-2 rounded-circle"
                                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                                />
                                <div>
                                    <div className="text-muted small">Artist</div>
                                    <div className="fw-bold">{post.username}</div>
                                </div>
                                <div className="ms-auto text-end">
                                    <div className="text-muted small">Posted</div>
                                    <div>{post.timePosted}</div>
                                </div>
                            </div>
                            <div className="mb-3 small" style={{ paddingLeft: "50px" }}>
                                <p>{post.content}</p>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "10px" }}>
                                <div>
                                    <h2 className="mb-1 text-white">{post.title}</h2>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="mb-2">
                                <div className="d-flex justify-content-center gap-5">
                                    <span>
                                        <FaPlay className="me-1 text-info" /> {formatPlays(post.plays)}
                                    </span>
                                    <span>
                                        <FaHeart 
                                            className={`me-1 ${isLiked ? 'text-danger' : 'text-secondary'}`} 
                                            onClick={handleLike}
                                            style={{ cursor: 'pointer' }}
                                        /> {likesCount}
                                    </span>
                                    <span>
                                        <FaRetweet 
                                            className={`me-1 ${isReposted ? 'text-success' : 'text-secondary'}`} 
                                            onClick={handleRepost}
                                            style={{ cursor: 'pointer' }}
                                        /> {repostsCount}
                                    </span>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Row>
                    <Row className="mb-4">
                        <Col lg={4}>
                            <Card className="bg-dark text-white">
                                <CardBody className="text-center">
                                    <img
                                        src={post.userAvatar}
                                        alt={post.username}
                                        className="rounded-circle mb-3"
                                        style={{ width: "50%", height: "auto" }}
                                    />
                                    <h5 className="fw-bold">{post.username}</h5>
                                    <Button variant="outline-light" size="sm" className="mt-2">
                                        Follow Artist
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                        
                        <Col lg={8}>
                            <Card className="bg-white text-black">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Playlist Tracks</h5>
                                    <span className="text-muted">{post.tracks.length} tracks</span>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {post.tracks.map((track, index) => (
                                        <ListGroup.Item 
                                            key={track.id} 
                                            className={`d-flex align-items-center ${playingTrackId === track.id ? 'bg-light' : ''}`}
                                        >
                                            <div className="me-2 text-muted">{index + 1}.</div>
                                            <div 
                                                className="me-3 d-flex align-items-center justify-content-center"
                                                style={{ cursor: 'pointer', width: 35, height: 35 }}
                                                onClick={() => handlePlayPause(track.id)}
                                            >
                                                {playingTrackId === track.id ? <FaPause /> : <FaPlay />}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-truncate">{track.title}</div>
                                                <small className="text-muted text-truncate d-block">{track.username}</small>
                                            </div>
                                            <div className="text-muted small">{formatPlays(track.plays)} plays</div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                
                <Col>
                    <Card className="bg-white text-dark">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Comments ({comments.length})</h4>
                            <FaComment />
                        </Card.Header>
                        <Card.Body>
                            <Form className="mb-4" onSubmit={handleCommentSubmit}>
                                <Form.Group className="mb-3 d-flex">
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.username}
                                        className="me-2 rounded-circle align-self-start"
                                        style={{ width: 40, height: 40 }}
                                    />
                                    <div className="flex-grow-1 position-relative">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            ref={commentInputRef}
                                            className="bg-white text-dark border-secondary"
                                            style={{ paddingRight: 40 }}
                                            rows={3}
                                        />
                                        <Button
                                            variant="link"
                                            type="submit"
                                            className="position-absolute"
                                            style={{ right: 5, bottom: 5, color: '#f50' }}
                                            disabled={!newComment.trim()}
                                        >
                                            <FaPaperPlane />
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Form>

                            <div className="comments-section">
                                {displayedComments.map(comment => (
                                    <div key={comment.id} className="comment mb-3">
                                        <div className="d-flex">
                                            <img
                                                src={comment.userAvatar}
                                                alt={comment.username}
                                                className="me-2 rounded-circle align-self-start"
                                                style={{ width: 40, height: 40 }}
                                            />
                                            <div className="flex-grow-1">
                                                <div className="bg-secondary bg-opacity-10 p-3 rounded">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <strong>{comment.username}</strong>
                                                        <small className="text-muted">{comment.timestamp}</small>
                                                    </div>
                                                    <p className="mb-2">{comment.text}</p>
                                                    <div className="d-flex align-items-center">
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className={likedComments[comment.id] ? "text-danger p-0" : "text-muted p-0"}
                                                            onClick={() => handleCommentLike(comment.id)}
                                                        >
                                                            <FaHeart size={12} className="me-1" />
                                                            <small>{comment.likes} likes</small>
                                                        </Button>
                                                        <Button variant="link" size="sm" className="text-muted p-0 ms-3">
                                                            <small>Reply</small>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {comments.length > 3 && (
                                    <div className="text-center mt-3">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => setShowAllComments(!showAllComments)}
                                        >
                                            {showAllComments ? 'Show less comments' : `Show all ${comments.length} comments`}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PostDetail;