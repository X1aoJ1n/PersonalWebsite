import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UserData } from '@/models';
// 1. 恢复使用 react-icons/io5 库
import { IoSearchOutline, IoSettingsOutline } from 'react-icons/io5';

interface HeaderProps {
  currentUser: UserData | null;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event?: React.KeyboardEvent<HTMLInputElement>) => void;
}

// NavLink 子组件保持不变
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const navLinkStyle: React.CSSProperties = {
    ...styles.navLink,
    backgroundColor: isHovered ? '#f5f5f5' : 'transparent',
    transition: 'background-color 0.2s ease-in-out',
  };

  return (
    <Link
      to={to}
      style={navLinkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
};

const Header: React.FC<HeaderProps> = ({ currentUser, searchTerm, onSearchChange, onSearchSubmit }) => {
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(e);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.headerLeft}>
          <Link
            to="/"
            style={styles.logoLink}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img
              src={isLogoHovered ? 'https://cdn.cdnstep.com/ysbhEjwXccSJjeVIeBS1/cover.thumb256.webp' : '/logo.png'}
              alt="Logo"
              style={styles.logo}
            />
            <span style={styles.siteName}>Better Call XiaoJin</span>
          </Link>

          <nav style={styles.nav}>
            <NavLink to="/recommend-user">用户推荐</NavLink>
            <NavLink to="/ai-agents">智能体中心</NavLink>
            <NavLink to="/notifications">消息通知</NavLink>
          </nav>
        </div>

        <div style={styles.headerSearch}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="搜索帖子..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={onSearchChange}
              onKeyDown={handleKeyDown}
            />
            {/* 2. 将图标恢复为 IoSearchOutline 组件 */}
            <IoSearchOutline
              style={{ ...styles.searchIcon, cursor: 'pointer' }}
              onClick={() => onSearchSubmit(undefined)}
            />
          </div>
        </div>

        <div style={styles.headerRight}>
          {currentUser ? (
            <>
              <Link
                to="/settings"
                style={{
                  ...styles.settingsLink,
                  backgroundColor: isSettingsHovered ? '#f5f5f5' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px',
                  transition: 'background-color 0.2s ease-in-out',
                }}
                title="设置"
                onMouseEnter={() => setIsSettingsHovered(true)}
                onMouseLeave={() => setIsSettingsHovered(false)}
              >
                {/* 3. 将图标恢复为 IoSettingsOutline 组件 */}
                <IoSettingsOutline size={24} />
              </Link>

              <Link
                to={`/profile`}
                style={{
                  ...styles.userProfile,
                  backgroundColor: isProfileHovered ? '#f5f5f5' : 'transparent',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  transition: 'background-color 0.2s ease-in-out',
                }}
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <img src={currentUser.icon || '/default-avatar.png'} alt={currentUser.username} style={styles.avatar} />
                <span>{currentUser.username}</span>
              </Link>
            </>
          ) : (
            <Link to="/auth" style={styles.authLink}>注册 / 登录</Link>
          )}
        </div>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  siteName: { fontSize: '20px', fontWeight: 'bold', color: '#4f46e5' },
  nav: {
    marginLeft: '40px',
    display: 'flex',
    gap: '10px'
  },
  navLink: {
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#555',
    fontSize: '16px',
    fontWeight: 500,
  },
  headerSearch: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  searchInput: {
    width: '100%',
    padding: '8px 40px 8px 15px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    right: '15px',
    color: '#888', // Changed from fill to color for react-icons
    width: '20px',
    height: '20px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    flexShrink: 0,
  },
  settingsLink: {
    color: '#555',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
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
};

export default Header;