// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.contactSection}>
          <h4 style={styles.contactTitle}>联系我 (Contact Me)</h4>
          <p>如果您对本站内容感兴趣或有任何建议，欢迎通过以下方式联系我：</p>
          <div style={styles.links}>
            <a href="mailto:bihuijin427@gmail.com" style={styles.linkItem}>邮箱 (Email)</a>
            <a href="https://github.com/X1aoJ1n" target="_blank" rel="noopener noreferrer" style={styles.linkItem}>GitHub</a>
            <a href="https://www.linkedin.com/in/bihui-jin-86a66b276/" target="_blank" rel="noopener noreferrer" style={styles.linkItem}>领英 (LinkedIn)</a>
          </div>
        </div>
        <div style={styles.copyright}>
          © {new Date().getFullYear()} Better Call XiaoJin. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#202020',
    color: '#a0a0a0',
    padding: '20px 20px', // 保持我们之前减小的内边距
    marginTop: 'auto',
    fontSize: '14px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  contactSection: {
    marginBottom: '20px',
  },
  // --- 新增的样式，用于重置 h4 的默认 margin ---
  contactTitle: {
    marginTop: 0, // 关键：将上外边距设置为 0
    marginBottom: '10px', // 保留一个小的下外边距，与下面的 p 标签分隔
    color: '#f4f5f5', // 标题颜色也可以亮一些
    fontSize: '16px', // 调整字体大小
    fontWeight: '600',
  },
  // --- 结束 ---
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '10px',
  },
  linkItem: {
    color: '#f4f5f5',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  copyright: {
    borderTop: '1px solid #444',
    paddingTop: '15px',
    fontSize: '13px',
  },
};

export default Footer;