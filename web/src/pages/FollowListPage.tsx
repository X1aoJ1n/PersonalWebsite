// src/pages/FollowListPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useOutletContext } from 'react-router-dom';
import { getFollowingList, getFollowerList } from '@/api/follow';
import { follow, unfollow } from '@/api/follow';
import type { SimpleUserVO, PageQuery } from '@/models';
import type { OutletContextType } from '@/layouts/RootLayout';

const FollowListPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [searchParams] = useSearchParams();
    const { currentUser, showToast } = useOutletContext<OutletContextType>();
    const [users, setUsers] = useState<SimpleUserVO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);
    const [hoveredFollowId, setHoveredFollowId] = useState<string | null>(null);

    const activeTab = useMemo(() => searchParams.get('tab') || 'following', [searchParams]);
    
    // useEffect 保持不变
    useEffect(() => {
        if (!userId) {
            setError('未找到用户ID。');
            setIsLoading(false); return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const pageQuery: PageQuery = { pageNum: 1, pageSize: 50 };
                const apiCall = activeTab === 'followers'
                    ? getFollowerList(userId, pageQuery)
                    : getFollowingList(userId, pageQuery);
                const res = await apiCall;
                if (res.code === 200 && res.data) {
                    setUsers(res.data);
                } else {
                    throw new Error(res.message || `获取列表失败。`);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userId, activeTab]);

    const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowed: boolean) => {
        if (processingFollowId) return;
        setProcessingFollowId(targetUserId);

        // 乐观更新 (保持不变)
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === targetUserId
                    ? { ...user, isFollowed: !isCurrentlyFollowed }
                    : user
            )
        );

        try {
            if (isCurrentlyFollowed) {
                await unfollow(targetUserId);
            } else {
                await follow(targetUserId);
            }
        } catch (err) {
            console.error('关注/取关操作失败:', err);
            // 失败时回滚UI (保持不变)
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === targetUserId
                        ? { ...user, isFollowed: isCurrentlyFollowed }
                        : user
                )
            );
            showToast('操作失败，请稍后重试。', 'error');

        } finally {
            setProcessingFollowId(null);
        }
    };

    // getButtonProps 辅助函数保持不变，它是正确的
    const getButtonProps = (user: SimpleUserVO, isHovered: boolean) => {
        if (user.isFollowed) {
            if (isHovered) {
                return { text: '取消关注', style: { ...styles.followingButton, ...styles.unfollowButtonHover } };
            }
            return { text: user.beingFollowed ? '互相关注' : '已关注', style: styles.followingButton };
        } else {
            return { text: '+ 关注', style: styles.followButton };
        }
    };

    return (
        // ★ 4. 添加 React Fragment
      <>
        <main style={styles.container}>
            <div style={styles.card}>
                {/* Tabs 渲染保持不变 */}
                <div style={styles.tabs}>
                    <Link to={`/profile/${userId}/follows?tab=following`} style={activeTab === 'following' ? styles.activeTab : styles.tab}>
                        关注列表
                    </Link>
                    <Link to={`/profile/${userId}/follows?tab=followers`} style={activeTab === 'followers' ? styles.activeTab : styles.tab}>
                        粉丝列表
                    </Link>
                </div>

                <div style={styles.userList}>
                    {isLoading ? ( <p style={styles.message}>加载中...</p> ) 
                    : error ? ( <p style={{...styles.message, color: 'red'}}>{error}</p> ) 
                    : users.length === 0 ? ( <p style={styles.message}>列表为空</p> ) 
                    : (
                        users.map(user => {
                            const isHovered = hoveredFollowId === user.id;
                            const buttonProps = getButtonProps(user, isHovered);
                            return (
                                <div key={user.id} style={styles.userItem}>
                                    <Link to={`/profile/${user.id}`} style={styles.userInfo}>
                                        <img src={user.icon || '/default-avatar.png'} alt={user.username} style={styles.avatar} />
                                        <span>{user.username}</span>
                                    </Link>
                                    {currentUser && currentUser.id !== user.id && (
                                        <button
                                            style={buttonProps.style}
                                            onClick={() => handleFollowToggle(user.id, user.isFollowed)}
                                            disabled={processingFollowId === user.id}
                                            onMouseEnter={() => setHoveredFollowId(user.id)}
                                            onMouseLeave={() => setHoveredFollowId(null)}
                                        >
                                            {processingFollowId === user.id ? '...' : buttonProps.text}
                                    </button>
                                    )}
                                </div>
                            );
                          })
                    )}
                </div>
            </div>
        </main>
      </>
    );
};

// 样式对象 styles 保持不变
const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '800px', margin: '20px auto' },
    card: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', overflow: 'hidden' },
    tabs: { display: 'flex', borderBottom: '1px solid #f0f0f0' },
    tab: { padding: '15px 20px', textDecoration: 'none', color: '#555', fontWeight: 500 },
    activeTab: { padding: '15px 20px', textDecoration: 'none', color: '#4f46e5', fontWeight: 600, borderBottom: '2px solid #4f46e5' },
    userList: { padding: '10px 20px' },
    userItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' },
    userInfo: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: '15px' },
    avatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' },
    message: { textAlign: 'center', padding: '40px', color: '#888' },
    followButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, minWidth: '80px', textAlign: 'center', transition: 'background-color 0.2s' },
    followingButton: { border: '1px solid #ddd', backgroundColor: '#f0f0f0', color: '#555', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, minWidth: '80px', textAlign: 'center', transition: 'all 0.2s' },
    unfollowButtonHover: {
        backgroundColor: '#fff1f0',
        borderColor: '#ffa39e',
        color: '#cf1322',
    },
};

export default FollowListPage;