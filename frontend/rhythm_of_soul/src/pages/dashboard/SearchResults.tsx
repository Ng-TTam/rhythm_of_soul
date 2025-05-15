import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchUsers, followUser, unfollowUser, getFollowingIds } from "../../services/api/userService";
import { User } from "../../model/profile/UserProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Pagination from "../../components/Pagination";

const SearchResult: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("people");
  const [currentPage, setCurrentPage] = useState<number>(0); // Thêm state phân trang
  const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
  const [searchParams] = useSearchParams();
  const searchKey = searchParams.get("query") || "";
  const token = sessionStorage.getItem("accessToken") || "";
  const user = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (!searchKey.trim() || !user?.id) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (activeTab === "people") {
          console.log("currentUserId: ", user.id);
          const [userResult, followingIds] = await Promise.all([
            searchUsers(searchKey, token, currentPage), // Cập nhật API gọi theo page
            getFollowingIds(user.id, token)
          ]);

          const updatedUsers = (userResult.data || []).map((u) => ({
            ...u,
            isFollowed: followingIds.includes(u.id),
          }));

          setUsers(updatedUsers);
          setTotalPages(userResult.totalPages || 1); // Cập nhật tổng số trang từ API
        }
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchKey, activeTab, user, currentPage]); // Thêm `currentPage` vào dependency

  return (
    <div className="search-results-container text-dark p-4" style={{ marginBottom: "80px" }}>
      <h2 className="mb-3">Search results for "{searchKey}"</h2>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-4">
        {["everything", "tracks", "people", "albums", "playlists"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? "btn-dark" : "btn-outline-dark"} btn-sm`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <p>⏳ Loading results...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <div className="d-flex flex-column gap-3 mt-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="d-flex align-items-center justify-content-between p-3 rounded shadow-sm"
                style={{ backgroundColor: "#F8F9FA" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt={`${u.firstName} ${u.lastName}`}
                    className="rounded-circle border"
                    width={55}
                    height={55}
                  />
                  <div>
                    <Link
                      to={`/user/${u.id}`}
                      className="text-decoration-none text-dark fw-semibold"
                    >
                      {u.firstName} {u.lastName}
                    </Link>
                    <div>
                      <small className="text-muted">👥 {u.followerCount} followers</small>
                    </div>
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${u.isFollowed ? "btn-secondary" : "btn-outline-primary"}`}
                  onClick={async () => {
                    // Cập nhật UI ngay lập tức trước khi gọi API
                    setUsers((prevUsers) =>
                      prevUsers.map((user) =>
                        user.id === u.id
                          ? {
                            ...user,
                            isFollowed: !user.isFollowed,
                            followerCount: user.followerCount + (user.isFollowed ? -1 : 1)
                          }
                          : user
                      )
                    );

                    try {
                      // Gọi API sau khi UI đã cập nhật
                      if (u.isFollowed) {
                        await unfollowUser(u.id, token);
                      } else {
                        await followUser(u.id, token);
                      }
                    } catch (err) {
                      console.error("❌ Failed to follow/unfollow", err);

                      // Khôi phục trạng thái cũ nếu API thất bại
                      setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                          user.id === u.id
                            ? {
                              ...user,
                              isFollowed: !user.isFollowed, // Đảo lại trạng thái
                              followerCount: user.followerCount + (user.isFollowed ? -1 : 1) // Đảo lại số follower
                            }
                            : user
                        )
                      );
                    }
                  }}
                >
                  {u.isFollowed ? "Unfollow" : "Follow"}
                </button>

              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResult;
