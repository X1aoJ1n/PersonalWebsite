// src/layouts/RootLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // 引入 useLocation

import { getCurrentUser } from '@/api/user';
import type { UserData } from '@/models';

// 定义将要共享给子路由的 context 类型
export interface OutletContextType {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

// --- 动态标题的数据 ---
const SITE_NAME = 'Better Call XiaoJin';
const titleMap: Record<string, string> = {
  '/': '首页',
  '/auth': '登录/注册',
  "/profile": '个人主页',
};
// --- 结束 ---

const RootLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation(); // 使用 useLocation hook

  // --- 处理动态标题的 useEffect ---
  useEffect(() => {
    const pageTitle = titleMap[location.pathname] || '';
    document.title = pageTitle ? `${pageTitle} - ${SITE_NAME}` : SITE_NAME;
  }, [location.pathname]);

  // --- 处理用户登录状态的 useEffect ---
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

  return <Outlet context={{ currentUser, setCurrentUser }} />;
};

export default RootLayout;