// src/components/PostCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { SimplePostData } from '@/models';

interface PostCardProps {
  post: Partial<SimplePostData>; // 使用 Partial<> 允许传入不完整的 post 对象（用于标题）
  variant?: 'default' | 'header'; // 新增 variant 属性
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  // 根据 variant 生成动态样式
  const cardStyle = {
    ...styles.postCard,
    ...(variant === 'header' ? styles.headerCard : {}),
  };

  const titleStyle = {
    ...styles.postTitleLink,
    ...(variant === 'header' ? styles.headerTitle : {}),
  };

  return (
    <div style={cardStyle}>
      <h3 style={styles.postTitle}>
        {/* 如果是 header，则标题不可点击 */}
        {variant === 'header' || !post.id ? (
          <span style={titleStyle}>{post.title}</span>
        ) : (
          <Link to={`/post/${post.id}`} style={titleStyle}>
            {post.title}
          </Link>
        )}
      </h3>
      
      {/* 只有默认样式的卡片才显示预览和元信息 */}
      {variant === 'default' && (
        <>
          <p style={styles.postPreview}>{post.preview || '暂无预览...'}</p>
          <div style={styles.postMeta}>
            <span>{post.userVO?.username}</span>
            <span> · </span>
            <span>{post.likeCount} 点赞</span>
            <span> · </span>
            <span>{post.commentCount} 评论</span>
            <span style={styles.postDate}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  postCard: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e0e0e0',
  },
  // --- 新增的样式 ---
  headerCard: {
    backgroundColor: '#4f46e5', // 蓝色背景
    color: '#fff', // 白色字体
    border: 'none',
    padding: '12px 20px', // 减小上下内边距 (之前是20px)，左右保持不变
  },
  headerTitle: {
    color: '#fff', // 标题白色
  },
  // --- 结束 ---
  postTitle: {
    margin: '0', // 移除了 h3 的默认 margin
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
    marginTop: '10px', // 从标题下方增加一点间距
    marginBottom: '15px',
    lineHeight: 1.6,
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