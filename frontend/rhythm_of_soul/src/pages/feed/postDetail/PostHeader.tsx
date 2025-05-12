import React from 'react';
import { Card } from 'react-bootstrap';
import { FaFileAlt } from '@react-icons/all-files/fa/FaFileAlt';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { FaListUl } from '@react-icons/all-files/fa/FaListUl';

import { PostType, getRelativeTime } from '../../../model/post';

interface PostHeaderProps {
  userAvatar: string;
  username: string;
  createdAt: string;
  type: PostType;
}

const PostHeader: React.FC<PostHeaderProps> = ({ userAvatar, username, createdAt, type }) => (
  <Card.Header className="post-header">
    <div className="user-info">
      <img src={userAvatar} alt={username} className="user-avatar" />
      <div>
        <div className="username">{username}</div>
        <div className="post-time">{getRelativeTime(createdAt)}</div>
      </div>
    </div>
    <div className="post-type">
      {type === 'TEXT' && <FaFileAlt />}
      {type === 'SONG' && <FaMusic />}
      {(type === 'ALBUM' || type === 'PLAYLIST') && <FaListUl />}
      <span>{type}</span>
    </div>
  </Card.Header>
);

export default React.memo(PostHeader);