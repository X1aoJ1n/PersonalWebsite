import React from 'react';
// ========= 1. Import UserData type =========
import type { CommentData, AddCommentRequest, UserData } from '@/models';
import { createComment } from '@/api/comment';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

// User preview handlers remain the same
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
  currentUser: UserData | null;
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
  currentUser,
  onCommentDeleted,
  onCommentUpdated,
  onReplyDeleted,
}) => {

  // 更改: Derive a boolean for login status
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
    } catch (error) {
       console.error("Comment submission failed:", error);
       alert('评论失败，请稍后重试。');
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>评论 ({totalCommentCount})</h3>

      {/* 更改: Conditionally render the comment form */}
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
            currentUser={currentUser}
            onCommentDeleted={onCommentDeleted}
            onCommentUpdated={onCommentUpdated}
            onReplyDeleted={onReplyDeleted}
            // 更改: Pass the isLoggedIn boolean down to CommentItem
            isLoggedIn={isLoggedIn}
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