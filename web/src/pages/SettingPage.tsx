import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  changeEmail,
  changePassword,
  getChangePasswordCode,
  getChangeEmailCode
} from '@/api/user';
// ★ 1. 导入您的自定义 Alert 组件
import Alert from '@/components/common/Alert'; // (请确保路径正确)

// --- 状态定义 (保持不变) ---
const initialPassState = {
  code: '',
  password: '',
  confirmPassword: '',
  isLoading: false,
  isCodeLoading: false,
  codeSent: false,
  error: '',
  success: '',
};

const initialEmailState = {
  email: '',
  code: '',
  isLoading: false,
  isCodeLoading: false,
  codeSent: false,
  error: '',
  success: '',
};

type ActiveTab = 'password' | 'email' | 'logout';


const SettingsPage: React.FC = () => {
  const { setCurrentUser } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('password');
  const [passState, setPassState] = useState(initialPassState);
  const [emailState, setEmailState] = useState(initialEmailState);

  // ★ 2. 为 "提示" 弹窗添加 State
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '提示',
    message: '',
    onClose: () => {}, // 之后会覆盖这个回调
  });

  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '请确认',
    message: '',
    onConfirm: () => {}, // 之后会覆盖这个回调
    confirmText: '确认',
    confirmColor: 'primary' as 'primary' | 'danger',
  });

  
  const closeAlert = () => setAlert(s => ({ ...s, isOpen: false }));
  const closeConfirm = () => setConfirm(s => ({ ...s, isOpen: false }));


  // ★ 3. 实际执行退出登录的逻辑 (从 handleLogout 中分离出来)
  const performLogout = (successMessage?: string) => {
    localStorage.removeItem('token');
    if (setCurrentUser) {
      setCurrentUser(null);
    }
    
    // 退出后显示成功提示
    if (successMessage) {
      setAlert({
        isOpen: true,
        title: '操作成功',
        message: successMessage,
        onClose: () => {
          closeAlert();
          navigate('/'); // 在关闭提示后跳转
        },
      });
    } else {
      navigate('/'); // 如果没有消息 (例如改邮箱时)，直接跳转
    }
  };

  // ★ 4. 修改 handleLogout 以使用 "确认" 弹窗
  const handleLogout = () => {
    // 不再调用 window.confirm
    
    // 而是打开 "确认" 弹窗
    setConfirm({
      isOpen: true,
      title: '退出登录',
      message: '您确定要退出登录吗？',
      onConfirm: () => {
        closeConfirm();
        performLogout('您已成功退出登录。'); // ★ 在确认后执行
      },
      confirmText: '退出',
      confirmColor: 'danger', // 使用红色按钮
    });
  };

  // --- (更改密码的函数保持不变) ---
  const handleGetPasswordCode = async () => {
    setPassState(s => ({ ...s, isCodeLoading: true, error: '', success: '' }));
    try {
      const res = await getChangePasswordCode();
      if (res.code === 200) {
        setPassState(s => ({ ...s, codeSent: true, success: '验证码已发送。', isCodeLoading: false }));
      } else {
        setPassState(s => ({ ...s, error: res.message || '发送失败。', isCodeLoading: false }));
      }
    } catch (err) {
      setPassState(s => ({ ...s, error: '发送请求失败。', isCodeLoading: false }));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { code, password, confirmPassword } = passState;
    if (!code || !password || !confirmPassword) {
      setPassState(s => ({ ...s, error: '请填写所有字段。' }));
      return;
    }
    if (password !== confirmPassword) {
      setPassState(s => ({ ...s, error: '两次输入的密码不一致。' }));
      return;
    }
    setPassState(s => ({ ...s, isLoading: true, error: '', success: '' }));
    try {
      const res = await changePassword({ code, password, confirmPassword });
      if (res.code === 200) {
        setPassState({ ...initialPassState, success: '密码更改成功！' }); 
      } else {
        setPassState(s => ({ ...s, error: res.message || '更改失败。', isLoading: false }));
      }
    } catch (err) {
      setPassState(s => ({ ...s, error: '更改请求失败。', isLoading: false }));
    }
  };

  // --- (获取邮箱验证码的函数保持不变) ---
  const handleGetEmailCode = async () => {
    if (!emailState.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailState.email)) {
      setEmailState(s => ({ ...s, error: '请输入有效的邮箱地址。' }));
      return;
    }
    setEmailState(s => ({ ...s, isCodeLoading: true, error: '', success: '' }));
    try {
      const res = await getChangeEmailCode({ email: emailState.email }); 
      if (res.code === 200) {
        setEmailState(s => ({ ...s, codeSent: true, success: '验证码已发送至您的新邮箱。', isCodeLoading: false }));
      } else {
        setEmailState(s => ({ ...s, error: res.message || '发送失败。', isCodeLoading: false }));
      }
    } catch (err) {
      setEmailState(s => ({ ...s, error: '发送请求失败。', isCodeLoading: false }));
    }
  };

  // ★ 5. 修改 handleChangeEmail 以使用 "提示" 弹窗
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailState.code) {
      setEmailState(s => ({ ...s, error: '请输入验证码。' }));
      return;
    }
    setEmailState(s => ({ ...s, isLoading: true, error: '', success: '' }));
    try {
      const res = await changeEmail({ email: emailState.email, code: emailState.code });
      if (res.code === 200) {
        // ★ 不再调用 alert(...)
        // alert('邮箱更改成功！您需要使用新邮箱重新登录。');
        // ★ 不再调用 handleLogout()
        // handleLogout(); 
        
        // ★ 而是打开 "提示" 弹窗，并在其关闭回调中触发 "退出"
        setAlert({
          isOpen: true,
          title: '邮箱更改成功',
          message: '您需要使用新邮箱重新登录。',
          onClose: () => {
            closeAlert();
            // 注意：这里我们直接调用 performLogout，不再需要二次确认
            performLogout(); 
          }
        });
      } else {
        setEmailState(s => ({ ...s, error: res.message || '更改失败。', isLoading: false }));
      }
    } catch (err) {
      setEmailState(s => ({ ...s, error: '更改请求失败。', isLoading: false }));
    }
  };

  return (
    <div style={styles.pageContainer}> 
      <div style={styles.container}>
        <h1 style={styles.title}>账户设置</h1>
        
        <div style={styles.tabContainer}>
          <button 
            style={activeTab === 'password' ? styles.activeTabButton : styles.tabButton} 
            onClick={() => setActiveTab('password')}
          >
            更改密码
          </button>
          <button 
            style={activeTab === 'email' ? styles.activeTabButton : styles.tabButton} 
            onClick={() => setActiveTab('email')}
          >
            更改邮箱
          </button>
          <button 
            style={activeTab === 'logout' ? styles.activeTabButton : styles.tabButton} 
            onClick={() => setActiveTab('logout')}
          >
            退出登录
          </button>
        </div>

        <div style={styles.content}>
          
          {/* --- Tab 1: 更改密码 --- */}
          {activeTab === 'password' && (
            <form style={styles.form} onSubmit={handleChangePassword}>
              {!passState.codeSent ? (
                <div style={styles.actionItem}>
                  <p style={styles.actionText}>获取验证码以更改您的密码。</p>
                  <button type="button" onClick={handleGetPasswordCode} disabled={passState.isCodeLoading} style={styles.buttonSecondary}>
                    {passState.isCodeLoading ? '发送中...' : '获取验证码'}
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="验证码"
                    style={styles.input}
                    value={passState.code}
                    onChange={e => setPassState(s => ({ ...s, code: e.target.value }))}
                    autoComplete="one-time-code"
                  />
                  <input
                    type="password"
                    placeholder="新密码"
                    style={styles.input}
                    value={passState.password}
                    onChange={e => setPassState(s => ({ ...s, password: e.target.value }))}
                    autoComplete="new-password"
                  />
                  <input
                    type="password"
                    placeholder="确认新密码"
                    style={styles.input}
                    value={passState.confirmPassword}
                    onChange={e => setPassState(s => ({ ...s, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                  />
                  <button type="submit" disabled={passState.isLoading} style={styles.buttonPrimary}>
                    {passState.isLoading ? '提交中...' : '确认更改密码'}
                  </button>
                </>
              )}
              {passState.error && <p style={styles.messageError}>{passState.error}</p>}
              {passState.success && <p style={styles.messageSuccess}>{passState.success}</p>}
            </form>
          )}

          {/* --- Tab 2: 更改邮箱 --- */}
          {activeTab === 'email' && (
            <form style={styles.form} onSubmit={handleChangeEmail}>
              <div style={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="请输入新邮箱地址" 
                  style={{ ...styles.input, flex: 1 }} 
                  value={emailState.email} 
                  onChange={e => setEmailState(s => ({ ...s, email: e.target.value, codeSent: false }))} 
                  disabled={emailState.codeSent} 
                    autoComplete="email"
                />
                <button type="button" onClick={handleGetEmailCode} disabled={emailState.isCodeLoading || emailState.codeSent} style={{ ...styles.buttonSecondary, marginLeft: '10px' }}>
                  {emailState.isCodeLoading ? '发送中...' : (emailState.codeSent ? '已发送' : '获取验证码')}
                </button>
              </div>
              {emailState.codeSent && (
                <>
                  <input 
                    type="text" 
                    placeholder="请输入新邮箱收到的验证码" 
                    style={styles.input} 
                    value={emailState.code} 
                    onChange={e => setEmailState(s => ({ ...s, code: e.target.value }))} 
                    autoComplete="one-time-code"
                  />
                  <button type="submit" disabled={emailState.isLoading} style={styles.buttonPrimary}>
                    {emailState.isLoading ? '提交中...' : '确认更改邮箱'}
                  </button>
                </>
              )}
              {emailState.error && <p style={styles.messageError}>{emailState.error}</p>}
              {emailState.success && <p style={styles.messageSuccess}>{emailState.success}</p>}
            </form>
          )}

          {/* --- Tab 3: 退出登录 --- */}
          {activeTab === 'logout' && (
            <div style={styles.actionItem}>
              <p style={styles.actionText}>退出当前登录的账户。</p>
              {/* 这个按钮现在会打开 "确认" 弹窗 */}
              <button onClick={handleLogout} style={styles.logoutButton}>
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ★ 6. 在页面底部渲染弹窗 (它们是 fixed 定位, 放在哪里都行) */}
      
      {/* "提示" 弹窗 (Alert) */}
      <Alert
        isOpen={alert.isOpen}
        title={alert.title}
        onClose={alert.onClose}
      >
        {alert.message}
      </Alert>

      {/* "确认" 弹窗 (Confirm) */}
      <Alert
        isOpen={confirm.isOpen}
        title={confirm.title}
        onClose={closeConfirm} // "取消" 按钮总是调用 closeConfirm
        onConfirm={confirm.onConfirm} // "确认" 按钮调用我们设置的回调
        confirmText={confirm.confirmText}
        cancelText="取消"
        confirmColor={confirm.confirmColor}
      >
        {confirm.message}
      </Alert>

    </div>
  );
};

// --- (样式表 styles 对象保持不变) ---
const styles: { [key: string]: React.CSSProperties } = {
  // --- 1. 从 NotificationPage 复制的样式 ---
  container: { 
    maxWidth: '800px', 
    margin: '0 auto', // pageContainer 已有 40px margin
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
    padding: '20px 30px', 
  },
  title: { 
    margin: '0 0 20px 0', 
    fontSize: '24px', 
    fontWeight: 600, 
  },
  tabContainer: { 
    display: 'flex', 
    gap: '10px', 
    backgroundColor: '#f9fafb', 
    padding: '8px', 
    borderRadius: '8px', 
    marginBottom: '30px', // 增加内容间距
  },
  tabButton: { 
    flex: 1, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '8px', 
    border: 'none', 
    background: 'none', 
    padding: '10px 15px', 
    fontSize: '15px', 
    color: '#6b7280', 
    cursor: 'pointer', 
    borderRadius: '6px', 
    transition: 'background-color 0.2s, color 0.2s', 
    fontWeight: 500, 
  },
  activeTabButton: { 
    flex: 1, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '8px', 
    border: 'none', 
    padding: '10px 15px', 
    fontSize: '15px', 
    cursor: 'pointer', 
    borderRadius: '6px', 
    transition: 'background-color 0.2s, color 0.2s', 
    backgroundColor: '#eef2ff', 
    color: '#4f46e5', 
    fontWeight: '600', 
  },
  content: { 
    padding: '0',
    minHeight: '200px', // 保持最小高度
  },

  // --- 2. SettingsPage 保留的样式 ---
  // 页面外边距
  pageContainer: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  // 表单
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  // 登出 Tab
  actionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
    border: '1px solid #f0f0f0'
  },
  actionText: {
    margin: 0,
    color: '#666',
  },
  // 按钮 (★ 颜色更新)
  buttonPrimary: {
    border: '1px solid #4f46e5', // 匹配激活色
    backgroundColor: '#4f46e5', // 匹配激活色
    color: '#fff',
    padding: '12px 20px', // 使其与 input 高度更协调
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    width: '100%', // 充满表单
  },
  buttonSecondary: {
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    padding: '12px 20px', // 使其与 input 高度更协调
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #fecaca',
    backgroundColor: '#fff7f7',
    color: '#ef4444',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  // 消息
  messageError: {
    color: '#ef4444',
    fontSize: '14px',
    margin: '5px 0 0 0',
  },
  messageSuccess: {
    color: '#22c55e',
    fontSize: '14px',
    margin: '5px 0 0 0',
  }
};

export default SettingsPage;