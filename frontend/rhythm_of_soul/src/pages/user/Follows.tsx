import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Follow {
  avatar: string;
  name: string;
  job: string;
  dropdownId: string;
}

export default function Follows() {
  const { id } = useParams();
  const [follows, setFollows] = useState<Follow[]>([]);

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const response = await fetch(`/api/users/${id}/follows`);
        const data = await response.json();
        setFollows(data);
      } catch (error) {
        console.error("Failed to fetch follows", error);
      }
    };

    fetchFollows();
  }, [id]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="header-title">
          <h4 className="card-title">Follows</h4>
        </div>
      </div>
      <div className="card-body">
        <ul className="list-inline m-0 p-0">
          {follows.map((follow, index) => (
            <li className="d-flex mb-4 align-items-center" key={index}>
              <img
                src={follow.avatar}
                alt="story-img"
                className="rounded-pill avatar-40"
                loading="lazy"
              />
              <div className="ms-3 flex-grow-1">
                <h6>{follow.name}</h6>
                <p className="mb-0">{follow.job}</p>
              </div>
              <div className="dropdown">
                <span
                  className="dropdown-toggle"
                  id={follow.dropdownId}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  role="button"
                ></span>
                <div
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby={follow.dropdownId}
                >
                  <a className="dropdown-item" href="#">Unfollow</a>
                  <a className="dropdown-item" href="#">Unfriend</a>
                  <a className="dropdown-item" href="#">Block</a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}