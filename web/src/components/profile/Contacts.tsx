import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import type { ContactData, ContactRequest } from '@/models';

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

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '15px 20px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px' },
    cardTitle: { margin: 0, fontSize: '18px' },
    addButton: { border: 'none', backgroundColor: 'transparent', fontSize: '24px', cursor: 'pointer', color: '#4f46e5', textDecoration: 'none' },
    addForm: { display: 'flex', flexDirection: 'column', gap: '10px' },
    addInput: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    addFormButtons: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
    saveButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    cancelButton: { border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    contactContainer: { display: 'flex', flexDirection: 'column' },
    contactItem: { flex: '1 1 100%', fontSize: '14px', lineHeight: 1.6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' },
    editIcon: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px' },
    deleteButton: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', padding: '5px' },
};

export default Contacts;