// src/pages/PostCreatePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '@/api/post';
import { uploadFile } from '@/api/file'; // 确保引入上传函数
import type { AddPostRequest } from '@/models';
import WysiwygEditor from '@/components/WysiwygEditor';

const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  
  // 1. 新增 State，用于存储待上传的文件 Map<blobUrl, File>
  const [localFiles, setLocalFiles] = useState<Map<string, File>>(new Map());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. 实现 onFileAdded 回调，用于接收编辑器传来的新文件
  const handleFileAdded = (file: File, url: string) => {
    setLocalFiles(prev => new Map(prev).set(url, file));
  };
  
  // 3. 重要的内存管理：组件卸载时，释放所有 blob URL
  useEffect(() => {
    return () => {
      localFiles.forEach((_, url) => URL.revokeObjectURL(url));
    };
  }, [localFiles]);

  const extractTextFromHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  // 4. 重写 handleSubmit 函数，加入上传和替换逻辑
  const handleSubmit = async () => {
    if (!title || !content || content === '<p></p>') {
      setError('标题和内容不能为空！');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      let finalContent = content;

      // a. 如果有待上传的本地文件
      if (localFiles.size > 0) {
        console.log('开始上传本地图片...');
        
        // b. 创建所有文件的上传任务 (并行上传)
        const uploadPromises = Array.from(localFiles.entries()).map(async ([localUrl, file]) => {
          const res = await uploadFile(file, 'post_images');
          if (res.code === 200 && res.data) {
            return { localUrl, serverUrl: res.data.fileUrl };
          }
          throw new Error(`文件 ${file.name} 上传失败`);
        });

        // c. 等待所有上传任务完成
        const urlMappings = await Promise.all(uploadPromises);
        
        // d. 将内容中的所有 blob: URL 替换为真实的服务器 URL
        urlMappings.forEach(({ localUrl, serverUrl }) => {
          finalContent = finalContent.replace(new RegExp(localUrl, 'g'), serverUrl);
        });

        console.log('图片上传和URL替换完成！');
      }

      // e. 组装最终的请求数据
      const formData: AddPostRequest = {
        title,
        preview: preview || extractTextFromHtml(finalContent).substring(0, 100),
        content: finalContent, // 使用处理过的内容
      };

      // f. 提交帖子
      const res = await createPost(formData);
      if (res.code === 200 && res.data) {
        alert('发布成功！');
        // 清理本地文件映射
        localFiles.forEach((_, url) => URL.revokeObjectURL(url));
        setLocalFiles(new Map());
        navigate(`/post/${res.data.id}`);
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
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
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label>预览内容 (可选)</label>
          <textarea 
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            style={styles.previewTextarea} 
            rows={3} 
            placeholder="如果不填，会自动从正文中提取纯文本作为预览"
          />
        </div>

        <div style={styles.inputGroup}>
          <label>正文</label>
          <WysiwygEditor 
            value={content} 
            onChange={setContent} 
            onFileAdded={handleFileAdded} // 传递回调函数
          />
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

// 样式
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { maxWidth: '1000px', margin: '40px auto' },
  formContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
  title: { textAlign: 'center', fontSize: '24px', fontWeight: 600, marginBottom: '30px' },
  inputGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', fontSize: '16px', boxSizing: 'border-box' },
  previewTextarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box', lineHeight: 1.6 },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' },
  saveButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  cancelButton: { border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  errorText: { color: 'red', textAlign: 'center' },
};

export default PostCreatePage;