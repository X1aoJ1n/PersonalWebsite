// src/components/post/PostContent.tsx

import React, { useState, useRef } from 'react';
import { Link, useNavigate , useOutletContext } from 'react-router-dom';
import DOMPurify from 'dompurify';
import type { PostData, LikeDTO } from '@/models';
import { deletePost } from '@/api/post';
import { like, unlike } from '@/api/like';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import type { OutletContextType } from '@/layouts/RootLayout';
import { usePostPage } from '@/contexts/PostPageContext';

interface UserPreviewHandlers {
  onUserMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onUserMouseLeave: () => void;
}

interface PostContentProps extends UserPreviewHandlers {
  post: PostData;
  isLoggedIn: boolean;
}

const PostContent: React.FC<PostContentProps> = ({ 
  post, 
  onUserMouseEnter, 
  onUserMouseLeave, 
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(post.isLike);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  const { showToast } = useOutletContext<OutletContextType>();
  const { setConfirm } = usePostPage();
  
  const authorAnchorRef = useRef<HTMLAnchorElement>(null);

  const handleDelete = async () => {
    // 使用 setConfirm 替换 window.confirm
    setConfirm({
      isOpen: true,
      title: '删除帖子',
      children: '您确定要删除这篇帖子吗？此操作不可撤销。',
      confirmColor: 'danger',
      confirmText: '删除',
      onConfirm: async () => { // 确认后的回调
        try {
          const res = await deletePost(post.id);
          if (res.code === 200) {
            showToast('删除成功！', 'success'); // 替换 alert
            navigate('/');
          } else {
            throw new Error(res.message);
          }
        } catch (err: any) {
          showToast(`删除失败: ${err.message}`, 'error'); // 替换 alert
        }
      }
    });
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
          onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onUserMouseEnter(e, post.userVO.id, authorAnchorRef.current)}
          onMouseLeave={onUserMouseLeave}
        >
          <img src={post.userVO.icon || '/default-avatar.png'} alt={post.userVO.username} style={styles.avatar} />
        </Link>
        <div>
          <Link 
            to={`/profile/${post.userVO.id}`} 
            style={styles.authorName}
            // 5. Call the functions passed down via props.
            onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onUserMouseEnter(e, post.userVO.id, authorAnchorRef.current)}
            onMouseLeave={onUserMouseLeave}
          >
            {post.userVO.username}
          </Link>
          <p style={styles.postMeta}>
            {new Date(post.createdAt).toLocaleString()} · {likeCount} 点赞 · {post.commentCount} 评论
          </p>
        </div>
      </div>
      <div 
        className="post-content" // <--- 在这里添加类名
        style={styles.markdownContent}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />

      <div style={styles.actionsBar}>
        {/* 3. Conditionally render the like button based on `isLoggedIn` */}
        {isLoggedIn && (
          <button onClick={handleLikeToggle} disabled={isLiking} style={styles.likeButton}>
            {isLiked ? (
              <FaHeart style={{ color: '#ef4444' }} />
            ) : (
              <FaRegHeart />
            )}
            <span style={styles.actionText}>{likeCount > 0 ? likeCount : '点赞'}</span>
          </button>
        )}

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

// 4. Update styles to ensure layout works when the like button is hidden
const styles: { [key: string]: React.CSSProperties } = {
  card: { backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
  postTitle: { fontSize: '32px', margin: '0 0 20px 0' },
  authorInfo: { display: 'flex', alignItems: 'center', marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #f0f0f0' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', marginRight: '15px' },
  authorName: { textDecoration: 'none', color: '#333', fontWeight: '600', fontSize: '16px' },
  postMeta: { fontSize: '14px', color: '#999', margin: '4px 0 0 0' },
  markdownContent: { 
    fontSize: '16px', 
    lineHeight: 1.7, 
    margin: '25px 0',
    overflowWrap: 'break-word',
  },
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    // Remove justifyContent to prevent creator actions from moving left
    // justifyContent: 'space-between', 
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
    marginLeft: 'auto', // This pushes the creator actions to the right
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