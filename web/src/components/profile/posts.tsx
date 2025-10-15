import React from 'react';
import { Link } from 'react-router-dom';
import type { SimplePostData } from '@/models';
// I noticed your original Posts.tsx used a PostCard from home, let's keep it consistent.
// If you have a separate one, adjust the path.
import PostCard from '@/components/home/PostCard';

interface PostsProps {
  posts: SimplePostData[];
  isOwnProfile: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

const Posts: React.FC<PostsProps> = ({ posts, isOwnProfile, hasMore, isLoadingMore, onLoadMore }) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>动态</h3>
        {isOwnProfile && (
          <Link to="/post/create" style={styles.createButton}>
            开始创作
          </Link>
        )}
      </div>
      <div style={styles.postList}>
        {posts.length > 0 ? (
          posts.map(post => <PostCard post={post} key={post.id} />)
        ) : (
          <p style={styles.emptyMessage}>这里还没有任何动态，快去发布第一篇吧！</p>
        )}
      </div>

      {/* --- ADD THIS SECTION for the "Load More" button --- */}
      {posts.length > 0 && (
        <div style={styles.loadMoreContainer}>
          {hasMore ? (
            <button onClick={onLoadMore} disabled={isLoadingMore} style={styles.loadMoreButton}>
              {isLoadingMore ? '加载中...' : '加载更多'}
            </button>
          ) : (
            <p style={styles.noMoreText}>没有更多内容了</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  card: { 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    padding: '15px 20px 20px', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' 
  },
  cardHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: '1px solid #f0f0f0', 
    paddingBottom: '10px', 
    marginBottom: '15px' 
  },
  cardTitle: { 
    margin: 0, 
    fontSize: '18px' 
  },
  createButton: {
    padding: '6px 14px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  postList: {
    // No margin top, let the header handle it
  },
  emptyMessage: {
    color: '#666',
    textAlign: 'center',
    padding: '20px 0',
  },
  // --- ADD THESE STYLES copied from HomePage for consistency ---
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0 10px',
    borderTop: '1px solid #f0f0f0',
    marginTop: '20px'
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
    margin: 0
  },
};

export default Posts;