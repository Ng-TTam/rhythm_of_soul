import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Comment {
  avatar: string;
  name: string;
  content: string;
  time: string;
}

export default function Feeds() {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    userName: "",
    userRole: "",
    userAvatar: "",
    postImage: "",
    postTime: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Giả sử có hàm fetchFeedData
    const fetchFeedData = async () => {
      try {
        const res = await fetch(`/api/users/${id}/feeds`);
        const data = await res.json();
        setUserData(data.feedInfo);
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch feed data", error);
      }
    };

    fetchFeedData();
  }, [id]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between pb-4">
        <div className="d-flex">
          <img src={userData.userAvatar} className="rounded-pill avatar-60 me-3" />
          <div>
            <h5>{userData.userName}</h5>
            <p>{userData.userRole}</p>
          </div>
        </div>
        <span>{userData.postTime}</span>
      </div>

      <div className="card-body">
        <img src={userData.postImage} className="img-fluid mb-3" />

        <ul className="list-unstyled">
          {comments.map((c, i) => (
            <li key={i} className="mb-3 d-flex">
              <img src={c.avatar} className="rounded-circle avatar-50 me-2" />
              <div>
                <strong>{c.name}</strong>
                <p>{c.content}</p>
                <small>{c.time}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
