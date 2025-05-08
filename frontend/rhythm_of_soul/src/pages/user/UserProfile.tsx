import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FaCalendarAlt } from "@react-icons/all-files/fa/FaCalendarAlt";
import { FaPencilAlt } from "@react-icons/all-files/fa/FaPencilAlt";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaMusic } from "@react-icons/all-files/fa/FaMusic";
import { User } from "../../model/profile/UserProfile";
import ProfileService from "../../services/profileService";
import EditProfileDialog from "./EditProfileDialog"
import { useAppSelector,useAppDispatch } from '../../store/hook';
import { jwtDecode } from 'jwt-decode';
import LoginService from "../../services/service"; // Named import
import { setToken } from "../../reducers/tokenReducer";
interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
  scope :  string;
  iss : string;
  jti :  string;
  sub : string;
}
export default function UserProfile() {
  const [isEditVisible, setEditVisible] = useState(false);
  
  const [user, setUser] = useState<User>({
      user_id: "",
      full_name: "",
      avatar_url: "",
      created_at: "",
      updated_at: "",
      gender: "OTHER",
      cover_url: "",
      role: "USER",
      artist : null,
  });
  const [isArtist, setIsArtist] = useState(false);
  const dispatch = useAppDispatch();
  let token = useAppSelector((state) => state.token.accessToken);
  const navigate = useNavigate();

  const handleSave = (data: User) => {
    setUser(data); // Cập nhật state
    setEditVisible(false); // Đóng dialog
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (token === "" || token === undefined) {
        const response = await LoginService.verifyToken();
        if(response.result.valid){
          token = response.result.token;
         dispatch(setToken({accessToken: token}));
         const decoded = jwtDecode<DecodedToken>(token);
          try {
            const response = await ProfileService.getProfile(decoded.userId, token);
            console.log("Profile data fetched:", response);
            setUser(response);

            // Set isArtist based on user role instead of checking if artist object exists
            setIsArtist(response.role === "ARTIST");
          } catch (error) {
            console.error("Failed to fetch profile data", error);
          }
        }else{
          navigate("/login");
          return;
        }
      }
      
    };
    fetchData();
  }, []);
  const handleEditOpen = () => {
    setEditVisible(true)
  };
  const handleEditClose = () => setEditVisible(false);
  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Container className="my-5">
      {/* Cover Image */}
      <div 
        className="rounded-3 mb-4 position-relative" 
        style={{ 
          height: "200px", 
          backgroundImage: `url(${user.cover_url || "/assets/images/default/cover.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <Row>
        {/* Left Column - Avatar and Main Info */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="text-center p-4">
              <div className="position-relative mb-4">
                <img
                  src={user.avatar_url || "/assets/images/default/avatar.jpg"}
                  alt={`${user.full_name}'s Avatar`}
                  className="rounded-circle img-thumbnail shadow"
                  style={{ 
                    width: "150px", 
                    height: "150px", 
                    objectFit: "cover",
                    marginTop: "-75px",
                    border: "4px solid white" 
                  }}
                  loading="lazy"
                />
                {isArtist && (
                  <Badge 
                    bg="primary"
                    className="position-absolute bottom-0 end-0 p-2 rounded-pill"
                  >
                    <FaMusic className="me-1" /> Artist
                  </Badge>
                )}
              </div>
              
              <h3 className="fw-bold">
                {isArtist && user.artist ? user.artist.stage_name : user.full_name}
                {isArtist && user.artist?.is_verified && (
                  <Badge bg="info" className="ms-2 rounded-circle p-1">
                    <FaCheck size={10} />
                  </Badge>
                )}
              </h3>
              {isArtist && <p className="text-muted mb-3">{user.full_name}</p>}
              
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-light rounded-pill px-3 py-1 text-muted small">
                  {user.gender}
                </div>
              </div>
              
              <Button 
                variant="outline-primary" 
                className="rounded-pill px-4"
                onClick={handleEditOpen}
              >
                <FaPencilAlt className="me-2" />
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
          <EditProfileDialog
            visible={isEditVisible}
            onClose={handleEditClose}
            onSave={handleSave}
            initialData={user}
            token={useAppSelector((state) => state.token.accessToken)}
          />
          {/* Account Info Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold">Account Information</h5>
            </Card.Header>
            <Card.Body className="pt-2">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <FaCalendarAlt className="text-primary" />
                </div>
                <div>
                  <small className="text-muted d-block">Member since</small>
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <FaUser className="text-primary" />
                </div>
                <div>
                  <small className="text-muted d-block">Account ID</small>
                  <span className="text-monospace small">{user.user_id}</span>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle p-2 me-3">
                  <FaUser className="text-primary" />
                </div>
                <div>
                  <small className="text-muted d-block">Role</small>
                  <span>{user.role}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Bio and Other Info */}
        <Col lg={8}>
          {/* Bio Card - Only for Artists */}
          {isArtist && user.artist?.bio && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                <h5 className="fw-bold">Artist Bio</h5>
              </Card.Header>
              <Card.Body className="pt-2">
                <Card.Text>
                  {user.artist.bio}
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          {/* Social Media Links - Only for Artists */}
          {isArtist && user.artist && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                <h5 className="fw-bold">Social Media</h5>
              </Card.Header>
              <Card.Body className="pt-2">
                <Row>
                  {user.artist.facebook_url && (
                    <Col md={4} className="mb-3">
                      <a 
                        href={user.artist.facebook_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <div className="bg-primary rounded-circle p-2 me-2">
                          <FaFacebook className="text-white" />
                        </div>
                        <span>Facebook</span>
                      </a>
                    </Col>
                  )}
                  
                  {user.artist.instagram_url && (
                    <Col md={4} className="mb-3">
                      <a 
                        href={user.artist.instagram_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <div className="bg-danger rounded-circle p-2 me-2">
                          <FaInstagram className="text-white" />
                        </div>
                        <span>Instagram</span>
                      </a>
                    </Col>
                  )}
                  
                  {user.artist.youtube_url && (
                    <Col md={4} className="mb-3">
                      <a 
                        href={user.artist.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <div className="bg-danger rounded-circle p-2 me-2">
                          <FaYoutube className="text-white" />
                        </div>
                        <span>YouTube</span>
                      </a>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Latest Activity Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold">Recent Activity</h5>
              {isArtist && user.artist && (
                <Badge bg={user.artist.is_verified ? "success" : "secondary"} className="rounded-pill px-3">
                  {user.artist.is_verified ? "Verified Artist" : "Unverified"}
                </Badge>
              )}
            </Card.Header>
            <Card.Body className="pt-2">
              <div className="text-center py-4">
                <FaMusic size={40} className="text-muted mb-3 opacity-25" />
                <p className="text-muted">No recent activity to display</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
