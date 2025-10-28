// src/pages/PostDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getPostDetail } from '@/api/post';
import { getCommentsByPostId, deleteComment as apiDeleteComment, updateComment as apiUpdateComment } from '@/api/comment';
import type { PostData, CommentData } from '@/models';
import type { OutletContextType } from '@/layouts/RootLayout';
import PostContent from '@/components/post/PostContent';
import CommentSection from '@/components/post/CommentSection';
import { useUserPreview } from '@/hooks/useUserPreview';
import UserPreviewCard from '@/components/common/UserPreviewCard';
import Alert from '@/components/common/Alert';
import { PostPageProvider, type ConfirmSetter } from '@/contexts/PostPageContext';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, showToast } = useOutletContext<OutletContextType>();
  const isLoggedIn = !!currentUser;

  // ★ 2. 修正 state：使用 'children' 而不是 'message'
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '请确认',
    children: '', // 之前是 message
    onConfirm: () => {},
    confirmText: '确认',
    confirmColor: 'primary' as 'primary' | 'danger',
  });
  const closeConfirm = () => setConfirm(s => ({ ...s, isOpen: false }));

  const { 
    isCardVisible, 
    previewData, 
    isLoading: isPreviewLoading, 
    cardPosition, 
    handleMouseEnterForComment, 
    handleMouseEnterForReply, 
    handleMouseEnterForPost, 
    handleMouseLeave, 
    handleCardMouseEnter 
  } = useUserPreview();

  useEffect(() => {
    if (!postId) {
      setError('帖子 ID 无效');
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postRes, commentsRes] = await Promise.all([
          getPostDetail(postId),
          getCommentsByPostId(postId, { pageNum: 1, pageSize: 20 }),
        ]);

        if (postRes.code === 200 && postRes.data) {
          setPost(postRes.data);
        } else {
          throw new Error(postRes.message || '获取帖子失败');
        }

        if (commentsRes.code === 200 && commentsRes.data) {
          setComments(commentsRes.data);
        }
      } catch (err: any) {
        setError(err.message || '加载失败');
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postId]);
  
  const handleNewCommentAdded = (newComment: CommentData) => {
    setComments(prevComments => [newComment, ...prevComments]);
    if (post) {
      setPost({ ...post, commentCount: post.commentCount + 1 });
    }
  };

  const handleReplyAdded = (targetCommentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === targetCommentId) {
          return { ...comment, replyCount: (comment.replyCount || 0) + 1 };
        }
        return comment;
      })
    );
    if (post) {
      setPost({ ...post, commentCount: post.commentCount + 1 });
    }
  };

  const performDeleteComment = async (commentId: string) => {
    closeConfirm();
    try {
      await apiDeleteComment(commentId); 

      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, status: 1 };
          }
          return comment;
        })
      );

      const commentToDelete = comments.find(c => c.id === commentId);
      if (post && commentToDelete) {
        setPost({ ...post, commentCount: post.commentCount - 1 });
      }
      
      showToast('评论已删除', 'success'); 

    } catch (error: any) {
      console.error("删除评论失败:", error);
      // 3. 替换 alert
      showToast(error.message || '删除评论失败', 'error');
    }
  };

  const handleCommentDeleted = async (commentId: string) => {
    setConfirm({
      isOpen: true,
      title: '删除评论',
      children: '您确定要删除这条评论吗？',
      onConfirm: () => performDeleteComment(commentId),
      confirmText: '删除',
      confirmColor: 'danger',
    });
  };

  const handleCommentUpdated = async (commentId: string, content: string) => {
    try {
      await apiUpdateComment({ id: commentId, content });
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, content } : c)
      );
    } catch (error: any) {
      console.error("更新评论失败:", error);
      // 替换 alert
      showToast(error.message || '更新评论失败', 'error');
    }
  };

  
  const handleReplyDeleted = (commentId: string) => {
    setComments(prev => 
      prev.map(c => 
        c.id === commentId 
        ? { ...c, replyCount: Math.max(0, (c.replyCount || 0) - 1) } 
        : c
      )
    );
    if (post) {
      setPost({ ...post, commentCount: Math.max(0, post.commentCount - 1) });
    }
  };
  // ========= End of Handlers =========

  if (isLoading) return <div style={styles.centerMessage}>加载中...</div>;
  if (error) return <div style={{...styles.centerMessage, color: 'red'}}>{error}</div>;
  if (!post) return <div style={styles.centerMessage}>帖子不存在或已被删除</div>;

  return (
    <PostPageProvider value={{ setConfirm: setConfirm as ConfirmSetter }}>
      <>
        <main style={styles.mainContent}>
          <PostContent 
            post={post}
            isLoggedIn={isLoggedIn}
            onUserMouseEnter={handleMouseEnterForPost}
            onUserMouseLeave={handleMouseLeave}
          />
          <CommentSection 
            postId={post.id}
            comments={comments} 
            totalCommentCount={post.commentCount} 
            onNewCommentAdded={handleNewCommentAdded}
            onReplyAdded={handleReplyAdded}
            onCommentAuthorMouseEnter={handleMouseEnterForComment}
            onReplyAuthorMouseEnter={handleMouseEnterForReply}
            onUserMouseLeave={handleMouseLeave}
            onCommentDeleted={handleCommentDeleted}
            onCommentUpdated={handleCommentUpdated}
            onReplyDeleted={handleReplyDeleted}
            // ★ 5. 不再需要传递 currentUser, showToast 和 setConfirm ★
          />
        </main>

      {isCardVisible && (
        <UserPreviewCard
          data={previewData}
          isLoading={isPreviewLoading}
          position={cardPosition}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleMouseLeave}
          currentUserId={currentUser?.id} 
        />
      )}
      <Alert
        isOpen={confirm.isOpen}
        title={confirm.title}
        onClose={closeConfirm}
        onConfirm={confirm.onConfirm}
        confirmText={confirm.confirmText}
        cancelText="取消"
        confirmColor={confirm.confirmColor}
      >
        {confirm.children}
      </Alert>
    </>
  </PostPageProvider>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mainContent: { maxWidth: '800px', margin: '20px auto', position: 'relative' },
  centerMessage: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
};

export default PostDetailPage;