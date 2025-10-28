// src/pages/EditProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import type { OutletContextType } from '@/layouts/RootLayout';
import { updateUserById, changeIcon } from '@/api/user';
import { uploadFile } from '@/api/file';

// --- Cropping helper function (modified from react-image-crop official examples) ---
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<File | null> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.resolve(null);
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      const file = new File([blob], 'avatar.png', { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
}
// --- End of helper function ---


const EditProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, showToast } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setIntroduction(currentUser.introduction || '');
    } else {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setShowCropModal(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await updateUserById({ username, introduction });
      if (res.code === 200 && res.data) {
        setCurrentUser(res.data);
        
        showToast('您的个人资料已更新。', 'success');
        navigate('/profile');

      } else {
        throw new Error(res.message || '更新失败');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsSaving(true);
    try {
      const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
      if (!croppedFile) throw new Error('剪裁图片失败');

      const uploadRes = await uploadFile(croppedFile, 'ICON');
      if (uploadRes.code !== 200 || !uploadRes.data?.fileUrl) {
        throw new Error(uploadRes.message || '上传头像失败');
      }

      const newIconUrl = uploadRes.data.fileUrl;
      const changeIconRes = await changeIcon(newIconUrl);
      if (changeIconRes.code === 200 && changeIconRes.data) {
        setCurrentUser(changeIconRes.data);
        setShowCropModal(false);
        setImgSrc('');
        
        showToast('您的头像已更新。', 'success');

      } else {
        throw new Error(changeIconRes.message || '设置头像失败');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop({ unit: '%', width: 90 }, 1, width, height);
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }

  if (!currentUser) return null;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        {/* **MODIFICATION 1: Apply the new style to the h1 tag** */}
        <h1 style={styles.title}>编辑个人资料</h1>

        <div style={styles.avatarSection}>
          <img src={currentUser.icon || '/default-avatar.png'} alt="avatar" style={styles.avatar} />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button onClick={() => fileInputRef.current?.click()} style={styles.changeAvatarButton}>更换头像</button>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="username">用户名</label>
          <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="introduction">个人简介</label>
          <textarea id="introduction" value={introduction} onChange={e => setIntroduction(e.target.value)} style={styles.textarea} rows={4} />
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/profile')} style={styles.cancelButton}>取消</button>
          <button onClick={handleSaveChanges} disabled={isSaving} style={styles.saveButton}>
            {isSaving ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>

      {/* Cropping Modal */}
      {showCropModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>剪裁头像</h2>
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop preview" />
              </ReactCrop>
            )}
            <div style={styles.buttonGroup}>
              <button onClick={() => setShowCropModal(false)} style={styles.cancelButton}>取消</button>
              <button onClick={handleUploadCroppedImage} disabled={isSaving} style={styles.saveButton}>
                {isSaving ? '上传中...' : '剪裁并上传'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// src/pages/EditProfilePage.tsx -> styles object

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: '800px',
    margin: '40px auto',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '30px',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
  },
  changeAvatarButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#4f46e5',
    cursor: 'pointer',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginTop: '5px',
    fontSize: '16px', // **MODIFICATION HERE**
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginTop: '5px',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '16px', // **MODIFICATION HERE**
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px',
  },
  saveButton: {
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelButton: {
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    color: '#333',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
  },
};

export default EditProfilePage;