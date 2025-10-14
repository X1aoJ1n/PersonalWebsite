import React, { useState, useEffect } from 'react';

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder: string;
  cta: string; // Call to Action text, e.g., "发表评论"
  // 新增：支持编辑模式的 props
  initialText?: string;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, placeholder, cta, initialText, onCancel }) => {
  // 修改：用 initialText 初始化 state
  const [text, setText] = useState(initialText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 确保在 initialText 变化时更新内部状态（用于切换编辑目标）
  useEffect(() => {
    setText(initialText || '');
  }, [initialText]);

  const handleSubmit = async () => {
    // 增加 !text.trim() 的判断
    if (!text.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(text);
      // 编辑模式下不清空文本，由父组件控制表单的显示/隐藏
      if (!initialText) {
        setText('');
      }
    } catch (error) {
      console.error("提交失败:", error);
      alert('提交失败，请稍后再试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.commentForm}>
      <textarea
        style={styles.textarea}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      {/* 新增：显示提交和取消按钮的容器 */}
      <div style={styles.buttonGroup}>
        {onCancel && (
          <button onClick={onCancel} style={styles.cancelButton}>
            取消
          </button>
        )}
        <button onClick={handleSubmit} disabled={isSubmitting || !text.trim()} style={styles.submitButton}>
          {isSubmitting ? '提交中...' : cta}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  commentForm: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', margin: '15px 0' },
  textarea: { width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '10px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
  // 新增样式
  buttonGroup: { display: 'flex', gap: '10px' }, 
  submitButton: { border: 'none', backgroundColor: '#4f46e5', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  // 新增样式
  cancelButton: { border: '1px solid #ddd', backgroundColor: '#f0f0f0', color: '#333', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
};

export default CommentForm;