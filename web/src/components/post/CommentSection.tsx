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
  // Add new props for user context and actions
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
  // ========= 3. Destructure the new props =========
  currentUser,
  onCommentDeleted,
  onCommentUpdated,
  onReplyDeleted,
}) => {

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
      <CommentForm 
        onSubmit={handleCommentSubmit}
        placeholder="留下你的精彩评论吧..."
        cta="发表评论"
      />
      <div style={styles.commentList}>
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            onReplyAdded={onReplyAdded}
            onCommentAuthorMouseEnter={onCommentAuthorMouseEnter}
            onReplyAuthorMouseEnter={onReplyAuthorMouseEnter}
            onUserMouseLeave={onUserMouseLeave}
            // ========= 4. Pass the new props down to each CommentItem =========
            currentUser={currentUser}
            onCommentDeleted={onCommentDeleted}
            onCommentUpdated={onCommentUpdated}
            onReplyDeleted={onReplyDeleted}
          />
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: { backgroundColor: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginTop: '20px' },
  sectionTitle: { margin: '0 0 10px 0' },
  commentList: { display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' },
};

export default CommentSection;