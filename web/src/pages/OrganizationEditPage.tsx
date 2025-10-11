// src/pages/OrganizationEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { getOrganizationById, addOrganization, updateOrganizationById } from '@/api/organization';
import type { OutletContextType } from '@/layouts/RootLayout';
import type { OrganizationRequest, AddOrganizationRequest } from '@/models';

const OrganizationEditPage: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<OutletContextType>();

  const [formData, setFormData] = useState<Partial<OrganizationRequest>>({
    type: '工作', name: '', position: '', startDate: '', endDate: '', description: '', location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!orgId;

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (isEditMode) {
      getOrganizationById(orgId)
        .then(res => {
          if (res.code === 200 && res.data) {
            setFormData({
              ...res.data,
              startDate: res.data.startDate || '',
              endDate: res.data.endDate || '',
            });
          } else {
            throw new Error(res.message || '加载组织信息失败');
          }
        })
        .catch((err: any) => setError(err.message))
        .finally(() => setIsFetching(false));
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, orgId, currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiCall = isEditMode
        ? updateOrganizationById(formData as OrganizationRequest)
        : addOrganization(formData as AddOrganizationRequest);
      
      const res = await apiCall;
      if (res.code === 200) {
        alert(isEditMode ? '修改成功！' : '添加成功！');
        navigate('/profile');
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div style={{textAlign: 'center', padding: '50px'}}>加载中...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>{isEditMode ? '修改组织/经历' : '添加组织/经历'}</h1>
        
        <div style={styles.inputGroup}>
          <label>类型 (如: 工作, 教育, 项目)</label>
          <input name="type" value={formData.type || ''} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label>组织/学校/项目名称</label>
          <input name="name" value={formData.name || ''} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputGroup}>
          <label>职位/学位</label>
          <input name="position" value={formData.position || ''} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputGroup}>
          <label>地点</label>
          <input name="location" value={formData.location || ''} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.dateGroup}>
          <div style={styles.inputGroup}>
            <label>开始日期</label>
            <input name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label>结束日期 (留空表示至今)</label>
            <input name="endDate" type="date" value={formData.endDate || ''} onChange={handleChange} style={styles.input} />
          </div>
        </div>
        <div style={styles.inputGroup}>
          <label>描述 (支持 Markdown)</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} style={styles.textarea} rows={5} />
        </div>
        
        {error && <p style={styles.errorText}>{error}</p>}
        
        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/profile')} style={styles.cancelButton}>取消</button>
          <button onClick={handleSubmit} disabled={isLoading} style={styles.saveButton}>
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};


const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { maxWidth: '800px', margin: '40px auto' },
  formContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'},
  title: { textAlign: 'center', fontSize: '24px', fontWeight: 600, marginBottom: '30px' },
  inputGroup: { marginBottom: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
  dateGroup: { display: 'flex', gap: '20px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', fontSize: '16px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', resize: 'vertical', fontFamily: 'inherit', fontSize: '16px', boxSizing: 'border-box' },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' },
  saveButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  cancelButton: { border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  errorText: { color: 'red', textAlign: 'center' },
};

export default OrganizationEditPage;