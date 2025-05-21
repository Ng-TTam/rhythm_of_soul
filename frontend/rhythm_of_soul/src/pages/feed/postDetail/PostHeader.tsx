import React from 'react';
import { Card } from 'react-bootstrap';
import { FaFileAlt } from '@react-icons/all-files/fa/FaFileAlt';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { FaListUl } from '@react-icons/all-files/fa/FaListUl';

import { PostType, getRelativeTime } from '../../../model/post/post';
import styles from '../../../styles/PostDetail.module.css'; // Updated import

interface PostHeaderProps {
  userAvatar: string;
  username: string;
  createdAt: string;
  type: PostType;
}

const PostHeader: React.FC<PostHeaderProps> = ({ userAvatar, username, createdAt, type }) => (
  <Card.Header className={styles['post-header']}>
    <div className={styles['user-info']}>
      <img 
        src={userAvatar} 
        alt={username} 
        className={styles['user-avatar']}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
        }}
      />
      <div>
        <div className={styles['username']}>{username}</div>
        <div className={styles['post-time']}>{getRelativeTime(createdAt)}</div>
      </div>
    </div>
    <div className={styles['post-type']}>
      {type === 'TEXT' && <FaFileAlt />}
      {type === 'SONG' && <FaMusic />}
      {(type === 'ALBUM' || type === 'PLAYLIST') && <FaListUl />}
      <span>{type}</span>
    </div>
  </Card.Header>
);

export default React.memo(PostHeader);