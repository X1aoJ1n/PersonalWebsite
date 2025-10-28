import React from 'react';

interface ToastProps {
  /** 弹窗内容 */
  message: string;
  /** 弹窗是否可见 */
  isVisible: boolean;
  /** 弹窗类型 (用于样式) */
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, type = 'success' }) => {
  // 决定背景颜色
  const backgroundColor = type === 'error' ? '#fef2f2' : '#f0fdf4'; // 红 / 绿
  const borderColor = type === 'error' ? '#fecaca' : '#bbf7d0'; // 红 / 绿
  const textColor = type === 'error' ? '#991b1b' : '#166534';   // 红 / 绿

  // 决定可见性与动画
  const containerStyle: React.CSSProperties = {
    ...styles.container,
    // 根据 isVisible 状态在 Y 轴上移动
    transform: isVisible ? 'translateY(0)' : 'translateY(-120px)',
  };

  const contentStyle: React.CSSProperties = {
    ...styles.content,
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    color: textColor,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {message}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '20px', // 距离顶部 20px
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 2000, // 确保在最上层
    transition: 'transform 0.4s ease-out', // 平滑动画
    // 允许点击穿透容器，仅让内容响应点击
    pointerEvents: 'none', 
  },
  content: {
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid',
    fontWeight: 500,
    fontSize: '16px',
    // 允许内容本身被点击 (如果有需要)
    pointerEvents: 'auto',
  },
};

export default Toast;