// src/layouts/RootLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; 

import { getCurrentUser } from '@/api/user';
import type { UserData } from '@/models';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export interface OutletContextType {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  searchTerm: string; 
}

const SITE_NAME = 'Better Call XiaoJin';
const titleMap: Record<string, string> = {
  '/': '首页',
  '/auth': '登录/注册',
  "/profile": '个人主页',
  '/search': '搜索结果',
};

const RootLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
  e?.preventDefault(); // 如果有事件，就阻止默认行为
  if (searchTerm.trim() !== '') {
    navigate(`/search?q=${searchTerm}`);
  }
};

    useEffect(() => {
    const pageTitle = titleMap[location.pathname] || '';
    document.title = pageTitle ? `${pageTitle} - ${SITE_NAME}` : SITE_NAME;
  }, [location.pathname]);

  useEffect(() => {
    const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res.code === 200 && res.data) {
            setCurrentUser(res.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Token validation failed", error);
          localStorage.removeItem('token');
        }
      }
      setIsAuthLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (isAuthLoading) {
    return <div>Loading Application...</div>;
  }

  return (
    <div style={styles.pageContainer}><Header
        currentUser={currentUser}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearch} // 将新的 handleSearch 函数传递下去
      /><main style={styles.mainContent}>
        <Outlet context={{ currentUser, setCurrentUser, searchTerm }} />
      </main><Footer /></div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f4f5f5',
  },
  mainContent: {
    flex: '1 0 auto',
  },
};

export default RootLayout;