import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import type { SimplePostData, SimpleUserVO } from '@/models';

// 引入预览卡片相关的 hook 和组件
import type { OutletContextType } from '@/layouts/RootLayout';
import { useUserPreview } from '@/hooks/useUserPreview';
import UserPreviewCard from '@/components/common/UserPreviewCard';

interface RecentViewsProps {
  isLoading: boolean;
  posts: SimplePostData[];
  users: SimpleUserVO[];
}

// 1. 复制日期格式化函数
const formatDisplayDate = (updatedAt: string, createdAt: string): string => {
  const dateToShow = new Date(updatedAt || createdAt);
  return dateToShow.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

const RecentViews: React.FC<RecentViewsProps> = ({ isLoading, posts, users }) => {
  const { currentUser } = useOutletContext<OutletContextType>();

  const {
    isCardVisible,
    isLoading: isPreviewLoading,
    previewData,
    cardPosition,
    handleMouseEnterForPost,
    handleMouseLeave,
    handleCardMouseEnter,
    handleCardMouseLeave,
  } = useUserPreview();
  
  // 2. 添加 state 用于控制帖子和用户的背景高亮
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div style={styles.card}>
        <div style={styles.centerMessage}>加载中...</div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.card}>
        <div style={styles.recentViewContainer}>
          {/* 左栏：最近浏览帖子 */}
          <div style={styles.recentViewColumn}>
            <h3 style={styles.recentViewSectionTitle}>最近浏览帖子</h3>
            {posts.length > 0 ? posts.map(post => (
              // 3. 更新帖子的 JSX 结构，使其与 RightSidebar 一致
              <Link 
                key={post.id} 
                to={`/post/${post.id}`} 
                style={{
                  ...styles.postLink, // 使用新的样式名
                  ...(hoveredPostId === post.id && styles.itemHover)
                }}
                onMouseEnter={() => setHoveredPostId(post.id)}
                onMouseLeave={() => setHoveredPostId(null)}
              >
                <div style={styles.postItemContainer}>
                  <div style={styles.postHeader}>
                    <h6 style={styles.postTitle}>{post.title}</h6>
                    <div style={styles.postAuthor}>
                      <img src={post.userVO.icon || '/default-avatar.png'} alt={post.userVO.username} style={styles.postAuthorAvatar} />
                      <span style={styles.postAuthorName}>{post.userVO.username}</span>
                    </div>
                  </div>
                  <p style={styles.postPreview}>{post.preview || '暂无内容预览...'}</p>
                  <div style={styles.postMeta}>
                    <div style={styles.postStats}>
                      <span>❤️ {post.likeCount}</span>
                      <span>💬 {post.commentCount}</span>
                    </div>
                    <span style={styles.postDate}>{formatDisplayDate(post.updatedAt, post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            )) : <p style={styles.emptyText}>暂无帖子浏览记录</p>}
          </div>

          {/* 右栏：最近浏览用户 (保持不变) */}
          <div style={styles.recentViewColumn}>
            <h3 style={styles.recentViewSectionTitle}>最近浏览用户</h3>
            {users.length > 0 ? users.map(user => (
              <Link 
                key={user.id} 
                to={`/profile/${user.id}`} 
                style={{
                  ...styles.recentUserItem,
                  ...(hoveredUserId === user.id && styles.itemHover)
                }}
                onMouseEnter={(e:React.MouseEvent) => {
                  setHoveredUserId(user.id);
                  handleMouseEnterForPost(e, user.id, e.currentTarget as HTMLElement);
                }}
                onMouseLeave={() => {
                  setHoveredUserId(null);
                  handleMouseLeave();
                }}
              >
                <img src={user.icon || '/default-avatar.png'} alt={user.username} style={styles.recentUserAvatar} />
                <span>{user.username}</span>
              </Link>
            )) : <p style={styles.emptyText}>暂无用户浏览记录</p>}
          </div>
        </div>
      </div>
      
      {isCardVisible && (
        <UserPreviewCard
          data={previewData}
          isLoading={isPreviewLoading}
          position={cardPosition}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          currentUserId={currentUser?.id}
        />
      )}
    </>
  );
};

// --- Styles ---
// 4. 更新整个 styles 对象，以包含所有需要的样式
const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '15px 20px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    centerMessage: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
    recentViewContainer: {
        display: 'flex',
        gap: '30px',
    },
    recentViewColumn: {
        flex: 1,
        minWidth: 0,
    },
    recentViewSectionTitle: {
        margin: '0 0 15px 0',
        paddingBottom: '10px',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '16px',
        fontWeight: 600,
    },
    emptyText: {
        fontSize: '14px',
        color: '#999',
        padding: '20px 0',
    },
    itemHover: {
        backgroundColor: '#f9f9f9',
    },
    // --- 帖子样式 ---
    postLink: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        transition: 'background-color 0.2s',
        borderRadius: '4px',
        margin: '0 -5px',
        padding: '0 5px',
    },
    postItemContainer: {
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    postHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
    },
    postTitle: {
        flexGrow: 1,
        minWidth: 0,
        margin: 0,
        fontSize: '15px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    postAuthor: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
    },
    postAuthorAvatar: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    postAuthorName: {
        fontSize: '12px',
        color: '#666',
        fontWeight: 400,
    },
    postPreview: {
        margin: '0 0 10px 0',
        fontSize: '13px',
        color: '#777',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    postMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#888',
    },
    postStats: {
        display: 'flex',
        gap: '12px',
    },
    postDate: {},
    // --- 用户样式 ---
    recentUserItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 5px',
        textDecoration: 'none',
        color: 'inherit',
        fontSize: '14px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    recentUserAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
};

export default RecentViews;