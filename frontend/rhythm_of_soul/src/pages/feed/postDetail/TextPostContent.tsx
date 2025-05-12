import React from 'react';

interface TextPostContentProps {
  caption?: string;
}

const TextPostContent: React.FC<TextPostContentProps> = ({ caption }) => (
  <div className="text-post-content">
    <div className="post-caption">{caption}</div>
  </div>
);

export default React.memo(TextPostContent);