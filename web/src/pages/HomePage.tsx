// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
// ★ 修正 ★：导入 Link 组件
import { useOutletContext, Link } from 'react-router-dom'; 
import type { OutletContextType } from '@/layouts/RootLayout';

import { getVisiblePost, getFollowPost, getFavoritePost } from '@/api/post';
import type { SimplePostData } from '@/models';

import LeftSidebar from '@/components/home/LeftSidebar';
import PostCard from '@/components/home/PostCard';
import RightSidebar from '@/components/home/RightSidebar';

const POSTS_PER_PAGE = 5;

const HomePage: React.FC = () => {
  const { currentUser } = useOutletContext<OutletContextType>();

  const [posts, setPosts] = useState<SimplePostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFeed, setActiveFeed] = useState<'favorite' | 'latest' | 'following'>('favorite');
  
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  // ... useEffect 和 handleLoadMore 逻辑保持不变 ...
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setIsLoading(true);
      setError(null);
      setHasMore(true);
      
      const pageQuery = { pageNum: 1, pageSize: POSTS_PER_PAGE };
      try {
        let res;
        if (activeFeed === 'latest') {
          res = await getVisiblePost(pageQuery);
        } else if (activeFeed === 'favorite') {
          res = await getFavoritePost(pageQuery);
        } else { // following
          if (!currentUser) {
            // ★ 修正 ★：
            // 即使用户未登录，我们也允许切换到此 Tab。
            // 在这里设置空帖子并返回，渲染逻辑将处理提示。
            setPosts([]);
            setIsLoading(false);
            setHasMore(false); // 没有更多内容可加载
            return;
          }
          res = await getFollowPost(pageQuery);
        }

        if (res.code === 200 && res.data) {
          setPosts(res.data);
          setCurrentPageNum(2);
          if (res.data.length < POSTS_PER_PAGE) {
            setHasMore(false);
          }
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
    fetchInitialPosts();
  }, [activeFeed, currentUser]);

  const handleLoadMore = async () => {
    if (isLoadMoreLoading || !hasMore) return;
    setIsLoadMoreLoading(true);
    setError(null);
    
    const pageQuery = { pageNum: currentPageNum, pageSize: POSTS_PER_PAGE };
    try {
      let res;
      // 4. 同样更新 handleLoadMore 的逻辑
      if (activeFeed === 'latest') {
        res = await getVisiblePost(pageQuery);
      } else if (activeFeed === 'favorite') {
        res = await getFavoritePost(pageQuery);
      } else { // 'following'
        if (!currentUser) return; 
        res = await getFollowPost(pageQuery);
      }

      if (res.code === 200 && res.data) {
        setPosts(prevPosts => [...prevPosts, ...res.data]);
        setCurrentPageNum(prevPage => prevPage + 1);
        if (res.data.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        throw new Error(res.message || '获取更多帖子失败');
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoadMoreLoading(false);
    }
  };

  const isLoggedIn = !!currentUser;
  
  const titleMap = {
    latest: '最新帖子',
    favorite: '热门帖子',
    following: '我的关注',
  };
  const headerPost = { title: titleMap[activeFeed] };

  return (
    <main style={styles.mainContent}>
      <div style={styles.leftSidebarWrapper}>
        <LeftSidebar activeFeed={activeFeed} onFeedChange={setActiveFeed} isLoggedIn={isLoggedIn} />
      </div>
      <section style={styles.postListContainer}>
        <PostCard post={headerPost} variant="header" />
        
        {isLoading && <p style={{textAlign: 'center', padding: '20px'}}>加载中...</p>}
        {!isLoading && error && <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>}
        {!isLoading && posts.length > 0 && posts.map(post => <PostCard key={post.id} post={post} />)}
        
        {/* ★ 修正 ★：更新空状态的渲染逻辑 */}
        {!isLoading && posts.length === 0 && (
          <div style={styles.emptyState}>
            {activeFeed === 'following' && !isLoggedIn ? (
              // 当在"我的关注" Tab 且未登录时，显示这个
              <span style={styles.emptyStateText}>
                请先 <Link to="/auth" style={styles.loginLink}>登录</Link> 查看关注内容
              </span>
            ) : (
              // 其他情况的空状态
              <span style={styles.emptyStateText}>
                这里什么都没有哦～
              </span>
            )}
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div style={styles.loadMoreContainer}>
            {hasMore ? (
              <button onClick={handleLoadMore} disabled={isLoadMoreLoading} style={styles.loadMoreButton}>
                {isLoadMoreLoading ? '加载中...' : '加载更多'}
              </button>
            ) : (
              <p style={styles.noMoreText}>没有更多内容了</p>
            )}
          </div>
        )}
      </section>
      <div style={styles.rightSidebarWrapper}>
        <RightSidebar isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  emptyStateText: { // (推荐) 包装一下文本，确保行高和颜色一致
    color: '#999',
    fontSize: '16px',
    lineHeight: 1.5,
  },
  loginLink: { // (新增) Link 样式
    color: '#4f46e5',
    textDecoration: 'underline',
    fontWeight: '500',
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
  },
  loadMoreButton: {
    padding: '10px 25px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  noMoreText: {
    color: '#999',
    fontSize: '14px',
  },
};

export default HomePage;