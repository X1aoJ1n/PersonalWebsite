// 路径: src/components/common/Alert.tsx

import React from 'react';

interface AlertProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'danger';
}

const Alert: React.FC<AlertProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = '确认',
  cancelText = '取消',
  confirmColor = 'primary',
}) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const confirmButtonColor = confirmColor === 'danger' 
    ? styles.buttonDanger 
    : styles.buttonPrimary;

  return (
    // 1. 背景遮罩
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      
      {/* 2. 弹窗内容 */}
      {/* ★★★ 错误修复 ★★★ */}
      {/* onClick 事件处理器已从 styles.modalContent 移到这里 */}
      <div 
        style={styles.modalContent} 
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* 标题 */}
        <h2 style={styles.title}>{title}</h2>
        
        {/* 内容/消息体 */}
        <div style={styles.body}>
          {children}
        </div>
        
        {/* 底部按钮 */}
        <div style={styles.footer}>
          {onConfirm ? (
            <>
              <button style={styles.buttonSecondary} onClick={onClose}>
                {cancelText}
              </button>
              <button style={confirmButtonColor} onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          ) : (
            <button style={styles.buttonPrimary} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 样式 ---
const styles: { [key: string]: React.CSSProperties } = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    // ★★★ 错误修复 ★★★
    // 'onClick' 属性已从这里移除
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    fontWeight: 600,
    color: '#111827',
  },
  body: {
    margin: '0 0 24px 0',
    fontSize: '16px',
    color: '#374151',
    lineHeight: 1.6,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  buttonPrimary: {
    border: '1px solid #4f46e5',
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  buttonDanger: {
    border: '1px solid #ef4444',
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  }
};

export default Alert;