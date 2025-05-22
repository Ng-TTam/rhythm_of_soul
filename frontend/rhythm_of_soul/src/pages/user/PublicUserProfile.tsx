import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { User } from "../../model/profile/UserProfile";
import { getProfile, followUser, unfollowUser } from "../../services/api/userService";
import { Button, Card, Container, Row, Col, Badge } from "react-bootstrap";
import { FaMusic } from "@react-icons/all-files/fa/FaMusic";
import { ArtistStatus } from "../../config/constants";
import { FaUserClock } from '@react-icons/all-files/fa/FaUserClock';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaPhoneAlt } from '@react-icons/all-files/fa/FaPhoneAlt';
import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";


export default function PublicUserProfile() {
  const { userId } = useParams();
  const token = sessionStorage.getItem("accessToken") || "";
  const location = useLocation();

  // 👇 Dữ liệu truyền qua state từ FollowTabs
  const passedUser = location.state as User | undefined;
  console.log("passedUser", passedUser);

  const [user, setUser] = useState<User | null>(passedUser || null);
  const [isFollowed, setIsFollowed] = useState<boolean>(passedUser?.isFollowed ?? false);
  const [loading, setLoading] = useState<boolean>(!passedUser); // chỉ loading nếu chưa có dữ liệu

  useEffect(() => {
    // Nếu đã có user truyền từ location.state thì không cần fetch nữa
    if (passedUser) return;

    if (!userId || !token) return;

  }, [userId, token, passedUser]);

  const handleFollowToggle = async () => {
    try {
      if (!userId) return;
      if (isFollowed) {
        await unfollowUser(userId, token);
        setIsFollowed(false);
      } else {
        await followUser(userId, token);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error("Failed to toggle follow", err);
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "Not set";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || !user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Container className="my-5">
        {/* Cover Image */}
        <div
          className="rounded-3 mb-4 position-relative"
          style={{
            height: "200px",
            backgroundImage: `url(${user?.cover || "/assets/images/default/cover.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Row>
          {/* Left Column - Avatar and Main Info */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="text-center p-4">
                <div className="position-relative mb-4" style={{justifyItems : "center"}}>
                  <img
                    src={user?.avatar || "/assets/images/default/avatar.jpg"}
                    alt={`${user?.firstName + " " + user?.lastName}'s Avatar`}
                    className="rounded-circle img-thumbnail shadow"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      marginTop: "-75px",
                      border: "4px solid white",
                    }}
                    loading="lazy"
                  />
                  {user?.artist && (
                    <Badge bg="primary" className="p-2 rounded-pill d-flex align-items-center">
                      <FaMusic className="me-1" /> Artist
                    </Badge>
                  )}
                </div>

                <h3 className="fw-bold">
                  {user?.artist ? user.artistProfile?.stageName : user?.firstName + " " + user?.lastName}
                  {/* {user?.artist && (
                    <Badge bg="info" className="ms-2 rounded-circle p-1">
                      <FaCheck size={21} />
                    </Badge>
                  )} */}
                </h3>
                {user?.artist && <p className="text-muted mb-3">{user?.firstName + " " + user?.lastName}</p>}

                <div className="d-flex justify-content-center mb-3">
                  <div className="bg-light rounded-pill px-3 py-1 text-muted small">{user?.gender}</div>
                </div>

                {/* <div className="d-flex justify-content-center mt-3 gap-4">
                  <div className="text-center">
                    <Link to={`/user/${user?.id}/followers`}>
                      <small className="text-muted">Followers</small>
                      <h6 className="mb-0">{user?.followerCount ?? 0}</h6>
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link to={`/user/${user?.id}/following`}>
                      <small className="text-muted">Following</small>
                      <h6 className="mb-0">{user?.followedCount ?? 0}</h6>
                    </Link>

                  </div>
                </div> */}
              </Card.Body>
            </Card>
            
            {/* Account Info Card */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                <h5 className="fw-bold">User Information</h5>
              </Card.Header>
              <Card.Body className="pt-2">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <FaUserClock className="text-primary" size={21} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Member since</small>
                    {user?.createdAt && <span>{formatDate(user.createdAt)}</span>}
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <FaCalendarAlt className="text-primary" size={21} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Date of birth</small>
                    {user?.dateOfBirth && <span>{formatDate(user?.dateOfBirth + "")}</span>}
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <FaPhoneAlt className="text-primary" size={21} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Phone number</small>
                    <span>{user?.phoneNumber}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Bio and Other Info */}
          <Col lg={8}>
            {/* Bio Card - Only for Artists */}
            {user?.artist && user?.artistProfile?.bio && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                  <h5 className="fw-bold">Artist Bio</h5>
                </Card.Header>
                <Card.Body className="pt-2">
                  <Card.Text>{user.artistProfile.bio}</Card.Text>
                </Card.Body>
              </Card>
            )}

            {/* Social Media Links - Only for Artists */}
            {user?.artist && user?.artistProfile && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                  <h5 className="fw-bold">Social Media</h5>
                </Card.Header>
                <Card.Body className="pt-2">
                  <Row>
                    {user.artistProfile.facebookUrl && (
                      <Col md={4} className="mb-3">
                        <a href={user.artistProfile.facebookUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-decoration-none">
                          <div className="bg-primary rounded-circle p-2 me-2">
                            <FaFacebook className="text-white" size={24} />
                          </div>
                          <span>Facebook</span>
                        </a>
                      </Col>
                    )}

                    {user.artistProfile.instagramUrl && (
                      <Col md={4} className="mb-3">
                        <a href={user.artistProfile.instagramUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-decoration-none">
                          <div className="bg-danger rounded-circle p-2 me-2">
                            <FaInstagram className="text-white" size={24} />
                          </div>
                          <span>Instagram</span>
                        </a>
                      </Col>
                    )}

                    {user.artistProfile.youtubeUrl && (
                      <Col md={4} className="mb-3">
                        <a href={user.artistProfile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-decoration-none">
                          <div className="bg-danger rounded-circle p-2 me-2">
                            <FaYoutube className="text-white" size={24} />
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
                {user?.artist && user.artist && (
                  <Badge bg={user.artistProfile?.status ? "success" : "secondary"} className="rounded-pill px-3">
                    {user.artistProfile?.status === ArtistStatus.APPROVED ? "Verified Artist" : "Unverified"}
                  </Badge>
                )}
              </Card.Header>
              <Card.Body className="pt-2">
                <div className="text-center py-4 d-flex align-items-center flex-column">
                  <FaMusic size={40} className="text-muted mb-3 opacity-25" />
                  <p className="text-muted">No recent activity to display</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

