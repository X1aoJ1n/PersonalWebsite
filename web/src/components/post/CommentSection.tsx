import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout';

import type { CommentData, AddCommentRequest } from '@/models';
import { createComment } from '@/api/comment';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface UserPreviewHandlers {
  onCommentAuthorMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onReplyAuthorMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onUserMouseLeave: () => void;
}

// ========= 2. Extend the main props interface =========
interface CommentSectionProps extends UserPreviewHandlers {
  postId: string;
  comments: CommentData[];
  totalCommentCount: number;
  onNewCommentAdded: (newComment: CommentData) => void;
  onReplyAdded: (targetCommentId: string) => void;
  onCommentDeleted: (commentId: string) => Promise<void>;
  onCommentUpdated: (commentId: string, newContent: string) => Promise<void>;
  onReplyDeleted: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  comments, 
  totalCommentCount, 
  onNewCommentAdded,
  onReplyAdded,
  onCommentAuthorMouseEnter,
  onReplyAuthorMouseEnter,
  onUserMouseLeave,
  onCommentDeleted,
  onCommentUpdated,
  onReplyDeleted,
}) => {

  const { currentUser, showToast } = useOutletContext<OutletContextType>();
  const isLoggedIn = !!currentUser;

  const handleCommentSubmit = async (text: string) => {
    const payload: AddCommentRequest = { postId, content: text };
    try {
      const res = await createComment(payload);
      if (res.code === 200 && res.data) {
        onNewCommentAdded(res.data);
      } else {
        throw new Error(res.message || '评论失败');
      }
    } catch (error: any) {
       console.error("Comment submission failed:", error);
       showToast(error.message || '评论失败，请稍后重试。', 'error'); // 替换 alert
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>评论 ({totalCommentCount})</h3>

      {isLoggedIn ? (
        <CommentForm 
          onSubmit={handleCommentSubmit}
          placeholder="留下你的精彩评论吧..."
          cta="发表评论"
        />
      ) : (
        <div style={styles.loginPrompt}>
          请<a href="/auth" style={styles.loginLink}>登录</a>后发表评论
        </div>
      )}

      <div style={styles.commentList}>
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            onReplyAdded={onReplyAdded}
            onCommentAuthorMouseEnter={onCommentAuthorMouseEnter}
            onReplyAuthorMouseEnter={onReplyAuthorMouseEnter}
            onUserMouseLeave={onUserMouseLeave}
            onCommentDeleted={onCommentDeleted}
            onCommentUpdated={onCommentUpdated}
            onReplyDeleted={onReplyDeleted}
            // ★ 9. 不再需要传递 currentUser, isLoggedIn, showToast, setConfirm ★
            // CommentItem 自己会从 Context 获取它们
          />
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: { backgroundColor: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginTop: '20px' },
  sectionTitle: { margin: '0 0 20px 0', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' },
  commentList: { display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' },
  // 更改: Add styles for the login prompt
  loginPrompt: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    margin: '20px 0',
    color: '#666',
  },
  loginLink: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
    margin: '0 4px',
  },
};

export default CommentSection;