import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UserData } from '@/models';

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

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '15px 20px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    profileAvatar: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', display: 'block', border: '4px solid #f0f0f0' },
    username: { textAlign: 'center', margin: '0 0 10px 0' },
    introduction: { textAlign: 'center', color: '#666', marginBottom: '20px' },
    stats: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' },
    statLink: { textDecoration: 'none', color: 'inherit' },
    editButton: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9', cursor: 'pointer', display: 'block', textAlign: 'center', textDecoration: 'none', color: '#333', boxSizing: 'border-box', transition: 'background-color 0.2s, box-shadow 0.2s' },
    editButtonHover: { backgroundColor: '#efefef' },
    editButtonActive: { backgroundColor: '#e9e9e9', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)' },
    followButton: { width: '100%', padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'background-color 0.2s' },
    followingButton: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f0f0f0', color: '#555', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'background-color 0.2s, color 0.2s' },
};

export default UserInfo;