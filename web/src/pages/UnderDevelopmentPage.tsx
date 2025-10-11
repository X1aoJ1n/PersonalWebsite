// src/pages/UnderDevelopmentPage.tsx
import React from 'react';

const UnderDevelopmentPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <img src="/developing.png" alt="页面开发中" style={styles.image} />
      <h2 style={styles.text}>此功能正在开发中，敬请期待！🚀</h2>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '50px 20px',
    // 减去 Header 和 Footer 的大致高度，使其在主要内容区域垂直居中
    minHeight: 'calc(100vh - 200px)', 
  },
  image: {
    maxWidth: '350px', // 控制图片最大宽度
    width: '100%',
    marginBottom: '30px',
  },
  text: {
    fontSize: '24px', // 较大的字体
    color: '#555',
    fontWeight: 600,
  },
};

export default UnderDevelopmentPage;