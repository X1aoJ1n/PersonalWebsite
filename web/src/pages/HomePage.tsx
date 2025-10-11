// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout';

// 1. 引入 getFavoritePost
import { getVisiblePost, getFollowPost, getFavoritePost } from '@/api/post';
import type { SimplePostData } from '@/models';

import LeftSidebar from '@/components/LeftSidebar';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';

const POSTS_PER_PAGE = 5;

const HomePage: React.FC = () => {
  const { currentUser } = useOutletContext<OutletContextType>();

  const [posts, setPosts] = useState<SimplePostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. 更新 activeFeed 的类型和初始值
  const [activeFeed, setActiveFeed] = useState<'latest' | 'favorite' | 'following'>('latest');
  
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  useEffect(() => {
    // 切换 Tab 时，重置分页并获取第一页数据
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
          setPosts([]);
          setIsLoading(false);
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
  
  // 5. 使用一个 map 来动态设置标题，更清晰
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
        {!isLoading && posts.length === 0 && (
          <div style={styles.emptyState}>
            {activeFeed === 'following' && !isLoggedIn ? '请登录后查看关注内容' : '这里什么都没有哦～'}
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

// ... (styles 对象保持不变)
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
    color: '#999',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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