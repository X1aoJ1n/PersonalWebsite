// src/components/PostCard.tsx
import React, { useState } from 'react'; // 引入 useState
import { Link } from 'react-router-dom';
import type { SimplePostData } from '@/models';

interface PostCardProps {
  post: Partial<SimplePostData>;
  variant?: 'default' | 'header';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  // --- 新增：用于追踪鼠标悬浮状态 ---
  const [isHovered, setIsHovered] = useState(false);

  const baseCardStyle = {
    ...styles.postCard,
    ...(variant === 'header' ? styles.headerCard : {}),
  };

  // --- 修改：合并基础样式和悬浮样式 ---
  const cardStyle = {
    ...baseCardStyle,
    ...(isHovered ? styles.cardHover : {}), // 如果 isHovered 为 true，则应用悬浮样式
  };

  const titleStyle = {
    ...styles.postTitleLink,
    ...(variant === 'header' ? styles.headerTitle : {}),
  };

  const cardContent = (
    <>
      <h3 style={styles.postTitle}>
        <span style={titleStyle}>{post.title}</span>
      </h3>
      
      {variant === 'default' && (
        <>
          <p style={styles.postPreview}>{post.preview || '暂无预览...'}</p>
          <div style={styles.postMeta}>
            <span>{post.userVO?.username}</span>
            <span> · </span>
            <span>{post.likeCount} ❤️ </span>
            <span> · </span>
            <span>{post.commentCount} 💬 </span>
            <span style={styles.postDate}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
          </div>
        </>
      )}
    </>
  );

  if (variant === 'default' && post.id) {
    return (
      <Link 
        to={`/post/${post.id}`} 
        style={styles.cardLink}
        // --- 新增：鼠标事件处理器 ---
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={cardStyle}>
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div style={cardStyle}>
      {cardContent}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    marginBottom: '15px',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  headerCard: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    marginBottom: '15px',
  },
  headerTitle: {
    color: '#fff',
  },
  postTitle: {
    margin: '0',
  },
  postTitleLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '18px',
    fontWeight: '600',
  },
  postPreview: {
    color: '#666',
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '15px',
    lineHeight: 1.6,
    // --- 新增：强制长单词或URL换行 ---
    overflowWrap: 'break-word',
  },
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#999',
    fontSize: '13px',
  },
  postDate: {
    marginLeft: 'auto',
  },
};

export default PostCard;