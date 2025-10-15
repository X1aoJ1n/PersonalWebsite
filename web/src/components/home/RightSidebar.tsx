import React, { useState, useEffect } from 'react';
// 更改: 引入 useOutletContext
import { Link, useOutletContext } from 'react-router-dom';

// 1. 引入 API 函数和更新后的数据类型
import { getRecentViewPost, getRecentViewUser } from '@/api/recentView';
// 将 UserPreviewData 替换为 SimpleUserVO
// 更改: 引入 OutletContextType, useUserPreview hook, 和 UserPreviewCard 组件
import type { SimplePostData, SimpleUserVO } from '@/models';
import type { OutletContextType } from '@/layouts/RootLayout';
import { useUserPreview } from '@/hooks/useUserPreview';
import UserPreviewCard from '@/components/common/UserPreviewCard';

interface RightSidebarProps {
  isLoggedIn: boolean;
}

const formatDisplayDate = (updatedAt: string, createdAt: string): string => {
  const dateToShow = new Date(updatedAt || createdAt);
  return dateToShow.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

const POSTS_PER_MODULE = 3;
const USERS_PER_MODULE = 5;

const RightSidebar: React.FC<RightSidebarProps> = ({ isLoggedIn }) => {
  // 更改: 获取当前登录用户
  const { currentUser } = useOutletContext<OutletContextType>();

  // 更改: 调用 useUserPreview hook 并解构所需的状态和函数
  const {
    isCardVisible,
    isLoading: isPreviewLoading, // 重命名以避免冲突
    previewData,
    cardPosition,
    handleMouseEnterForPost, // 为用户列表项选择一个合适的定位策略
    handleMouseLeave,
    handleCardMouseEnter,
    handleCardMouseLeave,
  } = useUserPreview();

  const [isHovered, setIsHovered] = useState(false);
  
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  const [recentPosts, setRecentPosts] = useState<SimplePostData[]>([]);
  const [recentUsers, setRecentUsers] = useState<SimpleUserVO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const fetchRecentData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postRes, userRes] = await Promise.all([
          getRecentViewPost({ pageNum: 1, pageSize: POSTS_PER_MODULE }),
          getRecentViewUser({ pageNum: 1, pageSize: USERS_PER_MODULE })
        ]);

        if (postRes.code === 200 && postRes.data) {
          setRecentPosts(postRes.data);
        } else {
          throw new Error('获取最近浏览帖子失败');
        }

        if (userRes.code === 200 && userRes.data) {
          setRecentUsers(userRes.data);
        } else {
          throw new Error('获取最近浏览用户失败');
        }

      } catch (err: any) {
        setError(err.message || '加载侧边栏数据失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentData();
  }, [isLoggedIn]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '上午好！';
    if (hour < 18) return '下午好！';
    return '晚上好！';
  };

  const buttonStyle = {
    ...styles.createButton,
    ...(isHovered ? styles.createButtonHover : {}),
  };

  const renderModuleContent = (
    data: any[], 
    renderItem: (item: any) => React.ReactNode, 
    emptyMessage: string = '暂无浏览记录'
  ) => {
    if (isLoading) {
      return <div style={styles.placeholder}>加载中...</div>;
    }
    if (error) {
      return <div style={{...styles.placeholder, color: 'red'}}>加载失败</div>;
    }
    if (data.length === 0) {
      return <div style={styles.placeholder}>{emptyMessage}</div>;
    }
    return <div>{data.map(renderItem)}</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.greetingCard}>
        <h4 style={styles.greetingTitle}>{getGreeting()}</h4>
        <p style={styles.greetingText}>暖你一整天</p>
        <Link 
          to={isLoggedIn ? "/post/create" : "/auth"} 
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          开始创作 🚀
        </Link>
      </div>

      <div style={styles.rightModule}>
        <h5 style={styles.rightModuleTitle}>最近浏览帖子</h5>
        {isLoggedIn ? (
          renderModuleContent(recentPosts, (post: SimplePostData) => (
            <Link 
              key={post.id} 
              to={`/post/${post.id}`} 
              style={{
                ...styles.postLink,
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
          ))
        ) : (
          <div style={styles.placeholder}>请登录后查看</div>
        )}
      </div>

      <div style={styles.rightModule}>
        <h5 style={styles.rightModuleTitle}>最近浏览用户</h5>
        {isLoggedIn ? (
          renderModuleContent(recentUsers, (user: SimpleUserVO) => (
            <Link 
              key={user.id} 
              to={`/profile/${user.id}`} 
              style={{
                ...styles.userLink, 
                ...styles.userItem,
                ...(hoveredUserId === user.id && styles.itemHover) // 这个高亮逻辑依然有效
              }}
              // 更改: 合并两个 onMouseEnter 的功能
              onMouseEnter={(e:React.MouseEvent) => {
                setHoveredUserId(user.id); // 立即设置背景高亮
                handleMouseEnterForPost(e, user.id, e.currentTarget as HTMLElement); // 触发悬浮卡片
              }}
              // 更改: 合并两个 onMouseLeave 的功能
              onMouseLeave={() => {
                setHoveredUserId(null); // 立即移除背景高亮
                handleMouseLeave(); // 触发隐藏悬浮卡片
              }}
            >
              <img src={user.icon || '/default-avatar.png'} alt={user.username} style={styles.userAvatar} />
              <span style={styles.userName}>{user.username}</span>
            </Link>
          ))
        ) : (
          <div style={styles.placeholder}>请登录后查看</div>
        )}
      </div>
      
      {/* 更改: 在组件根部渲染悬浮卡片 */}
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
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { width: '100%' },
  greetingCard: { 
    backgroundColor: '#fff', 
    padding: '20px', 
    marginBottom: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  greetingTitle: { 
    margin: '0 0 8px 0', 
  },
  greetingText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 15px 0', 
  },
  createButton: {
    display: 'block',
    width: '100%',
    padding: '10px 0',
    textAlign: 'center',
    backgroundColor: '#4f46e5',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.2s',
  },
  createButtonHover: {
    opacity: 0.9,
  },
  rightModule: { 
    backgroundColor: '#fff', 
    padding: '20px', 
    marginBottom: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' 
  },
  rightModuleTitle: { 
    margin: '0 0 15px 0', 
    borderBottom: '1px solid #f0f0f0', 
    paddingBottom: '10px', 
    fontSize: '15px' 
  },
  placeholder: { 
    color: '#aaa', 
    textAlign: 'center', 
    padding: '20px 0', 
    fontSize: '14px' 
  },
  itemHover: {
    backgroundColor: '#f9f9f9',
  },
  userLink: { 
    display: 'block', 
    textDecoration: 'none', 
    color: '#333', 
    transition: 'background-color 0.2s', 
    borderRadius: '4px', 
    padding: '8px 5px', 
    margin: '0 -5px' 
  },
  userItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px' 
  },
  userAvatar: { 
    width: '36px', 
    height: '36px', 
    borderRadius: '50%', 
    objectFit: 'cover' 
  },
  userName: { 
    fontWeight: 500, 
    fontSize: '13px', 
    color: '#555', 
    textAlign: 'center' 
  },
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
};

export default RightSidebar;