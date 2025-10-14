// src/components/LeftSidebar.tsx
import React, { useState } from 'react'; // 1. 引入 useState

type FeedType = 'latest' | 'favorite' | 'following';

interface LeftSidebarProps {
  activeFeed: FeedType;
  onFeedChange: (feedType: FeedType) => void;
  isLoggedIn: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeFeed, onFeedChange, isLoggedIn }) => {
  
  // 2. 新增一个 state 来追踪当前悬浮的 Tab
  const [hoveredTab, setHoveredTab] = useState<FeedType | null>(null);

  const handleFollowingClick = () => {
    if (isLoggedIn) {
      onFeedChange('following');
    } else {
      alert('请先登录后查看关注内容！');
    }
  };

  return (
    <div style={styles.container}><div
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
      </div><div
        style={{ 
          ...styles.tab, 
          ...(hoveredTab === 'latest' ? styles.tabHover : {}), // 应用悬浮样式
          ...(activeFeed === 'latest' ? styles.activeTab : {})  // 激活样式会覆盖悬浮样式
        }}
        onClick={() => onFeedChange('latest')}
        onMouseEnter={() => setHoveredTab('latest')}
        onMouseLeave={() => setHoveredTab(null)}
      >
        最新帖子
      </div>
    
      <div
        style={{ 
          ...styles.tab, 
          ...(hoveredTab === 'following' ? styles.tabHover : {}),
          ...(activeFeed === 'following' ? styles.activeTab : {}) 
        }}
        onClick={handleFollowingClick}
        onMouseEnter={() => setHoveredTab('following')}
        onMouseLeave={() => setHoveredTab(null)}
      >
        我的关注
      </div></div>
  );
};

// 4. 在 styles 对象中新增 tabHover 样式
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
  // --- 新增样式 ---
  tabHover: {
    backgroundColor: '#eef2ff', // 一个漂亮的浅靛蓝色
    color: '#4338ca', // 搭配的深靛蓝色字体
  },
  // --- 结束 ---
  activeTab: {
    backgroundColor: '#4f46e5',
    color: '#ffffffff',
  },
};

export default LeftSidebar;