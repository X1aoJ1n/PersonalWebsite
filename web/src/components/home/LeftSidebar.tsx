// src/components/LeftSidebar.tsx
import React, { useState } from 'react';

type FeedType = 'latest' | 'favorite' | 'following';

interface LeftSidebarProps {
  activeFeed: FeedType;
  onFeedChange: (feedType: FeedType) => void;
  isLoggedIn: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeFeed, onFeedChange }) => {
  
  const [hoveredTab, setHoveredTab] = useState<FeedType | null>(null);

  const handleFollowingClick = () => {
    onFeedChange('following');
  };

  return (
    <div style={styles.container}>
      {/* 热门帖子 Tab (不变) */}
      <div
        style={{ 
          ...styles.tab, 
          ...(hoveredTab === 'favorite' ? styles.tabHover : {}),
          ...(activeFeed === 'favorite' ? styles.activeTab : {}) 
        }}
        onClick={() => onFeedChange('favorite')}
        onMouseEnter={() => setHoveredTab('favorite')}
        onMouseLeave={() => setHoveredTab(null)}
      >
        热门帖子
      </div>
      
      {/* 最新帖子 Tab (不变) */}
      <div
        style={{ 
          ...styles.tab, 
          ...(hoveredTab === 'latest' ? styles.tabHover : {}),
          ...(activeFeed === 'latest' ? styles.activeTab : {})
        }}
        onClick={() => onFeedChange('latest')}
        onMouseEnter={() => setHoveredTab('latest')}
        onMouseLeave={() => setHoveredTab(null)}
      >
        最新帖子
      </div>
    
      {/* 我的关注 Tab (onClick 已更新) */}
      <div
        style={{ 
          ...styles.tab, 
          ...(hoveredTab === 'following' ? styles.tabHover : {}),
          ...(activeFeed === 'following' ? styles.activeTab : {}) 
        }}
        onClick={handleFollowingClick} // ★ 修正 ★：使用新的 handler
        onMouseEnter={() => setHoveredTab('following')}
        onMouseLeave={() => setHoveredTab(null)}
      >
        我的关注
      </div>
    </div>
  );
};

// ... 样式 (styles) 对象保持不变 ...
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '180px',
    backgroundColor: '#fff',
    padding: '10px',
    height: 'fit-content', 
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  tab: {
    margin: 0,
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s, color 0.2s',
  },
  tabHover: {
    backgroundColor: '#eef2ff',
    color: '#4338ca',
  },
  activeTab: {
    backgroundColor: '#4f46e5',
    color: '#ffffffff',
  },
};

export default LeftSidebar;