import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PostData, LikeDTO } from '@/models';
import { deletePost } from '@/api/post';
import { like, unlike } from '@/api/like';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

// 1. Define the props interface to accept the required event handlers from the parent
interface UserPreviewHandlers {
  onUserMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onUserMouseLeave: () => void;
}

interface PostContentProps extends UserPreviewHandlers {
  post: PostData;
}

const PostContent: React.FC<PostContentProps> = ({ post, onUserMouseEnter, onUserMouseLeave }) => {
  const navigate = useNavigate();

  // 2. The useUserPreview() hook has been REMOVED from this component.
  
  const [isLiked, setIsLiked] = useState(post.isLike);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  // 3. Keep the ref to provide a stable anchor element for positioning.
  const authorAnchorRef = useRef<HTMLAnchorElement>(null);

  const handleDelete = async () => {
    if (window.confirm('您确定要删除这篇帖子吗？此操作不可撤销。')) {
      try {
        const res = await deletePost(post.id);
        if (res.code === 200) {
          alert('删除成功！');
          navigate('/');
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        alert(`删除失败: ${err.message}`);
      }
    }
  };
  
  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const params: LikeDTO = { targetType: 1, targetId: post.id };
    const originalIsLiked = isLiked;
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
    try {
      if (newIsLiked) {
        await like(params);
      } else {
        await unlike(params);
      }
    } catch (error) {
      console.error("点赞/取消点赞失败:", error);
      alert('操作失败，请稍后再试');
      setIsLiked(originalIsLiked);
      setLikeCount(prev => newIsLiked ? prev - 1 : prev + 1); // Corrected logic here
    } finally {
      setIsLiking(false);
    }
  };

  return (
    // 4. The wrapping Fragment and UserPreviewCard have been REMOVED.
    <div style={styles.card}>
      <h1 style={styles.postTitle}>{post.title}</h1>
      
      <div style={styles.authorInfo}>
        <Link 
          ref={authorAnchorRef}
          to={`/profile/${post.userVO.id}`}
          // 5. Call the functions passed down via props.
          onMouseEnter={(e: React.MouseEvent) => onUserMouseEnter(e, post.userVO.id, authorAnchorRef.current)}
          onMouseLeave={onUserMouseLeave}
        >
          <img src={post.userVO.icon || '/default-avatar.png'} alt={post.userVO.username} style={styles.avatar} />
        </Link>
        <div>
          <Link 
            to={`/profile/${post.userVO.id}`} 
            style={styles.authorName}
            // 5. Call the functions passed down via props.
            onMouseEnter={(e: React.MouseEvent) => onUserMouseEnter(e, post.userVO.id, authorAnchorRef.current)}
            onMouseLeave={onUserMouseLeave}
          >
            {post.userVO.username}
          </Link>
          <p style={styles.postMeta}>
            {new Date(post.createdAt).toLocaleString()} · {likeCount} 点赞 · {post.commentCount} 评论
          </p>
        </div>
      </div>
      <div style={styles.markdownContent}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <div style={styles.actionsBar}>
        <button onClick={handleLikeToggle} disabled={isLiking} style={styles.likeButton}>
          {isLiked ? (
            <FaHeart style={{ color: '#ef4444' }} />
          ) : (
            <FaRegHeart />
          )}
          <span style={styles.actionText}>{likeCount > 0 ? likeCount : '点赞'}</span>
        </button>

        {post.isCreator && (
          <div style={styles.creatorActions}>
            <Link to={`/post/edit/${post.id}`} style={styles.actionButton}>编辑</Link>
            <button onClick={handleDelete} style={{...styles.actionButton, color: '#ef4444'}}>删除</button>
          </div>
        )}
      </div>
    </div>
  );
};

// The styles object remains unchanged.
const styles: { [key: string]: React.CSSProperties } = {
  card: { backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
  postTitle: { fontSize: '32px', margin: '0 0 20px 0' },
  authorInfo: { display: 'flex', alignItems: 'center', marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #f0f0f0' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', marginRight: '15px' },
  authorName: { textDecoration: 'none', color: '#333', fontWeight: '600', fontSize: '16px' },
  postMeta: { fontSize: '14px', color: '#999', margin: '4px 0 0 0' },
  markdownContent: { fontSize: '16px', lineHeight: 1.7, margin: '25px 0' },
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '15px',
    borderTop: '1px solid #f0f0f0',
    marginTop: '20px',
  },
  likeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f0f2f5',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '20px',
  },
  actionText: {
    lineHeight: 1,
  },
  creatorActions: { 
    display: 'flex', 
    gap: '15px',
  },
  actionButton: { 
    background: 'none', 
    border: '1px solid #ddd',
    color: '#666', 
    cursor: 'pointer', 
    padding: '6px 12px', 
    fontSize: '14px',
    borderRadius: '6px',
    textDecoration: 'none',
  },
};

export default PostContent;