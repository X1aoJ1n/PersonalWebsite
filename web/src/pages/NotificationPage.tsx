import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import type { NotificationData } from '@/models';
// ★★★ 1. 确保 OutletContextType 的导入路径正确 ★★★
import type { OutletContextType } from '@/layouts/RootLayout'; 
import {
  getLikeNotification,
  getFollowNotification,
  getCommentNotification,
  readNotification,
  readNotificationBatch,
} from '@/api/notification';

type NotificationState = { likes: NotificationData[]; follows: NotificationData[]; comments: NotificationData[]; };
type ActiveTab = keyof NotificationState;

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  // ★★★ 2. 从 context 中获取 setUnreadCount ★★★
  const { currentUser, setUnreadCount } = useOutletContext<OutletContextType>();

  const [activeTab, setActiveTab] = useState<ActiveTab>('comments');
  const [notifications, setNotifications] = useState<NotificationState>({ likes: [], follows: [], comments: [] });
  // 本地计数 State 依然保留，用于显示在 tab 内部
  const [localUnreadCounts, setLocalUnreadCounts] = useState({ likes: 0, follows: 0, comments: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [likesRes, followsRes, commentsRes] = await Promise.all([
        getLikeNotification(),
        getFollowNotification(),
        getCommentNotification(),
      ]);

      const likesData = likesRes.data || [];
      const followsData = followsRes.data || [];
      const commentsData = commentsRes.data || [];
      
      setNotifications({ likes: likesData, follows: followsData, comments: commentsData });
      
      // ★★★ 3. 从获取的列表中计算本地未读数，而不是再次请求 API ★★★
      setLocalUnreadCounts({
        likes: likesData.filter(n => !n.read).length,
        follows: followsData.filter(n => !n.read).length,
        comments: commentsData.filter(n => !n.read).length,
      });

    } catch (err: any) {
      setError('加载通知失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);
  
  const handleMouseEnterNotification = (notification: NotificationData) => {
    if (notification.read) return;

    setNotifications(prev => ({ ...prev, [activeTab]: prev[activeTab].map(n => n.id === notification.id ? { ...n, read: true } : n) }));
    setLocalUnreadCounts(prev => ({ ...prev, [activeTab]: Math.max(0, prev[activeTab] - 1) }));
    
    // ★★★ 4. 调用从 context 得到的函数，更新 Header 中的总未读数 ★★★
    setUnreadCount(prev => Math.max(0, prev - 1));

    readNotification(notification.id).catch(error => console.error('后台标记已读失败:', error));
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (notification.postId) navigate(`/post/${notification.postId}`);
  };

  const handleReadAll = async () => {
    const typeMap: Record<ActiveTab, number> = { likes: 1, follows: 2, comments: 3 };
    const type = typeMap[activeTab];
    
    // ★★★ 5. 更新 Header 中的总未读数 ★★★
    const countToSubtract = localUnreadCounts[activeTab];
    setUnreadCount(prev => Math.max(0, prev - countToSubtract));

    setNotifications(prev => ({ ...prev, [activeTab]: prev[activeTab].map(n => ({ ...n, read: true })) }));
    setLocalUnreadCounts(prev => ({ ...prev, [activeTab]: 0 }));
    
    try {
      await readNotificationBatch(type);
    } catch (error) {
      console.error('批量已读失败:', error);
    }
  };

  const renderNotificationContent = (n: NotificationData) => {
    if (!n.targetUser) return null;
    const userLink = (
      <Link to={`/profile/${n.targetUser.id}`} style={styles.userLink} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {n.targetUser.username}
      </Link>
    );
    switch (n.type) {
      case 1: return <>{userLink}<span style={styles.actionText}> 点赞了你的{n.targetType === 1 ? '帖子' : '评论'}：</span><span style={styles.targetContent}>{n.targetContent}</span></>;
      case 2: return <>{userLink}<span style={styles.actionText}> 关注了你</span></>;
      case 3: case 4: return <div><div>{userLink}<span style={styles.actionText}> 评论了你的{n.targetType === 1 ? '帖子' : '评论'}：</span><span style={styles.targetContent}>{n.targetContent}</span></div><div style={styles.commentContent}>{n.content}</div></div>;
      default: return null;
    }
  };

    if (!currentUser) { return <div style={{...styles.container, padding: '20px'}}><p style={styles.centerMessage}>请先 <Link to="/login">登录</Link> 查看通知。</p></div>; }

  const currentNotifications = notifications[activeTab];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>通知中心</h1>
      <div style={styles.tabContainer}>
        <button style={activeTab === 'comments' ? styles.activeTabButton : styles.tabButton} onClick={() => setActiveTab('comments')}>
          评论和回复 {localUnreadCounts.comments > 0 && <span style={styles.unreadBadge}>{localUnreadCounts.comments}</span>}
        </button>
        <button style={activeTab === 'likes' ? styles.activeTabButton : styles.tabButton} onClick={() => setActiveTab('likes')}>
          收到的赞 {localUnreadCounts.likes > 0 && <span style={styles.unreadBadge}>{localUnreadCounts.likes}</span>}
        </button>
        <button style={activeTab === 'follows' ? styles.activeTabButton : styles.tabButton} onClick={() => setActiveTab('follows')}>
          新增关注 {localUnreadCounts.follows > 0 && <span style={styles.unreadBadge}>{localUnreadCounts.follows}</span>}
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.toolbar}>
          <button onClick={handleReadAll} style={styles.readAllButton} disabled={currentNotifications.every(n => n.read)}>
            一键已读
          </button>
        </div>
        {isLoading ? (
          <p style={styles.centerMessage}>加载中...</p>
        ) : error ? (
          <p style={{...styles.centerMessage, color: 'red'}}>{error}</p>
        ) : currentNotifications.length === 0 ? (
          <p style={styles.centerMessage}>这里空空如也~</p>
        ) : (
          <ul style={styles.notificationList}>
            {currentNotifications.map(n => (
              <li
                key={n.id}
                style={{ ...styles.notificationItem, cursor: n.postId ? 'pointer' : 'default' }}
                onClick={() => handleNotificationClick(n)}
                onMouseEnter={() => handleMouseEnterNotification(n)}
              >
                {!n.read && <div style={styles.unreadMarker}></div>}
                <img src={n.targetUser?.icon || '/default-avatar.png'} alt={n.targetUser?.username} style={styles.avatar}/>
                <div style={styles.notificationBody}>
                  {renderNotificationContent(n)}
                  <div style={styles.timestamp}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: '800px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '20px 30px', },
  title: { margin: '0 0 20px 0', fontSize: '24px', fontWeight: 600, },
  tabContainer: { display: 'flex', gap: '10px', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px', marginBottom: '20px', },
  tabButton: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: 'none', background: 'none', padding: '10px 15px', fontSize: '15px', color: '#6b7280', cursor: 'pointer', borderRadius: '6px', transition: 'background-color 0.2s, color 0.2s', fontWeight: 500, },
  activeTabButton: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 15px', fontSize: '15px', cursor: 'pointer', borderRadius: '6px', transition: 'background-color 0.2s, color 0.2s', backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: '600', },
  // ★★★ 7. 新增未读计数角标的样式 ★★★
  unreadBadge: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '20px',
    textAlign: 'center',
  },
  content: { padding: '0' },
  toolbar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' },
  readAllButton: { border: 'none', background: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '14px' },
  notificationList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', },
  notificationItem: { position: 'relative', display: 'flex', gap: '15px', padding: '16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', transition: 'box-shadow 0.2s, transform 0.2s', },
  unreadMarker: { position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4f46e5', },
  avatar: { width: '48px', height: '48px', borderRadius: '50%' },
  notificationBody: { flex: 1 },
  userLink: { fontWeight: 600, color: '#111827', textDecoration: 'none' },
  actionText: { color: '#4b5563' },
  targetContent: { fontStyle: 'italic', color: '#6b7280', marginLeft: '5px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' },
  commentContent: { backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', padding: '10px', borderRadius: '6px', marginTop: '8px', color: '#374151' },
  timestamp: { fontSize: '13px', color: '#9ca3af', marginTop: '8px' },
  centerMessage: { textAlign: 'center', padding: '50px', fontSize: '16px', color: '#9ca3af' },
};

export default NotificationPage;

