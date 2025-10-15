import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { CommentData, ReplyData, AddReplyRequest, LikeDTO, UserData } from '@/models';
import { createReply, getRepliesByCommentId, updateReply, deleteReply } from '@/api/reply';
import { like, unlike } from '@/api/like';
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from 'react-icons/fa';
import CommentForm from './CommentForm';

// --- Interfaces from your original code (no changes needed here) ---
interface CommentPreviewHandlers {
  onCommentAuthorMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onReplyAuthorMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onUserMouseLeave: () => void;
}

interface ReplyPreviewHandlers {
  onReplyAuthorMouseEnter: (e: React.MouseEvent, userId: string, anchor: HTMLElement | null) => void;
  onUserMouseLeave: () => void;
}

interface ReplyItemProps extends ReplyPreviewHandlers {
  reply: ReplyData;
  onReplyClick: () => void;
  onUpdate: (replyId: string, newContent: string) => Promise<void>;
  onDelete: (replyId: string) => Promise<void>;
  isLoggedIn: boolean; 
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onReplyClick, onReplyAuthorMouseEnter, onUserMouseLeave, onUpdate, onDelete, isLoggedIn }) => {
  const [isLiked, setIsLiked] = useState(reply.isLike);
  const [likeCount, setLikeCount] = useState(reply.likeCount);
  const [isLiking, setIsLiking] = useState(false);
  const replyAuthorNameRef = useRef<HTMLAnchorElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleLikeToggle = async () => {
    if (isLiking || reply.status === 1) return; // Cannot like a deleted reply
    // ... rest of your existing like logic
    setIsLiking(true);
    const params: LikeDTO = { targetType: 3, targetId: reply.id };
    try {
        if (!isLiked) await like(params); else await unlike(params);
        setIsLiked(!isLiked);
        setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
    } catch (error) {
        console.error("Reply like/unlike failed:", error);
    } finally {
        setIsLiking(false);
    }
  };

  const handleUpdateSubmit = async (text: string) => {
    await onUpdate(reply.id, text);
    setIsEditing(false);
  };
  
  // ========= NEW: Render a specific "deleted" state =========
  if (reply.status === 1) {
    return (
      <div style={styles.replyItem}>
        <Link to={`/profile/${reply.userVO.id}`}>
          <img
            src={reply.userVO.icon || '/default-avatar.png'}
            alt={reply.userVO.username}
            style={{ ...styles.avatarSmall, filter: 'grayscale(100%)' }}
          />
        </Link>
        <div style={styles.commentContent}>
          {/* Still show the original author's name */}
          <Link to={`/profile/${reply.userVO.id}`} style={styles.authorName}>
            {reply.userVO.username}
          </Link>
          {/* Show the deleted message */}
          <p style={styles.deletedText}>该回复已被删除</p>
          {/* Optionally, show the timestamp but no action buttons */}
           <div style={styles.commentActions}>
             <span>{new Date(reply.createdAt).toLocaleString()}</span>
           </div>
        </div>
      </div>
    );
  }

   return (
    <div style={styles.replyItem}>
      <Link
        to={`/profile/${reply.userVO.id}`}
        onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onReplyAuthorMouseEnter(e, reply.userVO.id, replyAuthorNameRef.current)}
        onMouseLeave={onUserMouseLeave}
      >
        <img src={reply.userVO.icon || '/default-avatar.png'} alt={reply.userVO.username} style={styles.avatarSmall} />
      </Link>
      <div style={styles.commentContent}>
        <div>
          <Link ref={replyAuthorNameRef} to={`/profile/${reply.userVO.id}`} style={styles.authorName} onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onReplyAuthorMouseEnter(e, reply.userVO.id, replyAuthorNameRef.current)} onMouseLeave={onUserMouseLeave}>
            {reply.userVO.username}
          </Link>
          {reply.replyToVO?.userId && (
            <span style={styles.replyTo}>
              {' 回复 '}
              <Link to={`/profile/${reply.replyToVO.userId}`} style={{...styles.authorName, fontSize: '14px'}} onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onReplyAuthorMouseEnter(e, reply.replyToVO!.userId, e.currentTarget as HTMLElement)} onMouseLeave={onUserMouseLeave}>
                @{reply.replyToVO.userName}
              </Link>
            </span>
          )}
        </div>
        
        {isEditing ? (
          <CommentForm
            onSubmit={handleUpdateSubmit}
            placeholder=""
            cta="保存"
            initialText={reply.content}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p style={styles.commentText}>{reply.content}</p>
        )}
        
        <div style={styles.commentActions}>
          <span>{new Date(reply.createdAt).toLocaleString()}</span>
          {isLoggedIn && (
            <button onClick={onReplyClick} style={styles.buttonSmall}>回复</button>
          )}
           {isLoggedIn && (
            <button onClick={handleLikeToggle} disabled={isLiking} style={styles.likeButtonSmall}>
              {isLiked ? <FaHeart style={{ color: '#ef4444' }}/> : <FaRegHeart />}
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
          )}

          {reply.isCreator && !isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} style={styles.actionButton}><FaEdit /></button>
              <button onClick={() => onDelete(reply.id)} style={{...styles.actionButton, color: '#ef4444'}}><FaTrash /></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps extends CommentPreviewHandlers {
  comment: CommentData;
  onReplyAdded: (targetCommentId: string) => void;
  currentUser: UserData | null;
  onCommentDeleted: (commentId: string) => Promise<void>;
  onCommentUpdated: (commentId: string, newContent: string) => Promise<void>;
  onReplyDeleted: (commentId: string) => void;
  isLoggedIn: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReplyAdded, 
  onCommentAuthorMouseEnter, 
  onReplyAuthorMouseEnter, 
  onUserMouseLeave,
  onCommentDeleted,
  onCommentUpdated,
  isLoggedIn 
}) => {
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{ id: string; username: string } | null>(null);
  const [isLiked, setIsLiked] = useState(comment.isLike);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isLiking, setIsLiking] = useState(false);
  const commentAuthorNameRef = useRef<HTMLAnchorElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleLikeToggle = async () => {
    if (isLiking || comment.status === 1) return; // Cannot like a deleted comment
    // ... rest of your existing like logic
    const params: LikeDTO = { targetType: 2, targetId: comment.id };
    setIsLiking(true);
    try {
        if (!isLiked) await like(params); else await unlike(params);
        setIsLiked(!isLiked);
        setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
    } catch (error) {
        console.error("Comment like/unlike failed:", error);
    } finally {
        setIsLiking(false);
    }
  };

  const fetchReplies = async () => {
    if (isLoadingReplies) return;
    setIsLoadingReplies(true);
    try {
      const res = await getRepliesByCommentId(comment.id, { pageNum: 1, pageSize: 10 });
      if (res.code === 200 && res.data) {
        setReplies(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleToggleReplies = () => {
    const newShowState = !showReplies;
    setShowReplies(newShowState);
    if (newShowState && replies.length === 0) {
      fetchReplies();
    }
  };

  const handleReplyToComment = () => {
    setReplyTarget(null);
    setShowReplyForm(!showReplyForm);
  };

  const handleReplyToReply = (targetReply: ReplyData) => {
    setReplyTarget({ id: targetReply.id, username: targetReply.userVO.username });
    setShowReplyForm(true);
  };

  const handleReplySubmit = async (text: string) => {
    const payload: AddReplyRequest = { 
      commentId: comment.id, 
      content: text,
      replyTo: replyTarget ? replyTarget.id : undefined,
    };
    const res = await createReply(payload);
    if (res.code === 200 && res.data) {
      setReplies(prevReplies => [res.data, ...prevReplies]);
      onReplyAdded(comment.id);
      setShowReplyForm(false);
      setReplyTarget(null);
      setShowReplies(true);
    } else {
      throw new Error(res.message || 'Reply failed');
    }
  };

  // ========= ADD handlers for comment and reply modifications =========
  const handleUpdateComment = async (text: string) => {
    await onCommentUpdated(comment.id, text);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    if (window.confirm('确定要删除这条评论吗？')) {
      // This function now expects the parent to handle the "soft delete" state change
      onCommentDeleted(comment.id);
    }
  };
  
  const handleUpdateReply = async (replyId: string, newContent: string) => {
    try {
      await updateReply({ id: replyId, content: newContent });
      setReplies(prev => 
        prev.map(r => r.id === replyId ? { ...r, content: newContent } : r)
      );
    } catch (error: any) {
      alert(error.message || '更新回复失败');
    }
  };

  // ========= MODIFIED: Implement soft delete for replies =========
  const handleDeleteReply = async (replyId: string) => {
    if (window.confirm('确定要删除这条回复吗？')) {
      try {
        await deleteReply(replyId);
        // Instead of filtering, we map and update the status of the deleted reply
        setReplies(prev => 
          prev.map(r => 
            r.id === replyId 
            ? { ...r, status: 1, content: '该回复已被删除' } // Mark as deleted
            : r
          )
        );
        // We no longer call onReplyDeleted because the reply count should not decrease
      } catch (error: any) {
        alert(error.message || '删除回复失败');
      }
    }
  };

  return (
    <div style={styles.commentItem}>
      <Link to={`/profile/${comment.userVO.id}`} onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onCommentAuthorMouseEnter(e, comment.userVO.id, commentAuthorNameRef.current)} onMouseLeave={onUserMouseLeave}>
        <img src={comment.userVO.icon || '/default-avatar.png'} alt={comment.userVO.username} style={comment.status === 1 ? {...styles.avatar, filter: 'grayscale(100%)'} : styles.avatar} />
      </Link>

      <div style={styles.commentContent}>
        <Link ref={commentAuthorNameRef} to={`/profile/${comment.userVO.id}`} style={styles.authorName} onMouseEnter={(e: React.MouseEvent) => isLoggedIn && onCommentAuthorMouseEnter(e, comment.userVO.id, commentAuthorNameRef.current)} onMouseLeave={onUserMouseLeave}>
          {comment.userVO.username}
        </Link>
        
        {/* ========= MODIFIED: Render based on comment status ========= */}
        {comment.status === 1 ? (
          <p style={styles.deletedText}>该评论已被删除</p>
        ) : isEditing ? (
          <CommentForm 
            onSubmit={handleUpdateComment}
            placeholder=""
            cta="保存"
            initialText={comment.content}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p style={styles.commentText}>{comment.content}</p>
        )}

        <div style={styles.commentActions}>
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
        {comment.status !== 1 && (
          <>
            {/* 6. Conditionally render the comment's like button */}
            {isLoggedIn && (
              <button onClick={handleLikeToggle} disabled={isLiking} style={styles.likeButtonSmall}>
                {isLiked ? <FaHeart style={{ color: '#ef4444' }}/> : <FaRegHeart />}
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
            )}

            {isLoggedIn && (
              <button onClick={handleReplyToComment} style={styles.buttonLarge}>
              {showReplyForm && !replyTarget ? '取消回复' : '回复'}
              </button>
            )}
            {comment.isCreator && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} style={styles.actionButton}><FaEdit /> 编辑</button>
                <button onClick={handleDeleteComment} style={{...styles.actionButton, color: '#ef4444'}}><FaTrash /> 删除</button>
              </>
            )}
          </>
        )}
        {comment.replyCount > 0 && (
          <button onClick={handleToggleReplies} style={styles.actionButton}>
            {isLoadingReplies ? '加载中...' : (showReplies ? '收起回复' : `查看 ${comment.replyCount} 条回复`)}
          </button>
        )}
      </div>
        
        {showReplies && (
        <div style={styles.repliesContainer}>
          {replies.map(reply => 
            <ReplyItem
              key={reply.id}
              reply={reply}
              onReplyClick={() => handleReplyToReply(reply)}
              onReplyAuthorMouseEnter={onReplyAuthorMouseEnter}
              onUserMouseLeave={onUserMouseLeave}
              onUpdate={handleUpdateReply}
              onDelete={handleDeleteReply}
              isLoggedIn={isLoggedIn} // 7. Pass `isLoggedIn` down to ReplyItem
            />
          )}
        </div>
      )}


        {showReplyForm && comment.status !== 1 && (
          <CommentForm 
            onSubmit={handleReplySubmit} 
            placeholder={replyTarget ? `回复 @${replyTarget.username}...` : `回复 @${comment.userVO.username}...`}
            cta="回复"
          />
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  avatar: { width: '40px', height: '40px', borderRadius: '50%', alignSelf: 'flex-start' },
  avatarSmall: { width: '28px', height: '28px', borderRadius: '50%', alignSelf: 'flex-start' },
  authorName: { textDecoration: 'none', color: '#333', fontWeight: '600', fontSize: '15px' },
  commentItem: { display: 'flex', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0', marginBottom: '20px' },
  commentContent: { flex: 1 },
  commentText: { margin: '8px 0', fontSize: '15px', whiteSpace: 'pre-wrap', lineHeight: 1.6 },
  // ========= NEW STYLE for deleted items =========
  deletedText: { margin: '8px 0', fontSize: '15px', color: '#999', fontStyle: 'italic' },
  commentActions: { display: 'flex', gap: '15px', fontSize: '12px', color: '#999', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' },
  likeButtonSmall: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0', fontSize: '13px' },
  actionButton: { background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' },
  buttonLarge: { background: '#f0f2f5', border: 'none', color: '#555', cursor: 'pointer', padding: '4px 10px', fontSize: '13px', fontWeight: '600', borderRadius: '6px' },
  buttonSmall: { background: '#f0f2f5', border: 'none', color: '#555', cursor: 'pointer', padding: '2px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '4px' },
  repliesContainer: { marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '15px' },
  replyItem: { display: 'flex', gap: '10px' },
  replyTo: { color: '#666', fontSize: '14px' },
};

export default CommentItem;