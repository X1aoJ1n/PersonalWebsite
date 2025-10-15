// src/pages/PostCreatePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '@/api/post';
import type { AddPostRequest } from '@/models';

const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // 1. 在初始状态中加入 preview 字段
  const [formData, setFormData] = useState<AddPostRequest>({ title: '', preview: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      setError('标题和内容不能为空！');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await createPost(formData);
      if (res.code === 200 && res.data) {
        alert('发布成功！');
        navigate(`/post/${res.data.id}`);
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>创作新帖子</h1>
        <div style={styles.inputGroup}>
          <label>标题</label>
          <input name="title" value={formData.title} onChange={handleChange} style={styles.input} />
        </div>
        
        {/* 2. 添加帖子预览的输入框 */}
        <div style={styles.inputGroup}>
          <label>预览内容 (可选)</label>
          <textarea 
            name="preview" 
            value={formData.preview || ''} 
            onChange={handleChange} 
            style={styles.previewTextarea} 
            rows={3} 
            placeholder="如果不填，会自动截取内容前100个字符作为预览"
          />
        </div>

        <div style={styles.inputGroup}>
          <label>正文 (支持 Markdown)</label>
          <textarea name="content" value={formData.content} onChange={handleChange} style={styles.textarea} rows={50} />
        </div>
        
        {error && <p style={styles.errorText}>{error}</p>}
        
        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/')} style={styles.cancelButton}>取消</button>
          <button onClick={handleSubmit} disabled={isLoading} style={styles.saveButton}>
            {isLoading ? '发布中...' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. 为新的预览输入框添加样式
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { maxWidth: '800px', margin: '40px auto' },
  formContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
  title: { textAlign: 'center', fontSize: '24px', fontWeight: 600, marginBottom: '30px' },
  inputGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', fontSize: '16px', boxSizing: 'border-box' },
  previewTextarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box', lineHeight: 1.6 },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', resize: 'vertical', fontFamily: 'inherit', fontSize: '16px', boxSizing: 'border-box' },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' },
  saveButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  cancelButton: { border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  errorText: { color: 'red', textAlign: 'center' },
};

export default PostCreatePage;