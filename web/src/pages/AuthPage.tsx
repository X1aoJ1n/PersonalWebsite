// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; // 确保引入 useOutletContext
import type { OutletContextType } from '@/layouts/RootLayout'; // 引入共享的 context 类型

// 引入API接口和数据类型
import { loginByPassword, register, getRegisterCode } from '@/api/auth';
import type { LoginData } from '@/models';

// 移除了 AuthPageProps 定义
const AuthPage: React.FC = () => { // 移除了 props
  // 通过 useOutletContext hook 从 RootLayout 获取共享状态
  const { setCurrentUser } = useOutletContext<OutletContextType>();

  const [isLoginView, setIsLoginView] = useState(true);
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
    // 调用从 context 获取的函数，更新全局状态
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
      const res = await getRegisterCode(formData.email);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        const res = await loginByPassword({ email: formData.email, password: formData.password });
        if (res.code === 200 && res.data) {
          handleAuthSuccess(res.data);
        } else {
          throw new Error(res.message || '登录失败');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }
        const res = await register({
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
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="username"
                placeholder="用户名"
                style={styles.input}
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="邮箱"
              style={styles.input}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLoginView && (
            <div style={styles.inputGroupWithButton}>
              <input
                type="text"
                name="code"
                placeholder="验证码"
                style={styles.input}
                value={formData.code}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                style={styles.getCodeButton}
                onClick={handleGetCode}
                disabled={isLoading || isCodeSent}
              >
                {isCodeSent ? '已发送' : '获取验证码'}
              </button>
            </div>
          )}
          <div style={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="密码"
              style={styles.input}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLoginView && (
            <div style={styles.inputGroup}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="确认密码"
                style={styles.input}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? '处理中...' : (isLoginView ? '登录' : '注册')}
          </button>
        </form>
        <p style={styles.toggleText}>
          {isLoginView ? '还没有账户？' : '已有账户？'}
          <span style={styles.toggleLink} onClick={() => { setIsLoginView(!isLoginView); setError(null); }}>
            {isLoginView ? '立即注册' : '立即登录'}
          </span>
        </p>
      </div>
    </div>
  );
};

// ... (styles 对象保持不变)
const styles: { [key: string]: React.CSSProperties } = {
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
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#4f46e5',
  },
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