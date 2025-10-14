// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaTrash, FaEdit } from 'react-icons/fa';
import type { OutletContextType } from '@/layouts/RootLayout';

import { getUserById } from '@/api/user';
import { getContactByUserId , deleteContactById ,updateContactById ,addContact } from '@/api/contact';
// 1. Import deleteOrganizationById
import { getOrganizationByUserId, deleteOrganizationById } from '@/api/organization';
import { checkFollowStatus, follow, unfollow ,} from '@/api/follow';

import type { UserData, ContactData, OrganizationData, ContactRequest, AddContactRequest} from '@/models';


// --- UserInfo Sub-component (No changes) ---
interface UserInfoProps {
  user: UserData;
  isOwnProfile: boolean;
  isFollowing: boolean;
  isTogglingFollow: boolean;
  onFollowToggle: () => void;
}
const UserInfo: React.FC<UserInfoProps> = ({ user, isOwnProfile, isFollowing, isTogglingFollow, onFollowToggle }) => {
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [isEditActive, setIsEditActive] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const editButtonStyle = {
        ...styles.editButton,
        ...(isEditHovered && styles.editButtonHover),
        ...(isEditActive && styles.editButtonActive),
    };

    
    return (
        <div style={styles.card}>
            <img src={user.icon || '/default-avatar.png'} alt={user.username} style={styles.profileAvatar} />
            <h2 style={styles.username}>{user.username}</h2>
            <p style={styles.introduction}>{user.introduction || '这位用户很神秘，什么也没留下...'}</p>
            <div style={styles.stats}>
                <Link to={`/profile/${user.id}/follows?tab=following`} style={styles.statLink}>
                    <span><strong>{user.followingCount}</strong> 关注</span>
                </Link>
                <Link to={`/profile/${user.id}/follows?tab=followers`} style={styles.statLink}>
                    <span><strong>{user.followerCount}</strong> 粉丝</span>
                </Link>
            </div>
            {isOwnProfile ? (
                <Link 
                    to="/profile/edit" 
                    style={editButtonStyle}
                    onMouseEnter={() => setIsEditHovered(true)}
                    onMouseLeave={() => { setIsEditHovered(false); setIsEditActive(false); }}
                    onMouseDown={() => setIsEditActive(true)}
                    onMouseUp={() => setIsEditActive(false)}
                >
                    编辑个人资料
                </Link>
            ) : (
                <button
                    style={isFollowing ? styles.followingButton : styles.followButton}
                    onClick={onFollowToggle}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={isTogglingFollow}
                >
                    {isTogglingFollow 
                        ? '处理中...' 
                        : (isFollowing ? (isHovering ? '取消关注' : '已关注') : '关注')
                    }
                </button>
            )}
        </div>
    );
};

