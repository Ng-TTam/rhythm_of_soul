import React from "react";

interface FeedProps {
  userName: string;
  userRole: string;
  userAvatar: string;
  postImage: string;
  postTime: string;
  comments: {
    avatar: string;
    name: string;
    content: string;
    time: string;
  }[];
}

export default function Feeds({ userName, userRole, userAvatar, postImage, postTime, comments }: FeedProps) {
  return (
    <div id="profile-feeds" className="tab-pane fade show active">
      <div className="card-header d-flex align-items-center justify-content-between pb-4">
        <div className="header-title">
          <div className="d-flex flex-wrap">
            <div className="media-support-user-img me-3">
              <img className="rounded-pill img-fluid avatar-60 bg-soft-danger p-1" src={userAvatar} alt="avatar" loading="lazy" />
            </div>
            <div className="media-support-info mt-2">
              <h5 className="mb-0">{userName}</h5>
              <p className="mb-0 text-primary">{userRole}</p>
            </div>
          </div>
        </div>
        <div className="dropdown">
          <span className="dropdown-toggle" id="dropdownMenuButton7" data-bs-toggle="dropdown" aria-expanded="false" role="button">
            {postTime}
          </span>
          <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton7">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="user-post">
          <a href="#"><img src={postImage} alt="post-image" className="img-fluid" loading="lazy" /></a>
        </div>

        <div className="comment-area p-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <span className="me-3">❤️ 140</span>
              <span className="me-3">💬 140</span>
            </div>
            <div className="share-block">
              <a href="#">🔗 99 Share</a>
            </div>
          </div>

          <hr />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          <hr />

          <ul className="list-inline p-0 m-0">
            {comments.map((c, idx) => (
              <li className="mb-2" key={idx}>
                <div className="d-flex">
                  <img src={c.avatar} alt="comment-avatar" className="avatar-50 p-1 bg-soft-primary rounded-pill img-fluid" loading="lazy" />
                  <div className="ms-3">
                    <h6 className="mb-1">{c.name}</h6>
                    <p className="mb-1">{c.content}</p>
                    <div className="d-flex flex-wrap align-items-center">
                      <a href="#" className="me-3">❤️ like</a>
                      <a href="#" className="me-3">💬 reply</a>
                      <a href="#" className="me-3">🌐 translate</a>
                      <span>{c.time}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <form className="comment-text d-flex align-items-center mt-3" action="#">
            <input type="text" className="form-control" placeholder="Lovely!" />
            <div className="comment-attagement d-flex ms-2">
              📎 😊
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}