// src/components/LeftSidebar.tsx
import React from 'react';

type FeedType = 'recommended' | 'following';

interface LeftSidebarProps {
  activeFeed: FeedType;
  onFeedChange: (feedType: FeedType) => void;
  isLoggedIn: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeFeed, onFeedChange, isLoggedIn }) => {
  
  const handleFollowingClick = () => {
    if (isLoggedIn) {
      onFeedChange('following');
    } else {
      alert('请先登录后查看关注内容！');
    }
  };

  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.tab, ...(activeFeed === 'recommended' ? styles.activeTab : {}) }}
        onClick={() => onFeedChange('recommended')}
      >
        推荐
      </div>
      <div
        style={{ ...styles.tab, ...(activeFeed === 'following' ? styles.activeTab : {}) }}
        onClick={handleFollowingClick}
      >
        关注
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '180px',
    backgroundColor: '#fff',
    padding: '10px',
    height: 'fit-content', 
    // --- 新增/修改的样式 ---
    borderRadius: '8px', // 圆角
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // 阴影
    // --- 结束 ---
  },
  tab: {
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#4f46e5',
    color: '#ffffffff',
  },
};

export default LeftSidebar;