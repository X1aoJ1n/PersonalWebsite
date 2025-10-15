import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getPostDetail } from '@/api/post';
import { getCommentsByPostId, deleteComment as apiDeleteComment, updateComment as apiUpdateComment } from '@/api/comment';
// ========= 1. Added missing API and type imports =========
import type { PostData, CommentData } from '@/models';
import type { OutletContextType } from '@/layouts/RootLayout';
import PostContent from '@/components/post/PostContent';
import CommentSection from '@/components/post/CommentSection';
import { useUserPreview } from '@/hooks/useUserPreview';
import UserPreviewCard from '@/components/common/UserPreviewCard';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useOutletContext<OutletContextType>();

  const isLoggedIn = !!currentUser;



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
  
  // ========= Logic for adding new comments and replies =========
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

  // ========= Handlers for Deleting and Updating Comments/Replies =========
  const handleCommentDeleted = async (commentId: string) => {
    if (window.confirm('确定要删除这条评论吗？')) {
      try {
        // 1. API 调用保持不变，后端负责将数据库中的 status 设为 1
        await apiDeleteComment(commentId); 

        // 2. 前端状态更新：使用 map 找到对应评论并更新其 status
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === commentId) {
              // 返回一个更新了 status 的新评论对象
              return { ...comment, status: 1 };
            }
            return comment; // 其他评论保持不变
          })
        );

        // 3. (可选) 更新帖子总评论数。
        // 如果软删除也意味着总数减少，保留这部分逻辑。
        // 如果不减少，可以注释掉这部分。
        const commentToDelete = comments.find(c => c.id === commentId);
        if (post && commentToDelete) {
          // 注意：软删除后，回复依然存在，所以这里只减 1
          setPost({ ...post, commentCount: post.commentCount - 1 });
        }

      } catch (error: any) {
        console.error("删除评论失败:", error);
        alert(error.message || '删除评论失败');
      }
    }
  };

  const handleCommentUpdated = async (commentId: string, content: string) => {
    try {
      await apiUpdateComment({ id: commentId, content });
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, content } : c)
      );
    } catch (error: any) {
      console.error("更新评论失败:", error);
      alert(error.message || '更新评论失败');
    }
  };

  // This handler only updates counts. The actual API call and UI update
  // for the replies list happens in the CommentItem component.
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
    <>
      <main style={styles.mainContent}>
        <PostContent 
        post={post}
        isLoggedIn={isLoggedIn} // 3. Pass the prop down
        onUserMouseEnter={handleMouseEnterForPost}
        onUserMouseLeave={handleMouseLeave}
      />
        {/* Pass the new props down to the CommentSection */}
        <CommentSection 
          postId={post.id}
          comments={comments} 
          totalCommentCount={post.commentCount} 
          currentUser={currentUser}
          onNewCommentAdded={handleNewCommentAdded}
          onReplyAdded={handleReplyAdded}
          onCommentAuthorMouseEnter={handleMouseEnterForComment}
          onReplyAuthorMouseEnter={handleMouseEnterForReply}
          onUserMouseLeave={handleMouseLeave}
          onCommentDeleted={handleCommentDeleted}
          onCommentUpdated={handleCommentUpdated}
          onReplyDeleted={handleReplyDeleted}
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
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mainContent: { maxWidth: '800px', margin: '20px auto', position: 'relative' },
  centerMessage: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
};

export default PostDetailPage;