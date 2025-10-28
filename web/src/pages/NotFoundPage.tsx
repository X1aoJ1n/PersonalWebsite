import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 页面未找到组件
 */
const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.title}>页面未找到</h2>
      <p style={styles.message}>抱歉，您访问的页面不存在或已被移动。</p>
      <Link to="/" style={styles.linkButton}>
        返回首页
      </Link>
    </div>
  );
};

// 样式
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)', // 减去页眉和页脚的大致高度
    padding: '20px',
    backgroundColor: '#fff', // 白色背景
    margin: '20px auto',
    maxWidth: '1200px', // 与您的主内容区域宽度一致
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  errorCode: {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#4f46e5', // 主题色
    margin: '0 0 10px 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 30px 0',
  },
  linkButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#4f46e5', // 主题色
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

export default NotFoundPage;