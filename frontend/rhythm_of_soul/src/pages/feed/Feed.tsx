import React, { useState, useRef } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { FaPlayCircle     } from '@react-icons/all-files/fa/FaPlayCircle'; // Thêm FaPlayCircle và FaPauseCircle
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRetweet } from '@react-icons/all-files/fa/FaRetweet';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import PostModal from './PostModal';
import { useNavigate } from 'react-router-dom';

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
}

interface Playlist {
  id: number;
  title: string;
  username: string;
    userAvatar: string;
    content : string;
    likes : number;
    retweets : number;
    plays: number;
  imageUrl: string;
  timePosted: string;
  tracks: Track[];
}

const mockTracks: Track[] = [
  {
    id: 1,
    username: 'Kurt Fitzgerald',
    userAvatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg',
    timePosted: '2 hours ago',
    title: 'Every Breath You Take',
    content: 'A timeless classic that captures the essence of longing and love.',
    duration: '2:57',
    imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
    likes: 1,
    retweets: 1,
    plays: 168,
  },
  {
    id: 2,
    username: 'Kurt Fitzgerald',
    userAvatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg',
    timePosted: '6 hours ago',
    title: 'Glow Up - Workout',
    content: 'Get pumped with this high-energy track!',
    duration: '1:53',
    imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
    likes: 6,
    retweets: 1,
    plays: 148,
  },
];
const currentUser = {
  username: 'Current User',
  avatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg'
};
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
      id: 3,
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
      id: 4,
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
};

// Dữ liệu đầu vào: kết hợp cả single tracks và playlists
const mockPosts: Array<Track | Playlist> = [...mockTracks, mockPlaylist];

