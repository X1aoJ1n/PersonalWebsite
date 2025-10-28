import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout'; // 1. 已有正确的 ContextType 导入

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
import RecentViews from '@/components/profile/RecentViews';
import Alert from '@/components/common/Alert'; 
// 2. ★ 移除 ★：不再需要单独导入 toast
// import { toast } from '@/utils/toast'; 

const POSTS_PER_PAGE = 10;

interface AlertConfig {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onConfirm: () => void;
    confirmColor?: 'primary' | 'danger';
}

const ProfilePage: React.FC = () => {
    const { userId: paramId } = useParams<{ userId: string }>();
    // 3. ★ 修正 ★：从 context 中解构出 showToast
    const { currentUser, showToast } = useOutletContext<OutletContextType>();
    
    // --- States (保持不变) ---
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
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        isOpen: false,
        title: '',
        children: null,
        onConfirm: () => {},
        confirmColor: 'primary',
    });

    const userIdToFetch = paramId || currentUser?.id;
    const isOwnProfile = !!currentUser && currentUser.id === userIdToFetch;

    // --- Effects (保持不变) ---
    
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
            setHasMore(true);
            try {
                // ... (Promise.all 逻辑保持不变)
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
                    if (postRes.data.length < POSTS_PER_PAGE) setHasMore(false);
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

    // “最近浏览” 延迟加载 Effect
    useEffect(() => {
        if (activeTab === 'recent' && !recentViewFetched && userIdToFetch) {
            const fetchRecentData = async () => {
                setIsRecentViewLoading(true);
                try {
                    // ... (Promise.all 逻辑保持不变)
                    const [postRes, userRes] = await Promise.all([
                        getRecentViewPost({ pageNum: 1, pageSize: 5 }), 
                        getRecentViewUser({ pageNum: 1, pageSize: 5 })
                    ]);
                    if (postRes.code === 200 && postRes.data) setRecentViewPosts(postRes.data);
                    if (userRes.code === 200 && userRes.data) setRecentViewUsers(userRes.data);
                    setRecentViewFetched(true);
                } catch (err) {
                    console.error("获取最近浏览数据失败:", err);
                } finally {
                    setIsRecentViewLoading(false);
                }
            };
            fetchRecentData();
        }
    }, [activeTab, recentViewFetched, userIdToFetch]);

    
    const handleLoadMorePosts = async () => {
        if (isLoadMoreLoading || !hasMore || !userIdToFetch) return;
        setIsLoadMoreLoading(true);
        // ... (省略 API 调用, 保持不变) ...
        try {
            const res = await getUserPost({ id: userIdToFetch, pageNum: currentPageNum, pageSize: POSTS_PER_PAGE });
            if (res.code === 200 && res.data) {
                setPosts(prevPosts => [...prevPosts, ...res.data]);
                setCurrentPageNum(prevPage => prevPage + 1);
                if (res.data.length < POSTS_PER_PAGE) setHasMore(false);
            } else {
                throw new Error(res.message || '获取更多帖子失败');
            }
        } catch (err: any) {
            console.error(err);
            showToast(err.message || '加载失败', 'error');
        } finally {
            setIsLoadMoreLoading(false);
        }
    };

    // 关注/取关
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
            showToast('操作失败，请稍后重试', 'error');
        } finally {
            setIsTogglingFollow(false);
        }
    };

    // --- Contact Handlers ---
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
                showToast(isEditing ? '更新成功' : '添加成功', 'success');
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            showToast(err.message || '保存失败', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 执行删除联系人的函数
    const performDeleteContact = async (contactId: string) => {
        closeAlert();
        setIsSubmitting(true);
        try {
            const res = await deleteContactById(contactId);
            if (res.code === 200 && res.data) {
                setContacts(res.data);
                showToast('删除成功', 'success');
            } else {
                throw new Error(res.message || '删除失败');
            }
        } catch (err: any) {
            showToast(err.message || '删除失败', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. ★ 修正 ★：点击删除联系人时，设置 children 和 confirmColor
    const handleDeleteContact = (contactId: string) => {
        setAlertConfig({
            isOpen: true,
            title: '删除联系方式',
            children: '您确定要删除这个联系方式吗？', // 之前是 'message'
            onConfirm: () => performDeleteContact(contactId),
            confirmColor: 'danger', // 设置为危险色
        });
    };

    // --- Organization Handlers ---

    // 执行删除组织的函数
    const performDeleteOrganization = async (orgId: string) => {
        closeAlert();
        setIsSubmitting(true); 
        try {
            const res = await deleteOrganizationById(orgId);
            if (res.code === 200 && res.data) {
                setOrganizations(res.data);
                showToast('删除成功', 'success');
            } else {
                throw new Error(res.message || '删除失败');
            }
        } catch (err: any) {
            showToast(err.message || '删除失败', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // 4. ★ 修正 ★：点击删除组织时，设置 children 和 confirmColor
    const handleDeleteOrganization = (orgId: string) => {
        setAlertConfig({
            isOpen: true,
            title: '删除经历',
            children: '您确定要删除这条经历吗？此操作不可撤销。', // 之前是 'message'
            onConfirm: () => performDeleteOrganization(orgId),
            confirmColor: 'danger', // 设置为危险色
        });
    };

    // 关闭 Alert 的辅助函数
    const closeAlert = () => {
        setAlertConfig({ ...alertConfig, isOpen: false });
    };

    // --- Render ---
    if (isLoading) return <div style={styles.centerMessage}>加载中...</div>;
    if (error) return <div style={{...styles.centerMessage, color: 'red'}}>{error}</div>;
    if (!profileUser) return <div style={styles.centerMessage}>未找到该用户。</div>;

    return (
        <main style={styles.mainContent}>
            {/* 左侧栏 */}
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
            
            {/* 右侧栏 */}
            <div style={styles.rightColumn}>
                {/* Tabs */}
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
                    {isOwnProfile && (
                        <button 
                            style={activeTab === 'recent' ? styles.activeTabButton : styles.tabButton}
                            onClick={() => setActiveTab('recent')}
                        >
                            最近浏览
                        </button>
                    )}
                </div>
                
                {/* Tab 内容 */}
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

            {/* 5. ★ 修正 ★：渲染 Alert 组件 */}
            <Alert
                isOpen={alertConfig.isOpen}
                onClose={closeAlert}
                onConfirm={alertConfig.onConfirm}
                title={alertConfig.title}
                confirmColor={alertConfig.confirmColor} // 传递 color
            >
                {alertConfig.children} {/* 将内容作为 children 传递 */}
            </Alert>
        </main>
    );
};

// 样式 (保持不变)
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