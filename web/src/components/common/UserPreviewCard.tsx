import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { UserPreviewData } from '@/models';
import { follow, unfollow, checkFollowStatus } from '@/api/follow';

interface UserPreviewCardProps {
  data: UserPreviewData | null;
  isLoading: boolean;
  position: { top: number; left: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  // 1. 新增 prop，用于接收当前登录用户的ID
  currentUserId?: string; 
}

const UserPreviewCard: React.FC<UserPreviewCardProps> = ({ 
  data, 
  isLoading, 
  position, 
  onMouseEnter, 
  onMouseLeave,
  currentUserId 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  // 2. 新增 state 用于管理粉丝数，实现乐观更新
  const [followerCount, setFollowerCount] = useState(0); 
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (data && data.id) {
      setIsFollowing(data.isFollow);
      // 初始化粉丝数
      setFollowerCount(data.followerCount); 

      const verifyFollowStatus = async () => {
        try {
          const res = await checkFollowStatus(data.id);
          if (res.code === 200) {
            setIsFollowing(res.data);
          }
        } catch (error) {
          console.error("验证关注状态失败:", error);
        }
      };

      verifyFollowStatus();
    }
  }, [data]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    if (isProcessing || !data) return;
    e.preventDefault();

    setIsProcessing(true);
    const originalIsFollowing = isFollowing;

    // 3. 乐观更新 UI：立即更新关注状态和粉丝数
    setIsFollowing(!originalIsFollowing);
    setFollowerCount(prevCount => originalIsFollowing ? prevCount - 1 : prevCount + 1);

    try {
      if (originalIsFollowing) {
        await unfollow(data.id);
      } else {
        await follow(data.id);
      }
    } catch (error) {
      setIsFollowing(originalIsFollowing);
      setFollowerCount(prevCount => originalIsFollowing ? prevCount + 1 : prevCount - 1);
    } finally {
      setIsProcessing(false);
    }
  };

    // --- 加载状态的骨架屏 ---
  if (isLoading) {
    return (
      <div
        style={{ ...styles.card, top: position.top, left: position.left, pointerEvents: 'none' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={styles.header}>
          <div style={{ ...styles.avatar, backgroundColor: '#f0f2f5' }} />
          <div style={styles.userInfo}>
            <div style={{ height: '22px', width: '70%', backgroundColor: '#f0f2f5', borderRadius: '4px' }}/>
            <div style={{ height: '18px', width: '90%', backgroundColor: '#f0f2f5', borderRadius: '4px', marginTop: '10px' }}/>
          </div>
        </div>
        <div style={{ height: '16px', width: '100%', backgroundColor: '#f0f2f5', borderRadius: '4px', margin: '15px 0', paddingBottom: '15px' }}/>
        <div style={styles.actions}>
          <div style={{ height: '36px', flex: 1, backgroundColor: '#f0f2f5', borderRadius: '6px' }} />
          <div style={{ height: '36px', flex: 1, backgroundColor: '#f0f2f5', borderRadius: '6px' }} />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  console.log("currentUserId:", currentUserId, "| Card's data.id:", data.id);

  
  // 5. 判断是否为用户本人
  const isSelf = currentUserId === data.id;

  return (
    <div
      style={{ ...styles.card, top: position.top, left: position.left, zIndex: 10000 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={styles.header}>
        <Link to={`/profile/${data.id}`} onClick={onMouseLeave}>
          <img src={data.icon || '/default-avatar.png'} alt={data.username} style={styles.avatar} />
        </Link>
        <div style={styles.userInfo}>
          <Link to={`/profile/${data.id}`} style={styles.usernameLink} onClick={onMouseLeave}>
            {data.username}
          </Link>
          <div style={styles.stats}>
            <span><span style={styles.statNumber}>{data.followingCount}</span> 关注</span>
            <span><span style={styles.statNumber}>{followerCount}</span> 粉丝</span>
            <span><span style={styles.statNumber}>{data.likeCount}</span> 获赞</span>
          </div>
        </div>
      </div>

      <p style={styles.introduction}>{data.introduction || '这位用户很神秘，什么也没留下...'}</p>

      {/* 7. 如果不是用户本人，才显示操作按钮 */}
      {!isSelf && (
        <div style={styles.actions}>
          <button onClick={handleFollowToggle} style={isFollowing ? styles.unfollowButton : styles.followButton} disabled={isProcessing}>
            {isProcessing ? '处理中...' : (isFollowing ? '已关注' : `+ 关注`)}
          </button>
          <button style={styles.messageButton} disabled>发消息</button>
        </div>
      )}
    </div>
  );
};

// 样式对象 styles 保持不变
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    position: 'fixed',
    width: '350px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    padding: '20px',
    border: '1px solid #e7e7e7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '1px solid #eee'
  },
  userInfo: {
    flex: 1,
    paddingTop: '5px'
  },
  usernameLink: {
    textDecoration: 'none',
    color: '#111',
    fontWeight: 600,
    fontSize: '18px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#999',
  },
  statNumber: {
    color: '#222',
    fontWeight: 600,
    marginRight: '4px',
  },
  introduction: {
    fontSize: '14px',
    color: '#666',
    margin: '15px 0',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  followButton: {
    flex: 1,
    border: 'none',
    backgroundColor: '#00a1d6',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '15px',
    transition: 'background-color 0.2s',
  },
  unfollowButton: {
    flex: 1,
    border: '1px solid #e0e0e0',
    backgroundColor: '#f0f0f0',
    color: '#666',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '15px',
    transition: 'background-color 0.2s',
  },
  messageButton: {
    flex: 1,
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontWeight: 500,
    fontSize: '15px',
  },
};

export default UserPreviewCard;