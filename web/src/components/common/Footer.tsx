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
          <div>© {new Date().getFullYear()} Better Call XiaoJin. All Rights Reserved.</div>
          
          {/* --- ★★★ 新增备案号信息 ★★★ --- */}
          <div style={styles.beianContainer}>
            <a 
              href="http://beian.miit.gov.cn/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.beianLink}
            >
              {/* ▼▼▼ 请将这里替换成您自己的备案号 ▼▼▼ */}
              冀ICP备2025131629号-1
            </a>
          </div>
          {/* --- ★★★ 新增结束 ★★★ --- */}

        </div>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#202020',
    color: '#a0a0a0',
    padding: '20px 20px',
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
  contactTitle: {
    marginTop: 0,
    marginBottom: '10px',
    color: '#f4f5f5',
    fontSize: '16px',
    fontWeight: '600',
  },
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
  // --- ★★★ 新增的样式 ★★★ ---
  beianContainer: {
    marginTop: '8px', // 与版权信息拉开一点距离
  },
  beianLink: {
    color: '#a0a0a0', // 与周围文字颜色保持一致
    textDecoration: 'none', // 去掉下划线
  },
  // --- ★★★ 新增结束 ★★★ ---
};

export default Footer;