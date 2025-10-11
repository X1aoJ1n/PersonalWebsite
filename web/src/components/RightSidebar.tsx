// src/components/RightSidebar.tsx
import React, { useState } from 'react'; // 1. Import useState
import { Link } from 'react-router-dom';

interface RightSidebarProps {
  isLoggedIn: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isLoggedIn }) => {
  // 2. Add state to track button hover
  const [isHovered, setIsHovered] = useState(false);

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


  return (
    <div style={styles.container}>
      {/* ... (问候语卡片保持不变) ... */}
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
        {/* TODO: 实现最近浏览帖子功能，可以从 localStorage 读取数据 */}
        {isLoggedIn ? (
          <div style={styles.placeholder}>功能开发中...</div>
        ) : (
          <div style={styles.placeholder}>请登录后查看</div>
        )}
      </div>
      <div style={styles.rightModule}>
        <h5 style={styles.rightModuleTitle}>最近浏览用户</h5>
        {/* TODO: 实现最近浏览用户功能，同样可以利用 localStorage */}
        {isLoggedIn ? (
          <div style={styles.placeholder}>功能开发中...</div>
        ) : (
          <div style={styles.placeholder}>请登录后查看</div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
  },
  greetingCard: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  greetingTitle: { 
    margin: '0 0 8px 0', 
  },
  greetingText: {
    marginBottom: '15px', 
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
  // --- New Style Added ---
  createButtonHover: {
    opacity: 0.9,
  },
  // --- End of New Style ---
  rightModule: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  rightModuleTitle: {
    margin: '0 0 15px 0',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '10px',
  },
  placeholder: {
    color: '#aaa',
    textAlign: 'center',
    padding: '20px 0',
  },
};


export default RightSidebar;