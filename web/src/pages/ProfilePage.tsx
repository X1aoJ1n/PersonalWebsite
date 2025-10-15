import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout';

// API Imports
import { getUserById } from '@/api/user';
import { getContactByUserId, deleteContactById, updateContactById, addContact } from '@/api/contact';
import { getOrganizationByUserId, deleteOrganizationById } from '@/api/organization';
import { checkFollowStatus, follow, unfollow } from '@/api/follow';
import { getUserPost } from '@/api/post';
import { getRecentViewPost, getRecentViewUser } from '@/api/recentView';

// Type Imports
import type { UserData, ContactData, OrganizationData, ContactRequest, AddContactRequest, SimplePostData, SimpleUserVO } from '@/models';

// Component Imports
import UserInfo from '@/components/profile/UserInfo';
import Contacts from '@/components/profile/Contacts';
import Organizations from '@/components/profile/Organizations';
import Posts from '@/components/profile/posts';
import RecentViews from '@/components/profile/RecentViews'; // 1. 引入新组件

const POSTS_PER_PAGE = 10;

const ProfilePage: React.FC = () => {
    const { userId: paramId } = useParams<{ userId: string }>();
    const { currentUser } = useOutletContext<OutletContextType>();
    
    // --- 所有 State 保持不变，由主组件管理 ---
    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    const [contacts, setContacts] = useState<ContactData[]>([]);
    const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
    const [posts, setPosts] = useState<SimplePostData[]>([]); 
    const [activeTab, setActiveTab] = useState<'organizations' | 'posts' | 'recent'>('organizations');
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const [recentViewPosts, setRecentViewPosts] = useState<SimplePostData[]>([]);
    const [recentViewUsers, setRecentViewUsers] = useState<SimpleUserVO[]>([]);
    const [isRecentViewLoading, setIsRecentViewLoading] = useState(true);
    const [recentViewFetched, setRecentViewFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [editingContactId, setEditingContactId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<ContactRequest>>({ type: '', data: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userIdToFetch = paramId || currentUser?.id;
    const isOwnProfile = !!currentUser && currentUser.id === userIdToFetch;

    // 主数据获取 Effect
    useEffect(() => {
        if (!userIdToFetch) {
            setError('无法确定要加载的用户。');
            setIsLoading(false);
            return;
        }
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            setHasMore(true); // Reset on full refresh
            try {
                const [userRes, contactRes, orgRes, postRes] = await Promise.all([
                    getUserById(userIdToFetch),
                    getContactByUserId(userIdToFetch),
                    getOrganizationByUserId(userIdToFetch),
                    getUserPost({ id: userIdToFetch, pageNum: 1, pageSize: POSTS_PER_PAGE })
                ]);

                if (userRes.code === 200 && userRes.data) setProfileUser(userRes.data);
                else throw new Error('获取用户信息失败');
                if (contactRes.code === 200 && contactRes.data) setContacts(contactRes.data);
                else throw new Error('获取联系方式失败');
                if (orgRes.code === 200 && orgRes.data) setOrganizations(orgRes.data);
                else throw new Error('获取组织信息失败');
                
                if (postRes.code === 200 && postRes.data) {
                    setPosts(postRes.data);
                    setCurrentPageNum(2);
                    if (postRes.data.length < POSTS_PER_PAGE) {
                        setHasMore(false);
                    }
                } else {
                    throw new Error('获取帖子列表失败');
                }

                if (currentUser && userIdToFetch !== currentUser.id) {
                    const followStatusRes = await checkFollowStatus(userIdToFetch);
                    if (followStatusRes.code === 200) setIsFollowing(followStatusRes.data);
                }
            } catch (err: any) {
                setError(err.message || '加载页面时出错');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [userIdToFetch, currentUser]);

    // 5. 新增 Effect，用于在首次点击“最近浏览”选项卡时延迟加载数据
    useEffect(() => {
        // 仅当选项卡被激活、数据尚未获取且用户ID有效时才执行
        if (activeTab === 'recent' && !recentViewFetched && userIdToFetch) {
            const fetchRecentData = async () => {
                setIsRecentViewLoading(true);
                try {
                    // 注意：这里用的是 getRecentViewPost/User，而不是 getUserPost
                    const [postRes, userRes] = await Promise.all([
                        getRecentViewPost({ pageNum: 1, pageSize: 5 }), // 假设每个模块最多显示5条
                        getRecentViewUser({ pageNum: 1, pageSize: 5 })
                    ]);

                    if (postRes.code === 200 && postRes.data) {
                        setRecentViewPosts(postRes.data);
                    }
                    if (userRes.code === 200 && userRes.data) {
                        setRecentViewUsers(userRes.data);
                    }
                    setRecentViewFetched(true); // 标记数据已成功获取
                } catch (err) {
                    console.error("获取最近浏览数据失败:", err);
                    // 可以在这里设置一个特定的错误状态
                } finally {
                    setIsRecentViewLoading(false);
                }
            };
            fetchRecentData();
        }
    }, [activeTab, recentViewFetched, userIdToFetch]);

    useEffect(() => {
        // 仅当选项卡被激活、数据尚未获取且用户ID有效时才执行
        if (activeTab === 'recent' && !recentViewFetched && userIdToFetch) {
            const fetchRecentData = async () => {
                setIsRecentViewLoading(true);
                try {
                    const [postRes, userRes] = await Promise.all([
                        getRecentViewPost({ id: userIdToFetch, pageNum: 1, pageSize: 5 }),
                        getRecentViewUser({ id: userIdToFetch, pageNum: 1, pageSize: 5 })
                    ]);

                    if (postRes.code === 200 && postRes.data) {
                        setRecentViewPosts(postRes.data);
                    }
                    if (userRes.code === 200 && userRes.data) {
                        setRecentViewUsers(userRes.data);
                    }
                    setRecentViewFetched(true); // 标记数据已成功获取
                } catch (err) {
                    console.error("获取最近浏览数据失败:", err);
                    // 可以在这里设置一个特定的错误状态
                } finally {
                    setIsRecentViewLoading(false);
                }
            };
            fetchRecentData();
        }
    }, [activeTab, recentViewFetched, userIdToFetch]);
    
    useEffect(() => {
        if (!userIdToFetch) {
            setError('无法确定要加载的用户。');
            setIsLoading(false);
            return;
        }
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            setHasMore(true); // Reset on full refresh
            try {
                const [userRes, contactRes, orgRes, postRes] = await Promise.all([
                    getUserById(userIdToFetch),
                    getContactByUserId(userIdToFetch),
                    getOrganizationByUserId(userIdToFetch),
                    // 3. Fetch the first page with the correct page size
                    getUserPost({ id: userIdToFetch, pageNum: 1, pageSize: POSTS_PER_PAGE })
                ]);

                if (userRes.code === 200 && userRes.data) setProfileUser(userRes.data);
                else throw new Error('获取用户信息失败');
                if (contactRes.code === 200 && contactRes.data) setContacts(contactRes.data);
                else throw new Error('获取联系方式失败');
                if (orgRes.code === 200 && orgRes.data) setOrganizations(orgRes.data);
                else throw new Error('获取组织信息失败');
                
                if (postRes.code === 200 && postRes.data) {
                    setPosts(postRes.data);
                    // 4. Set up for the next page load
                    setCurrentPageNum(2);
                    if (postRes.data.length < POSTS_PER_PAGE) {
                        setHasMore(false);
                    }
                } else {
                    throw new Error('获取帖子列表失败');
                }

                if (currentUser && userIdToFetch !== currentUser.id) {
                    const followStatusRes = await checkFollowStatus(userIdToFetch);
                    if (followStatusRes.code === 200) setIsFollowing(followStatusRes.data);
                }
            } catch (err: any) {
                setError(err.message || '加载页面时出错');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [userIdToFetch, currentUser]);

    // 5. Create the handler to load more posts
    const handleLoadMorePosts = async () => {
        if (isLoadMoreLoading || !hasMore || !userIdToFetch) return;
        setIsLoadMoreLoading(true);

        const pageQuery = { id: userIdToFetch, pageNum: currentPageNum, pageSize: POSTS_PER_PAGE };
        try {
            const res = await getUserPost(pageQuery);
            if (res.code === 200 && res.data) {
                setPosts(prevPosts => [...prevPosts, ...res.data]);
                setCurrentPageNum(prevPage => prevPage + 1);
                if (res.data.length < POSTS_PER_PAGE) {
                    setHasMore(false);
                }
            } else {
                throw new Error(res.message || '获取更多帖子失败');
            }
        } catch (err: any) {
            // You might want to show this error in the UI
            console.error(err);
        } finally {
            setIsLoadMoreLoading(false);
        }
    };

    // Handlers (All remain here)
    const handleFollowToggle = async () => {
        if (isTogglingFollow || isOwnProfile || !userIdToFetch) return;
        setIsTogglingFollow(true);
        try {
            if (isFollowing) {
                await unfollow(userIdToFetch);
                setIsFollowing(false);
            } else {
                await follow(userIdToFetch);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error('关注/取关操作失败', err);
        } finally {
            setIsTogglingFollow(false);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditContactClick = (contact: ContactData) => {
        setEditingContactId(contact.id);
        setEditFormData({ type: contact.type, data: contact.data });
        setIsAddingContact(false);
    };

    const handleCancelEdit = () => {
        setEditingContactId(null);
        setIsAddingContact(false);
        setEditFormData({ type: '', data: '' });
    }; 
    
    const handleSaveContact = async () => {
        setIsSubmitting(true);
        try {
            const isEditing = !!editingContactId;
            const apiCall = isEditing
                ? updateContactById({ id: editingContactId, ...editFormData } as ContactRequest)
                : addContact(editFormData as AddContactRequest);
            
            const res = await apiCall;
            if (res.code === 200 && res.data) {
                setContacts(res.data);
                handleCancelEdit();
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        if (!window.confirm('您确定要删除这个联系方式吗？')) return;
        setIsSubmitting(true);
        try {
            const res = await deleteContactById(contactId);
            if (res.code === 200 && res.data) {
                setContacts(res.data);
            } else {
                throw new Error(res.message || '删除失败');
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOrganization = async (orgId: string) => {
        if (!window.confirm('您确定要删除这条经历吗？此操作不可撤销。')) return;
        setIsSubmitting(true); 
        try {
            const res = await deleteOrganizationById(orgId);
            if (res.code === 200 && res.data) {
                setOrganizations(res.data);
            } else {
                throw new Error(res.message || '删除失败');
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div style={styles.centerMessage}>加载中...</div>;
    if (error) return <div style={{...styles.centerMessage, color: 'red'}}>{error}</div>;
    if (!profileUser) return <div style={styles.centerMessage}>未找到该用户。</div>;

    return (
        <main style={styles.mainContent}>
            <div style={styles.leftColumn}>
                <UserInfo
                    user={profileUser}
                    isOwnProfile={isOwnProfile}
                    isFollowing={isFollowing}
                    isTogglingFollow={isTogglingFollow}
                    onFollowToggle={handleFollowToggle}
                />
                <Contacts 
                    contacts={contacts} 
                    isOwnProfile={isOwnProfile}
                    editingContactId={editingContactId}
                    onEditClick={handleEditContactClick}
                    isAdding={isAddingContact}
                    onAddClick={() => {setIsAddingContact(true); setEditingContactId(null); setEditFormData({ type: '', data: '' });}}
                    onDeleteContact={handleDeleteContact}
                    editFormData={editFormData}
                    isSubmitting={isSubmitting}
                    onEditFormChange={handleEditFormChange}
                    onSave={handleSaveContact}
                    onCancel={handleCancelEdit}
                />
            </div>
            <div style={styles.rightColumn}>
                <div style={styles.tabContainer}>
                    <button 
                        style={activeTab === 'organizations' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('organizations')}
                    >
                        组织与经历
                    </button>
                    <button 
                        style={activeTab === 'posts' ? styles.activeTabButton : styles.tabButton}
                        onClick={() => setActiveTab('posts')}
                    >
                        动态
                    </button>
                    {/* 更改: 只有当是用户自己的主页时，才渲染“最近浏览”按钮 */}
                    {isOwnProfile && (
                        <button 
                            style={activeTab === 'recent' ? styles.activeTabButton : styles.tabButton}
                            onClick={() => setActiveTab('recent')}
                        >
                            最近浏览
                        </button>
                    )}
                </div>
                
                {activeTab === 'organizations' && (
                    <Organizations 
                        orgs={organizations} 
                        isOwnProfile={isOwnProfile} 
                        onDelete={handleDeleteOrganization}
                    />
                )}
                {activeTab === 'posts' && (
                    <Posts 
                        posts={posts}
                        isOwnProfile={isOwnProfile}
                        hasMore={hasMore}
                        isLoadingMore={isLoadMoreLoading}
                        onLoadMore={handleLoadMorePosts}
                    />
                )}
                {activeTab === 'recent' && (
                    <RecentViews 
                        isLoading={isRecentViewLoading}
                        posts={recentViewPosts}
                        users={recentViewUsers}
                    />
                )}
            </div>
        </main>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    mainContent: { maxWidth: '1200px', margin: '20px auto', display: 'flex', gap: '20px', alignItems: 'flex-start' },
    leftColumn: { flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '20px' },
    rightColumn: { flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' },
    centerMessage: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
    tabContainer: {
        display: 'flex',
        gap: '10px',
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    tabButton: {
        border: 'none',
        background: 'none',
        padding: '10px 15px',
        fontSize: '16px',
        color: '#666',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background-color 0.2s, color 0.2s',
    },
    activeTabButton: {
        border: 'none',
        padding: '10px 15px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background-color 0.2s, color 0.2s',
        backgroundColor: '#eef2ff',
        color: '#4f46e5',
        fontWeight: '600',
    }
};

export default ProfilePage;