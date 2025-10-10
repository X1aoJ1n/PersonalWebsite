// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom'; // 确保引入 useOutletContext
import type { OutletContextType } from '@/layouts/RootLayout'; // 引入共享的 context 类型

// API 和类型定义
import { getVisiblePost, getFollowPost } from '@/api/post';
import type { SimplePostData } from '@/models';

// 引入子组件
import LeftSidebar from '@/components/LeftSidebar';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';

// 移除了 HomePageProps 定义
const HomePage: React.FC = () => { // 移除了 props
  // 通过 useOutletContext hook 从 RootLayout 获取共享状态
  const { currentUser } = useOutletContext<OutletContextType>();

  // --- 在这里增加一行日志 ---
  console.log('--- [HomePage] 接收到的 currentUser:', currentUser, '---');

  const [posts, setPosts] = useState<SimplePostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFeed, setActiveFeed] = useState<'recommended' | 'following'>('recommended');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      setPosts([]);
      try {
        let res;
        const pageQuery = { current: 1, pageSize: 20 };
        if (activeFeed === 'recommended') {
          res = await getVisiblePost(pageQuery);
        } else {
          if (!currentUser) { // 这里的 currentUser 来自 context
            setIsLoading(false);
            return;
          }
          res = await getFollowPost(pageQuery);
        }
        if (res.code === 200 && res.data) {
          setPosts(res.data);
        } else {
          throw new Error(res.message || '获取帖子失败');
        }
      } catch (err: any) {
        setError(err.message || '数据加载失败，请稍后再试。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // 依赖项中的 currentUser 同样来自 context
    if (activeFeed === 'recommended' || (activeFeed === 'following' && currentUser)) {
      fetchPosts();
    } else {
      setIsLoading(false);
    }
  }, [activeFeed, currentUser]);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      console.log('开始搜索:', searchTerm);
      alert(`正在搜索: ${searchTerm}\n(搜索接口待实现)`);
    }
  };

  const isLoggedIn = !!currentUser; // 基于 context 的 currentUser 判断登录状态
  const headerPost = { title: activeFeed === 'recommended' ? '最新帖子' : '我的关注' };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <Link to="/" style={styles.logoLink}>
              <img src="/logo.png" alt="Logo" style={styles.logo} />
              <span style={styles.siteName}>Better Call XiaoJin</span>
            </Link>
            <nav style={styles.nav}>
              <Link to="/recommend-user" style={styles.navLink}>用户推荐</Link>
              <Link to="/ai-agents" style={styles.navLink}>智能体中心</Link>
              <Link to="/notifications" style={styles.navLink}>消息通知</Link>
            </nav>
          </div>
          <div style={styles.headerSearch}>
            <input
              type="text"
              placeholder="搜索帖子..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div style={styles.headerRight}>
            {currentUser ? (
              <Link to={`/profile`} style={styles.userProfile}>
                <img src={currentUser.icon || '/default-avatar.png'} alt={currentUser.username} style={styles.avatar} />
                <span>{currentUser.username}</span>
              </Link>
            ) : (
              <Link to="/auth" style={styles.authLink}>注册 / 登录</Link>
            )}
          </div>
        </div>
      </header>
      <main style={styles.mainContent}>
        <div style={styles.leftSidebarWrapper}>
          <LeftSidebar activeFeed={activeFeed} onFeedChange={setActiveFeed} isLoggedIn={isLoggedIn} />
        </div>
        <section style={styles.postListContainer}>
          <PostCard post={headerPost} variant="header" />
          {isLoading && <p style={{textAlign: 'center', padding: '20px'}}>加载中...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>}
          {!isLoading && !error && posts.length > 0 && posts.map(post => <PostCard key={post.id} post={post} />)}
          {!isLoading && !error && posts.length === 0 && (
            <div style={styles.emptyState}>
              {activeFeed === 'following' && !isLoggedIn ? '请登录后查看关注内容' : '这里什么都没有哦～'}
            </div>
          )}
        </section>
        <div style={styles.rightSidebarWrapper}>
          <RightSidebar isLoggedIn={isLoggedIn} />
        </div>
      </main>
    </div>
  );
};

// ... (styles 对象保持不变)
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: '#f4f5f5',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '60px',
    width: '100%',
    maxWidth: '1200px',
    gap: '20px', 
  },
  headerLeft: { 
    display: 'flex', 
    alignItems: 'center',
    flexShrink: 0, 
  },
  logoLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#333' },
  logo: { height: '32px', marginRight: '12px' },
  siteName: { fontSize: '20px', fontWeight: 'bold',color: '#4f46e5' },
  nav: { marginLeft: '40px' },
  navLink: { margin: '0 15px', textDecoration: 'none', color: '#555', fontSize: '16px', fontWeight: 500 },

  headerSearch: {
    flexGrow: 1, 
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px', 
    padding: '8px 15px',
    border: '1px solid #ccc',
    borderRadius: '20px', 
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  headerRight: {
    flexShrink: 0, 
  },
  authLink: { 
    padding: '8px 16px', 
    backgroundColor: '#4f46e5', 
    color: '#fff', 
    borderRadius: '6px', 
    textDecoration: 'none' 
  },
    userProfile: { display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none', color: 'inherit' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' },
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between', 
    padding: '20px 0',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '20px', 
  },
  leftSidebarWrapper: {
    flexBasis: '180px', 
    flexShrink: 0,
  },
  postListContainer: {
    flexGrow: 1,      
    minWidth: 0,      
  },
  rightSidebarWrapper: {
    flexBasis: '300px', 
    flexShrink: 0,
  },
  emptyState: {
      backgroundColor: '#fff',
      padding: '40px',
      textAlign: 'center',
      color: '#999',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  }
};

export default HomePage;