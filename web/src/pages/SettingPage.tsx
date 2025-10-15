import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout';
import { FaSignOutAlt } from 'react-icons/fa';

const SettingsPage: React.FC = () => {
  // 从 RootLayout 获取 setCurrentUser 函数
  const { setCurrentUser } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  // 定义退出登录的处理函数
  const handleLogout = () => {
    // 弹出确认框，防止误操作
    if (window.confirm('您确定要退出登录吗？')) {
      // 1. 清除本地存储的 token
      localStorage.removeItem('token');

      // 2. 更新全局用户状态为 null
      // 这个操作会通知 RootLayout 和其他组件用户已登出
      if (setCurrentUser) {
        setCurrentUser(null);
      }

      // 3. 跳转到首页
      alert('您已成功退出登录。');
      navigate('/');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.settingsCard}>
        <h1 style={styles.title}>设置</h1>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>账户</h2>
          <div style={styles.actionItem}>
            <p style={styles.actionText}>退出当前登录的账户。</p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              退出登录
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  settingsCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '30px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '20px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '20px',
  },
  actionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
    border: '1px solid #f0f0f0'
  },
  actionText: {
    margin: 0,
    color: '#666',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #fecaca',
    backgroundColor: '#fff7f7',
    color: '#ef4444',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
};

export default SettingsPage;