// --- Organizations Sub-component (UPDATED) ---
interface OrganizationsProps {
  orgs: OrganizationData[];
  isOwnProfile: boolean;
  onDelete: (id: string) => void; // 2. Add onDelete prop
}
const Organizations: React.FC<OrganizationsProps> = ({ orgs, isOwnProfile, onDelete }) => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>组织与经历</h3>
        {isOwnProfile && <Link to="/organization/add" style={styles.addButton} title="添加">+</Link>}
      </div>
      {orgs.length > 0 ? orgs.map((org, index) => (
        <div key={org.id} style={{ ...styles.orgItem, ...(index === orgs.length - 1 ? styles.orgItemLast : {}) }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h4 style={styles.orgTitle}>{org.name} - {org.position}</h4>
                {isOwnProfile && (
                    // 3. Add a div to hold both icons
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Link to={`/organization/edit/${org.id}`} style={styles.editIcon} title="编辑">
                            <FaEdit />
                        </Link>
                        <button onClick={() => onDelete(org.id)} style={styles.deleteButton} title="删除">
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>
          <div style={styles.orgMeta}>
            <span style={styles.orgLocation}>{org.location || '地点待补充'}</span>
            <span style={styles.dateRange}>{org.startDate} - {org.endDate || '至今'}</span>
          </div>
          <div style={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{org.description}</ReactMarkdown>
          </div>
        </div>
      )) : <p>暂无组织信息</p>}
    </div>
);


// --- Contacts Sub-component (No changes) ---
interface ContactsProps {
  contacts: ContactData[];
  isOwnProfile: boolean;
  editingContactId: string | null;
  onEditClick: (contact: ContactData) => void;
  isAdding: boolean;
  onAddClick: () => void;
  onDeleteContact: (id: string) => void;
  editFormData: Partial<ContactRequest>;
  isSubmitting: boolean;
  onEditFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}
const Contacts: React.FC<ContactsProps> = (props) => {
    return (
    <div style={styles.card}>
        <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>联系方式</h3>
            {props.isOwnProfile && !props.isAdding && !props.editingContactId &&(
                <button onClick={props.onAddClick} style={styles.addButton} title="添加">+</button>
            )}
        </div>
        
        {props.isAdding ? (
            <div style={styles.addForm}>
                <input name="type" placeholder="类型 (例如: GitHub)" value={props.editFormData.type || ''} onChange={props.onEditFormChange} style={styles.addInput} />
                <input name="data" placeholder="数据 (例如: https://github.com/username)" value={props.editFormData.data || ''} onChange={props.onEditFormChange} style={styles.addInput} />
                <div style={styles.addFormButtons}>
                    <button onClick={props.onCancel} style={styles.cancelButton}>取消</button>
                    <button onClick={props.onSave} disabled={props.isSubmitting} style={styles.saveButton}>{props.isSubmitting ? '保存中...' : '保存'}</button>
                </div>
            </div>
        ) : (
        props.contacts.length > 0 ? (
            <div style={styles.contactContainer}>
            {props.contacts.map(contact => (
                <div key={contact.id} style={styles.contactItem}>
                { props.editingContactId === contact.id ? (
                    <div style={{...styles.addForm, width: '100%'}}>
                        <input name="type" defaultValue={contact.type} onChange={props.onEditFormChange} style={styles.addInput} />
                        <input name="data" defaultValue={contact.data} onChange={props.onEditFormChange} style={styles.addInput} />
                        <div style={styles.addFormButtons}>
                            <button onClick={props.onCancel} style={styles.cancelButton}>取消</button>
                            <button onClick={props.onSave} disabled={props.isSubmitting} style={styles.saveButton}>{props.isSubmitting ? '保存中...' : '保存'}</button>
                        </div>
                    </div>
                ) : (
                    <>
                    <span><strong>{contact.type}:</strong> {contact.data}</span>
                    {props.isOwnProfile && (
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button onClick={() => props.onEditClick(contact)} style={styles.editIcon} title="编辑"><FaEdit /></button>
                            <button onClick={() => props.onDeleteContact(contact.id)} style={styles.deleteButton} title="删除"><FaTrash /></button>
                        </div>
                    )}
                    </>
                )}
                </div>
            ))}
            </div>
        ) : <p>暂无联系信息</p>
        )}
    </div>
    );
};


// --- Main ProfilePage Component (UPDATED) ---
const ProfilePage: React.FC = () => {
    const { userId: paramId } = useParams<{ userId: string }>();
    const { currentUser } = useOutletContext<OutletContextType>();
    
    // States
    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    const [contacts, setContacts] = useState<ContactData[]>([]);
    const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
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

    // Data Fetching Effect
    useEffect(() => {
        if (!userIdToFetch) {
            setError('无法确定要加载的用户。');
            setIsLoading(false);
            return;
        }
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [userRes, contactRes, orgRes] = await Promise.all([
                    getUserById(userIdToFetch),
                    getContactByUserId(userIdToFetch),
                    getOrganizationByUserId(userIdToFetch),
                ]);
                if (userRes.code === 200 && userRes.data) setProfileUser(userRes.data);
                else throw new Error('获取用户信息失败');
                if (contactRes.code === 200 && contactRes.data) setContacts(contactRes.data);
                else throw new Error('获取联系方式失败');
                if (orgRes.code === 200 && orgRes.data) setOrganizations(orgRes.data);
                else throw new Error('获取组织信息失败');

                if (currentUser && userIdToFetch !== currentUser.id) {
                    const followStatusRes = await checkFollowStatus(userIdToFetch);
                    if (followStatusRes.code === 200) {
                        setIsFollowing(followStatusRes.data);
                    }
                }
            } catch (err: any) {
                setError(err.message || '加载页面时出错');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [userIdToFetch, currentUser]);

    // Handlers
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
        setIsAddingContact(false); // 确保新增表单是关闭的
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
                handleCancelEdit(); // 保存成功后重置所有状态
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
      // 弹出确认框
      if (!window.confirm('您确定要删除这个联系方式吗？')) {
        return;
      }
      
      // 可以复用 isSubmitting 状态来显示加载中
      setIsSubmitting(true);
      try {
        const res = await deleteContactById(contactId);
        if (res.code === 200 && res.data) {
          setContacts(res.data); // 后端返回了更新后的列表
        } else {
          throw new Error(res.message || '删除失败');
        }
      } catch (err: any) {
        alert(err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    // 4. Add the delete handler for organizations
    const handleDeleteOrganization = async (orgId: string) => {
        if (!window.confirm('您确定要删除这条经历吗？此操作不可撤销。')) {
            return;
        }
        // You can use a dedicated loading state or reuse `isSubmitting`
        setIsSubmitting(true); 
        try {
            const res = await deleteOrganizationById(orgId);
            if (res.code === 200 && res.data) {
                setOrganizations(res.data); // Update the list with the response
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
                {/* 5. Pass the new handler to the Organizations component */}
                <Organizations 
                    orgs={organizations} 
                    isOwnProfile={isOwnProfile} 
                    onDelete={handleDeleteOrganization}
                />
            </div>
        </main>
    );
};

// --- Styles (UPDATED) ---
const styles: { [key: string]: React.CSSProperties } = {
    editIcon: {
        background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px',
        display: 'flex', alignItems: 'center', padding: '5px', transition: 'color 0.2s', textDecoration: 'none'
    },
    // ... all other styles from your previous version ...
    mainContent: { maxWidth: '1200px', margin: '20px auto', display: 'flex', gap: '20px', alignItems: 'flex-start' },
    leftColumn: { flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '20px' },
    rightColumn: { flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '15px 20px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px' },
    cardTitle: { margin: 0, fontSize: '18px' },
    addForm: { display: 'flex', flexDirection: 'column', gap: '10px' },
    addInput: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    addFormButtons: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
    saveButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    cancelButton: { border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    editButton: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9', cursor: 'pointer', display: 'block', textAlign: 'center', textDecoration: 'none', color: '#333', boxSizing: 'border-box', transition: 'background-color 0.2s, box-shadow 0.2s' },
    editButtonHover: { backgroundColor: '#efefef' },
    editButtonActive: { backgroundColor: '#e9e9e9', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)' },
    followButton: { width: '100%', padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'background-color 0.2s' },
    followingButton: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f0f0f0', color: '#555', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'background-color 0.2s, color 0.2s' },
    orgItem: { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' },
    orgItemLast: { marginBottom: 0, paddingBottom: 0, borderBottom: 'none' },
    orgTitle: { margin: '0 0 8px 0', fontSize: '16px' },
    orgMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#888', marginBottom: '10px' },
    orgLocation: {},
    dateRange: {},
    markdownContent: { color: '#333', fontSize: '14px', lineHeight: 1.7 },
    contactContainer: { display: 'flex', flexDirection: 'column' },
    contactItem: { flex: '1 1 100%', fontSize: '14px', lineHeight: 1.6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' },
    deleteButton: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px', borderRadius: '50%' },
    profileAvatar: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', display: 'block', border: '4px solid #f0f0f0' },
    username: { textAlign: 'center', margin: '0 0 10px 0' },
    introduction: { textAlign: 'center', color: '#666', marginBottom: '20px' },
    stats: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' },
    addButton: { border: 'none', backgroundColor: 'transparent', fontSize: '24px', cursor: 'pointer', color: '#4f46e5', textDecoration: 'none' },
    centerMessage: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
    statLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
};

export default ProfilePage;