import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchUsers, followUser, unfollowUser, getFollowingIds } from "../../services/api/userService";
import { searchSongs } from "../../services/postService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { User } from "../../model/profile/UserProfile";
import { Song } from "../../model/post/Song";
import Pagination from "../../components/Pagination";

const SearchResult: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("people");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchParams] = useSearchParams();
  const searchKey = searchParams.get("query") || "";
  const token = sessionStorage.getItem("accessToken") || "";
  const user = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();
  const [songTag, setSongTag] = useState<string>("");


  useEffect(() => {
    const key = searchParams.get("query") || "";
    if (!key.trim()) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "people") {
          const userResult = await searchUsers(searchKey, token, currentPage);
          if (user?.id) {
            const followingIds = await getFollowingIds(user.id, token);
            const updatedUsers = (userResult.data || []).map((u) => ({
              ...u,
              isFollowed: followingIds.includes(u.id),
            }));
            setUsers(updatedUsers);
          }
          else {
            setUsers(userResult.data || []);
          }

          setTotalPages(userResult.totalPages || 1);
        } else if (activeTab === "songs") {
          const result = await searchSongs("", searchKey, songTag, currentPage);
          console.log("✅ useEffect triggered with:", { searchKey, activeTab });

          setSongs(result.data || []);
          setTotalPages(result.totalPages || 1);
        }
        // TODO: Add albums, playlists, etc.
      } catch (error) {
        console.error("❌ Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams.toString(), activeTab, user, currentPage]);


  return (
    <div className="search-results-container text-dark p-4" style={{ marginBottom: "80px" }}>
      <h2 className="mb-3">Search results for "{searchKey}"</h2>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-4">
        {["everything", "songs", "people", "albums", "playlists"].map((tab) => (
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
      ) : activeTab === "people" && users.length === 0 ? (
        <p>No users found.</p>
      ) : activeTab === "people" ? (
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
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/user/${u.id}`, { state: u })}
                  />
                  <div>
                    <span
                      className="text-decoration-none text-dark fw-semibold"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/user/${u.id}`, { state: u })}
                    >
                      {u.firstName} {u.lastName}
                    </span>
                    <div>
                      <small className="text-muted">👥 {u.followerCount} followers</small>
                    </div>
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${u.isFollowed ? "btn-secondary" : "btn-outline-primary"}`}
                  onClick={async () => {
                    setUsers((prevUsers) =>
                      prevUsers.map((user) =>
                        user.id === u.id
                          ? {
                            ...user,
                            isFollowed: !user.isFollowed,
                            followerCount: user.followerCount + (user.isFollowed ? -1 : 1),
                          }
                          : user
                      )
                    );
                    try {
                      if (u.isFollowed) {
                        await unfollowUser(u.id, token);
                      } else {
                        await followUser(u.id, token);
                      }
                    } catch (err) {
                      console.error("❌ Failed to follow/unfollow", err);
                      // Revert UI
                      setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                          user.id === u.id
                            ? {
                              ...user,
                              isFollowed: !user.isFollowed,
                              followerCount: user.followerCount + (user.isFollowed ? -1 : 1),
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

          <div className="mt-4 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      ) : activeTab === "songs" && songs.length === 0 ? (
        <>
          <div className="d-flex gap-4 mb-4">
            {["pop", "jazz", "rock", "classical", "HIP_HOP", "ELECTRONIC"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSongTag(tab)}
                className={`btn ${songTag === tab ? "btn-dark" : "btn-outline-dark"} btn-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <p>No songs found.</p>
        </>
      ) : activeTab === "songs" ? (
        <>
          <div className="d-flex gap-4 mb-4">
            {["pop", "jazz", "rock", "classical", "HIP_HOP", "ELECTRONIC"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSongTag(tab)}
                className={`btn ${songTag === tab ? "btn-dark" : "btn-outline-dark"} btn-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="d-flex flex-column gap-3 mt-3">
            {songs.map((song) => (
              <div
                key={song.id}
                className="d-flex align-items-center gap-3 p-3 rounded shadow-sm bg-light"
              >
                <img
                  src={song.content.imageUrl || "/default-song.png"}
                  alt={song.content.title}
                  width={80}
                  height={80}
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{song.content.title}</h5>
                  <p className="mb-1 text-muted">{song.caption}</p>
                  <div className="d-flex gap-3 text-muted small">
                    <span>🎧 {song.view_count || 0} views</span>
                    <span>❤️ {song.like_count} likes</span>
                    <span>💬 {song.comment_count || 0} comments</span>
                  </div>
                  <div className="mt-1 d-flex flex-wrap gap-1">
                    {song.content.tags.map((tag) => (
                      <span key={tag} className="badge bg-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
                <audio controls src={song.content.mediaUrl} className="ms-auto" style={{ maxWidth: 200 }} />
              </div>
            ))}
          </div>
          <div className="mt-4 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      ) : (
        <p>No results found.</p>
      )
      }
    </div>
  )
}
export default SearchResult;
