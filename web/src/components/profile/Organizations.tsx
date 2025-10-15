import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaTrash, FaEdit } from 'react-icons/fa';
import type { OrganizationData } from '@/models';

interface OrganizationsProps {
  orgs: OrganizationData[];
  isOwnProfile: boolean;
  onDelete: (id: string) => void;
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

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '15px 20px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px' },
    cardTitle: { margin: 0, fontSize: '18px' },
    addButton: { border: 'none', backgroundColor: 'transparent', fontSize: '24px', cursor: 'pointer', color: '#4f46e5', textDecoration: 'none' },
    orgItem: { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' },
    orgItemLast: { marginBottom: 0, paddingBottom: 0, borderBottom: 'none' },
    orgTitle: { margin: '0 0 8px 0', fontSize: '16px' },
    orgMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#888', marginBottom: '10px' },
    orgLocation: {},
    dateRange: {},
    markdownContent: { color: '#333', fontSize: '14px', lineHeight: 1.7 },
    editIcon: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px', transition: 'color 0.2s', textDecoration: 'none' },
    deleteButton: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px', borderRadius: '50%' },
};

export default Organizations;