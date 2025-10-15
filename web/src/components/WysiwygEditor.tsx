// src/components/WysiwygEditor.tsx
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

interface WysiwygEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  // 新增一个回调函数，用于将新文件通知给父组件
  onFileAdded: (file: File, url: string) => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, onFileAdded }) => {
  
  // 辅助函数：只负责创建本地预览和插入
  const handleFileInterception = (file: File, editor: Editor) => {
    // 1. 创建本地预览 URL
    const localUrl = URL.createObjectURL(file);
    
    // 2. 通知父组件，将文件和其 blob URL 暂存起来
    onFileAdded(file, localUrl);
    
    // 3. 在编辑器中插入这张本地预览图片
    editor.chain().focus().setImage({ src: localUrl, alt: file.name }).run();
  };

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: 'min-height: 400px; border: 1px solid #ddd; padding: 10px; border-radius: 6px; outline: none; line-height: 1.6;',
      },
      handlePaste: (_view, event) => {
        if (!editor) return false;
        const items = event.clipboardData?.items;
        if (!items) return false;
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            const file = items[i].getAsFile();
            if (file) {
              handleFileInterception(file, editor);
              return true;
            }
          }
        }
        return false;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!editor || moved) return false;
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        
        for (let i = 0; i < files.length; i++) {
          if (files[i].type.startsWith('image/')) {
            event.preventDefault();
            handleFileInterception(files[i], editor);
            return true;
          }
        }
        return false;
      },
    },
  });

  return <EditorContent editor={editor} />;
};

export default WysiwygEditor;