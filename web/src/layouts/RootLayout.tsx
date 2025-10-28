import React, { useState, useEffect , useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; 
import { getCurrentUser } from '@/api/user';
import { countAllUnread } from '@/api/notification';
import type { UserData } from '@/models'; 
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Toast from '@/components/common/Toast';

export interface OutletContextType {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const RootLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    message: '',
    isVisible: false,
    type: 'success' as 'success' | 'error',
  });
  const toastTimerRef = useRef<number | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsAuthLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const [userRes, countRes] = await Promise.all([
            getCurrentUser(),
            countAllUnread()
          ]);

          if (userRes.code === 200 && userRes.data) {
            setCurrentUser(userRes.data);
          } else {
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
          if (countRes.code === 200 && typeof countRes.data === 'number') {
            setUnreadCount(countRes.data);
          } else {
            setUnreadCount(0);
          }
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
          setCurrentUser(null);
          setUnreadCount(0);
        }
      } else {
        setCurrentUser(null);
        setUnreadCount(0);
      }
      setIsAuthLoading(false);
    };
    checkLoginStatus();
  }, [location.key]);


  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // 如果已有定时器，先清除
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    // 1. 显示 Toast
    setToast({ message, type, isVisible: true });

    // 2. 设置一个定时器，在 3 秒后隐藏它
    toastTimerRef.current = window.setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
      toastTimerRef.current = null;
    }, 3000); // 3 秒后自动消失
  };


  if (isAuthLoading) {
    return <div>Loading Application...</div>;
  }

  

  return (
    <div style={styles.pageContainer}>
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        type={toast.type}
      />

      <Header
        currentUser={currentUser}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearch}
        unreadCount={unreadCount}
      />
      <main style={styles.mainContent}>
        {/* ★★★ 2. 将未读数和其更新函数传递给 Outlet context ★★★ */}
        <Outlet context={{ currentUser, setCurrentUser, unreadCount, setUnreadCount, showToast }} />
      </main>
      <Footer />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f5f5', },
  mainContent: { flex: '1 0 auto', },
};

export default RootLayout;