const LayOut: React.FC = () => {
  const [posts, setPosts] = useState<(Track | Playlist)[]>(mockPosts);
  const [commentVisible, setCommentVisible] = useState<{ [key: number]: boolean }>({});
  const [likedTracks, setLikedTracks] = useState<{ [key: number]: boolean }>({});
  const [repostedTracks, setRepostedTracks] = useState<{ [key: number]: boolean }>({});
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

   // New state for controlling the PostModal
   const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
    // Current user info - this would typically come from authentication context
  const currentUserInfo = {
    username: 'Kurt Fitzgerald', // Example user
    userAvatar: 'https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg'
  };
  const navigate = useNavigate();
  const handleLike = (id: number) => {
    const alreadyLiked = likedTracks[id];
    setPosts((prev) =>
      prev.map((post) => {
        if ('tracks' in post) {
          return {
            ...post,
            tracks: post.tracks.map((track) =>
              track.id === id
                ? { ...track, likes: track.likes + (alreadyLiked ? -1 : 1) }
                : track
            ),
          };
        } else if (post.id === id) {
          return { ...post, likes: post.likes + (alreadyLiked ? -1 : 1) };
        }
        return post;
      })
    );
    setLikedTracks((prev) => ({ ...prev, [id]: !alreadyLiked }));
  };

  const handleRepost = (id: number) => {
    const alreadyReposted = repostedTracks[id];
    setPosts((prev) =>
      prev.map((post) => {
        if ('tracks' in post) {
          return {
            ...post,
            tracks: post.tracks.map((track) =>
              track.id === id
                ? { ...track, retweets: track.retweets + (alreadyReposted ? -1 : 1) }
                : track
            ),
          };
        } else if (post.id === id) {
          return { ...post, retweets: post.retweets + (alreadyReposted ? -1 : 1) };
        }
        return post;
      })
    );
    setRepostedTracks((prev) => ({ ...prev, [id]: !alreadyReposted }));
  };

  const toggleComment = (id: number) => {
    setCommentVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePlayPause = (id: number) => {
    if (playingTrack === id) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(id);
      setPosts((prev) =>
        prev.map((post) => {
          if ('tracks' in post) {
            return {
              ...post,
              tracks: post.tracks.map((track) =>
                track.id === id ? { ...track, plays: track.plays + 1 } : track
              ),
            };
          } else if (post.id === id) {
            return { ...post, plays: post.plays + 1 };
          }
          return post;
        })
      );
    }
  };
  // Function to handle data from PostModal
  const handlePostSubmit = (postData: any) => {
    console.log('New post data:', postData);
    
    // Process the post data and add to the posts list
    if (postData.type === 'upload') {
      if (postData.contentType === 'song') {
        // Add new track to posts
        const newTrack: Track = {
          id: Math.max(...posts.map(p => p.id)) + 1, // Generate a new ID
          username: postData.username,
          userAvatar: postData.userAvatar,
          timePosted: 'Just now',
          title: postData.title,
          content: postData.content,
          duration: '0:00', // Would be calculated from actual file
          imageUrl: postData.coverImage ? URL.createObjectURL(postData.coverImage) : 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
          likes: 0,
          retweets: 0,
          plays: 0
        };
        
        setPosts(prev => [newTrack, ...prev]);
      } else {
        // Add new playlist to posts
        const newPlaylist: Playlist = {
          id: Math.max(...posts.map(p => p.id)) + 1, // Generate a new ID
          title: postData.title,
          username: postData.username,
          userAvatar: postData.userAvatar,
          content: postData.content,
          imageUrl: postData.coverImage ? URL.createObjectURL(postData.coverImage) : 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
          timePosted: 'Just now',
          likes: 0,
          retweets: 0,
          plays: 0,
          tracks: postData.tracks.map((track: any, index: number) => ({
            id: Math.max(...posts.map(p => p.id)) + 1 + index + 1,
            username: track.artist || postData.username,
            userAvatar: postData.userAvatar,
            timePosted: 'Just now',
            title: track.displayName,
            content: '',
            duration: '0:00', // Would be calculated from actual file
            imageUrl: postData.coverImage ? URL.createObjectURL(postData.coverImage) : 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
            likes: 0,
            retweets: 0,
            plays: 0
          }))
        };
        
        setPosts(prev => [newPlaylist, ...prev]);
      }
    } else if (postData.type === 'share') {
      // Handle shared content
      // This would depend on how you want to display shared content
      // For now, we'll just log it
      console.log('Shared content:', postData.sharedItem);
    }
  };
  // Hàm render single track
  const renderSingleTrack = (track: Track) => (
    <Col xs={12} key={track.id} className="mb-3">
      <Card className="bg-dark text-white shadow">
        <Card.Header className="d-flex align-items-center">
          <img
            src={track.userAvatar}
            alt={track.username}
            
            className="me-2"
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
          <div>
            <strong>{track.username}</strong>
            <small className="d-block text-muted">{track.timePosted}</small>
          </div>
        </Card.Header>
        <Card.Text className="mb-2" style={{ marginLeft: "20px" }}>
          {track.content}
        </Card.Text>
        <Card.Body className="d-flex flex-column flex-md-row align-items-center">
          <img
            src={track.imageUrl}
            alt={track.title}
            className="me-3"
            onClick={() => navigate(`/postTrack/${track.id}`)}
            style={{ width: 150, borderRadius: 10 }}
          />
          <div className="flex-grow-1">
            <div className="d-flex">
              {playingTrack === track.id ? (
                <i
                  className="bi bi-pause-circle"
                  style={{ marginRight: "10px", fontSize: "50px", cursor: "pointer" }}
                  onClick={() => handlePlayPause(track.id)}
                ></i>
              ) : (
                <i
                  className="bi bi-play-circle"
                  style={{ marginRight: "10px", fontSize: "50px", cursor: "pointer" }}
                  onClick={() => handlePlayPause(track.id)}
                ></i>
              )}
              <h5 className="text-light" style={{ alignContent: "center" }}>
                {track.title}
              </h5>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="bg-secondary flex-grow-1" style={{ height: '4px' }} />
              <span className="ms-2">{track.duration}</span>
            </div>
            <div className="d-flex gap-4 fs-6">
              <span style={{ cursor: 'pointer' }} onClick={() => handleLike(track.id)}>
                <FaHeart
                  className={`me-1 ${likedTracks[track.id] ? 'text-danger' : 'text-light'}`}
                />
                {track.likes}
              </span>
              <span style={{ cursor: 'pointer' }} onClick={() => handleRepost(track.id)}>
                <FaRetweet
                  className={`me-1 ${repostedTracks[track.id] ? 'text-success' : 'text-light'}`}
                />
                {track.retweets}
              </span>
              <span>
                <FaPlayCircle className="me-1 text-info" /> {track.plays}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  // Hàm render playlist
  const renderPlaylist = (playlist: Playlist) => (
    <Col xs={12} className="mb-3">
      <Card className="bg-dark text-white shadow">
      <Card.Header className="d-flex align-items-center">
          <img
            src={playlist.userAvatar}
            alt={playlist.username}
            className="me-2"
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
          <div>
            <strong>{playlist.username}</strong>
            <small className="d-block text-muted">{playlist.timePosted}</small>
          </div>
        </Card.Header>
        <Card.Text className="mb-2" style={{ marginLeft: "20px" }}>
          {playlist.content}
        </Card.Text>
        <Card.Body>
          {/* Thông tin playlist */}
          <div className="d-flex align-items-center mb-4">
            <img
              src={playlist.imageUrl}
              alt={playlist.title}
              onClick={() => navigate(`/postPlaylist/${playlist.id}`)}
              style={{ width: 150, height: 150, borderRadius: 10, marginRight: '20px' }}
            />
            <div>
              <h2 className="text-white">{playlist.title}</h2>
              <p className="text-muted">
                by {playlist.username} • {playlist.timePosted} • {playlist.tracks.length} tracks
              </p>
            </div>

          </div>
          <div style={{marginLeft :"170px"}}>
          {playlist.tracks.map((track) => (
            <div key={track.id} className="d-flex align-items-center mb-3">
              <img
                src={track.imageUrl}
                alt={track.title}
                onClick={() => navigate(`/postTrack/${track.id}`)}
                style={{ width: 50, height: 50, borderRadius: 5, marginRight: '10px' }}
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  
                  <div>
                    <span className="text-muted">{track.username}</span>
                    <h5 className="text-light mb-0">{track.title}</h5>
                  </div>
                  <div className="d-flex align-items-center mt-1" style={{
                    width: '100%'
                  }}>
                {playingTrack === track.id ? (
                    <i
                      className="bi bi-pause-circle"
                      style={{ fontSize: '30px', cursor: 'pointer', 
                        width: '100%', textAlign: 'end',
                        marginRight: '10px',right: '10px' }}
                      onClick={() => handlePlayPause(track.id)}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-play-circle"
                      style={{ fontSize: '30px',width: '100%', textAlign: 'end', cursor: 'pointer', marginRight: '10px' }}
                      onClick={() => handlePlayPause(track.id)}
                    ></i>
                  )}
                </div>
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex gap-4 fs-6">
              <span style={{ cursor: 'pointer' }} onClick={() => handleLike(playlist.id)}>
                <FaHeart
                  className={`me-1 ${likedTracks[playlist.id] ? 'text-danger' : 'text-light'}`}
                />
                {playlist.likes}
              </span>
              <span style={{ cursor: 'pointer' }} onClick={() => handleRepost(playlist.id)}>
                <FaRetweet
                  className={`me-1 ${repostedTracks[playlist.id] ? 'text-success' : 'text-light'}`}
                />
                {playlist.retweets}
              </span>
              <span>
                <FaPlayCircle className="me-1 text-info" /> {playlist.plays}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className="my-4" style={{ marginLeft: "20px" }}>
      <Card className="mb-4 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.username} 
          className="me-3" 
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
        <Button 
          variant="light" 
          className="flex-grow-1 text-start text-muted border"
          onClick={() => setIsPostModalOpen(true)}
        >
          Bạn đang nghĩ gì?
        </Button>
      </Card.Body>
    </Card>
      <Row>
        {posts.map((post) =>
          'tracks' in post ? renderPlaylist(post) : renderSingleTrack(post)
        )}
      </Row>
      
      <div style={{height:"100px"}}></div>
      <audio ref={audioRef} />
      
      {/* Render the PostModal when isPostModalOpen is true */}
      {isPostModalOpen && (
        <PostModal
          onClose={() => setIsPostModalOpen(false)}
          onPost={handlePostSubmit}
          currentUsername={currentUserInfo.username}
          currentUserAvatar={currentUserInfo.userAvatar}
        />
      )}
    </Container>
  );
};

export default LayOut;