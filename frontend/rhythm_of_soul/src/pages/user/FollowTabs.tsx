import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getFollowers, getFollowing } from "../../services/api/userService";
import { User } from "../../model/profile/UserProfile";
import '../../styles/FollowTabs.css'; 
import { getFollowingIds } from "../../services/api/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";


export default function FollowTabs() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const isFollowersTab = location.pathname.includes("/followers");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!userId || !currentUser?.id) return; // ✅ thêm kiểm tra null
  
      try {
        const token = sessionStorage.getItem("accessToken") || "";
  
        const [fetchedUsers, followingIds] = await Promise.all([
          isFollowersTab
            ? getFollowers(userId, token)
            : getFollowing(userId, token),
          getFollowingIds(currentUser.id, token),
        ]);
  
        const updatedUsers = (fetchedUsers || []).map((u) => ({
          ...u,
          isFollowed: followingIds.includes(u.id),
        }));
  
        setUsers(updatedUsers);
      } catch (err) {
        console.error("❌ Load failed:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetch();
  }, [userId, location.pathname, currentUser]);
  
  

  const handleUserClick = (user: User) => {
    navigate(`/user/${user.id}`, { state: user }); // 👈 truyền state
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h3 className="fw-bold mb-4">
        {isFollowersTab ? "Followers" : "Following"}
      </h3>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-4 border-bottom pb-2">
        <button
          className={`tab-btn ${isFollowersTab ? "active" : ""}`}
          onClick={() => navigate(`/user/${userId}/followers`)}
        >
          Followers
        </button>
        <button
          className={`tab-btn ${!isFollowersTab ? "active" : ""}`}
          onClick={() => navigate(`/user/${userId}/following`)}
        >
          Following
        </button>
      </div>

      {/* User List */}
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {users.map((user) => (
            <div key={user.id} className="text-center" style={{ width: 120, cursor: "pointer" }} onClick={() => handleUserClick(user)} >
              <img
                src={user.avatar || "/assets/images/default/avatar.jpg"}
                alt={user.firstName}
                className="rounded-circle border"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <div className="fw-semibold mt-2 text-dark">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-muted small">
                👤 {user.followerCount ?? 0} followers
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
