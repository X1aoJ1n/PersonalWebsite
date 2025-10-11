// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { OutletContextType } from '@/layouts/RootLayout';

// 引入API接口和数据类型 (注意 getRegisterCode 已重命名为 getVerificationCode)
import { loginByPassword, loginByCode, register, getVerificationCode } from '@/api/auth';
import type { LoginData } from '@/models';

const AuthPage: React.FC = () => {
  const { setCurrentUser } = useOutletContext<OutletContextType>();

  const [isLoginView, setIsLoginView] = useState(true);
  // --- 新增 state: 用于管理登录方式 ---
  const [loginMethod, setLoginMethod] = useState<'password' | 'code'>('password');
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSuccess = (data: LoginData) => {
    localStorage.setItem('token', data.token);
    setCurrentUser(data);
    navigate('/');
  };

  const handleGetCode = async () => {
    if (!formData.email) {
      setError('请输入您的邮箱地址');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await getVerificationCode(formData.email); // 使用新的函数名
      if (res.code === 200) {
        setIsCodeSent(true);
        alert('验证码已发送，请检查您的邮箱！');
      } else {
        throw new Error(res.message || '获取验证码失败');
      }
    } catch (err: any) {
      setError(err.message || '获取验证码时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 更新: handleSubmit 以处理不同登录方式 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let res;
      if (isLoginView) {
        // --- 登录逻辑 ---
        if (loginMethod === 'password') {
          res = await loginByPassword({ email: formData.email, password: formData.password });
        } else { // 验证码登录
          // 接口需要 {email, password}，我们将 code 放入 password 字段
          res = await loginByCode({ email: formData.email, password: formData.code });
        }
        if (res.code === 200 && res.data) {
          handleAuthSuccess(res.data);
        } else {
          throw new Error(res.message || '登录失败');
        }
      } else {
        // --- 注册逻辑 (保持不变) ---
        if (formData.password !== formData.confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }
        res = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          code: formData.code,
        });
        if (res.code === 200 && res.data) {
          alert('注册成功，将自动为您登录！');
          handleAuthSuccess(res.data);
        } else {
          throw new Error(res.message || '注册失败');
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{isLoginView ? '登录' : '注册'}</h2>
        
        {/* --- 新增: 仅在登录视图下显示登录方式切换 --- */}
        {isLoginView && (
          <div style={styles.methodSwitcher}>
            <span
              style={loginMethod === 'password' ? styles.activeMethod : styles.inactiveMethod}
              onClick={() => setLoginMethod('password')}
            >
              密码登录
            </span>
            <span
              style={loginMethod === 'code' ? styles.activeMethod : styles.inactiveMethod}
              onClick={() => setLoginMethod('code')}
            >
              验证码登录
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div style={styles.inputGroup}>
              <input name="username" placeholder="用户名" style={styles.input} value={formData.username} onChange={handleInputChange} required type="text" />
            </div>
          )}
          <div style={styles.inputGroup}>
            <input name="email" placeholder="邮箱" style={styles.input} value={formData.email} onChange={handleInputChange} required type="email" />
          </div>
          
          {/* --- 更新: 根据视图和登录方式动态显示输入框 --- */}
          {isLoginView ? (
            loginMethod === 'password' ? (
              <div style={styles.inputGroup}>
                <input name="password" placeholder="密码" style={styles.input} value={formData.password} onChange={handleInputChange} required type="password" />
              </div>
            ) : (
              <div style={styles.inputGroupWithButton}>
                <input name="code" placeholder="验证码" style={styles.input} value={formData.code} onChange={handleInputChange} required type="text" />
                <button type="button" style={styles.getCodeButton} onClick={handleGetCode} disabled={isLoading || isCodeSent}>
                  {isCodeSent ? '已发送' : '获取验证码'}
                </button>
              </div>
            )
          ) : ( // 注册视图
            <>
              <div style={styles.inputGroupWithButton}>
                <input name="code" placeholder="验证码" style={styles.input} value={formData.code} onChange={handleInputChange} required type="text" />
                <button type="button" style={styles.getCodeButton} onClick={handleGetCode} disabled={isLoading || isCodeSent}>
                  {isCodeSent ? '已发送' : '获取验证码'}
                </button>
              </div>
              <div style={styles.inputGroup}>
                <input name="password" placeholder="密码" style={styles.input} value={formData.password} onChange={handleInputChange} required type="password" />
              </div>
              <div style={styles.inputGroup}>
                <input name="confirmPassword" placeholder="确认密码" style={styles.input} value={formData.confirmPassword} onChange={handleInputChange} required type="password" />
              </div>
            </>
          )}

          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? '处理中...' : (isLoginView ? '登录' : '注册')}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLoginView ? '还没有账户？' : '已有账户？'}
          <span style={styles.toggleLink} onClick={() => {
            setIsLoginView(!isLoginView);
            setLoginMethod('password'); // 切换视图时重置登录方式
            setError(null);
          }}>
            {isLoginView ? '立即注册' : '立即登录'}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- 更新: 增加登录方式切换的样式 ---
const styles: { [key: string]: React.CSSProperties } = {
  // ... pageContainer, formContainer, title 样式保持不变 ...
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f5f5',
  },
  formContainer: {
    width: '400px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px', // 稍微减小间距
    fontSize: '24px',
    fontWeight: '600',
    color: '#4f46e5',
  },
  // --- 新增样式 ---
  methodSwitcher: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '25px',
    fontSize: '16px',
  },
  activeMethod: {
    color: '#4f46e5',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: '2px solid #4f46e5',
    paddingBottom: '5px',
  },
  inactiveMethod: {
    color: '#666',
    cursor: 'pointer',
    paddingBottom: '5px',
    borderBottom: '2px solid transparent',
  },
  // ... 其他样式保持不变 ...
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  inputGroupWithButton: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  getCodeButton: {
    padding: '0 15px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: '14px',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  toggleLink: {
    color: '#4f46e5',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

export default AuthPage;