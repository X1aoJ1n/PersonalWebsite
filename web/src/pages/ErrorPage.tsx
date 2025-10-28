import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

/**
 * 通用错误边界页面
 */
const ErrorPage: React.FC = () => {
  // useRouteError 会获取路由抛出的任何错误
  // (可能是 Error 对象, Response 对象, 或其他)
  const error = useRouteError() as any; 

  console.error("路由发生错误:", error);

  // 尝试从错误对象中获取更友好的信息
  let errorMessage: string;
  if (error?.statusText) {
    errorMessage = error.statusText; // e.g., "Not Found"
  } else if (error?.message) {
    errorMessage = error.message; // e.g., "API failed"
  } else {
    errorMessage = "发生了一个未知错误。";
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>哦豁！应用出错了</h1>
      <p style={styles.message}>抱歉，在处理您的请求时遇到了一个意外错误。</p>
      
      {/* 显示具体的错误信息 */}
      <pre style={styles.errorDetails}>
        {errorMessage}
      </pre>

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
    minHeight: 'calc(100vh - 200px)', // 假设视口高度减去页眉/页脚
    padding: '40px',
    backgroundColor: '#fff',
    margin: '20px auto',
    maxWidth: '1200px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    color: '#333',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#d9534f', // 错误红色
    margin: '0 0 15px 0',
  },
  message: {
    fontSize: '18px',
    color: '#555',
    margin: '0 0 25px 0',
    textAlign: 'center',
  },
  errorDetails: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '4px',
    padding: '15px 20px',
    color: '#d9534f',
    fontFamily: 'monospace',
    maxWidth: '100%',
    overflowX: 'auto',
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

export default ErrorPage;