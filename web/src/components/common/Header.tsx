import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { UserData } from '@/models';
import { IoSearchOutline, IoSettingsOutline } from 'react-icons/io5';

interface HeaderProps {
  currentUser: UserData | null;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event?: React.FormEvent) => void;
  unreadCount: number;
}

// NavLink 子组件用于简单的链接
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navLinkStyle: React.CSSProperties = {
    ...styles.navLink,
    backgroundColor: isHovered ? '#f5f5f5' : 'transparent',
  };
  return (
    <Link to={to} style={navLinkStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {children}
    </Link>
  );
};

const Header: React.FC<HeaderProps> = ({ currentUser, searchTerm, onSearchChange, onSearchSubmit, unreadCount }) => {
  const location = useLocation();
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isNotificationsHovered, setIsNotificationsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(e);
    }
  };

  const isNotificationsActive = location.pathname.startsWith('/notifications');
  const isProfileActive = location.pathname === '/profile';

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
            <Link
              to="/notifications"
              style={{
                ...styles.navLink,
                backgroundColor: isNotificationsHovered ? '#f5f5f5' : (isNotificationsActive ? '#eef2ff' : 'transparent'),
                color: isNotificationsActive ? '#4f46e5' : '#555',
              }}
              onMouseEnter={() => setIsNotificationsHovered(true)}
              onMouseLeave={() => setIsNotificationsHovered(false)}
            >
              消息通知
              {currentUser && unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </Link>
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
            <IoSearchOutline
              style={{ ...styles.searchIcon, cursor: 'pointer' }}
              onClick={onSearchSubmit}
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
                }}
                title="设置"
                onMouseEnter={() => setIsSettingsHovered(true)}
                onMouseLeave={() => setIsSettingsHovered(false)}
              >
                <IoSettingsOutline size={24} />
              </Link>

              <Link
                to={`/profile`}
                style={{
                  ...styles.userProfile,
                  backgroundColor: isProfileHovered ? '#f5f5f5' : (isProfileActive ? '#eef2ff' : 'transparent'),
                  color: isProfileActive ? '#4f46e5' : 'inherit',
                  borderRadius: '8px',
                  padding: '4px 8px',
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
  header: { backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'center' },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '60px', width: '100%', maxWidth: '1200px', gap: '20px' },
  headerLeft: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  logoLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#333' },
  logo: { height: '32px', marginRight: '12px' },
  siteName: { fontSize: '20px', fontWeight: 'bold', color: '#4f46e5' },
  nav: { marginLeft: '40px', display: 'flex', gap: '10px', alignItems: 'center' },
  navLink: { padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', color: '#555', fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s ease-in-out' },
  activeNavLink: { backgroundColor: '#eef2ff', color: '#4f46e5' },
  // ★★★ 修改点：这是最终修正的样式 ★★★
  unreadBadge: {
    display: 'inline-flex',    // 使用 flex 布局，这是最可靠的居中方案
    alignItems: 'center',      // 垂直居中
    justifyContent: 'center',  // 水平居中
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    height: '18px',
    minWidth: '18px',
    borderRadius: '9px',
    padding: '0 6px',
    boxSizing: 'border-box',   // 确保 padding 不会影响最终尺寸
  },
  headerSearch: { flexGrow: 1, display: 'flex', justifyContent: 'center' },
  searchContainer: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '400px' },
  searchInput: { width: '100%', padding: '8px 40px 8px 15px', border: '1px solid #ccc', borderRadius: '20px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' },
  searchIcon: { position: 'absolute', right: '15px', color: '#888', width: '20px', height: '20px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '25px', flexShrink: 0 },
  settingsLink: { color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s ease-in-out' },
  authLink: { padding: '8px 16px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '6px', textDecoration: 'none' },
  userProfile: { display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none', transition: 'background-color 0.2s, color 0.2s' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' },
};

export default Header;