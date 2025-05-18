import React, { useState, useEffect} from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Image, 
  Badge, 
  Alert
} from 'react-bootstrap';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill';
import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { BsClock } from '@react-icons/all-files/bs/BsClock';

import { MdPublic } from '@react-icons/all-files/md/MdPublic';
import {MdLock} from '@react-icons/all-files/md/MdLock';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { toggleePlay, setAudio } from '../../reducers/audioReducer';
import  {SongDetail} from '../../model/post/Song';
import { getSongDetail } from '../../services/postService';


interface PostSongDetailProps {
  postId: string;
}

const PostSongDetail: React.FC<PostSongDetailProps> = ({ postId }) =>{
  const [songDetail, setSongDetail] = useState<SongDetail | null>(null);
  
  const dispatch = useAppDispatch();
  const audioState = useAppSelector(state => state.audio);
  
  useEffect(() => {
    const fetchSongDetail = async () => {
      try {
        const response = await getSongDetail(postId ?? '');
        
        if (response.code !== 200) {
          throw new Error( response.message );
        }
        
        setSongDetail(response.result);
        
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
  if (!songDetail) {
    return (
      <Container>
        <Alert variant="warning">Song not found</Alert>
      </Container>
    );
  }
  
  const { post } = songDetail;
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
        
            </Card.Body>
          </Card>
           {/* Comment section */}
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
export default PostSongDetail;