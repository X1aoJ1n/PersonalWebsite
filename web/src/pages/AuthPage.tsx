// src/pages/AuthPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginByPassword, loginByCode, getRegisterCode } from '@/api/auth';
import type { LoginRequest, BaseResponse } from '@/models';

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'password' | 'code'>('password'); // 登录方式

  const handleLogin = async () => {
    setLoading(true);
    try {
      const params: LoginRequest =
        mode === 'password' ? { email, password } : { email, password };

      const res: BaseResponse<any> =
        mode === 'password'
          ? await loginByPassword(params)
          : await loginByCode(params);

      if (res.code === 200) {
        alert('登录成功！');
        // 跳转首页
        navigate('/');
      } else {
        alert(res.message || '登录失败');
      }
    } catch (err: any) {
      alert(err.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCode = async () => {
    if (!email) {
      alert('请输入邮箱');
      return;
    }
    try {
      const res: BaseResponse<null> = await getRegisterCode(email);
      if (res.code === 200) {
        alert('验证码已发送，请注意查收邮箱');
      } else {
        alert(res.message || '获取验证码失败');
      }
    } catch (err: any) {
      alert(err.message || '网络错误');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>

        <div className="mb-4">
          <label className="block mb-1">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {mode === 'password' ? (
          <div className="mb-4">
            <label className="block mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ) : (
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block mb-1">验证码</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleGetCode}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              获取验证码
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '登录中...' : '登录'}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'password' ? 'code' : 'password')}
            className="text-blue-500 underline"
          >
            {mode === 'password' ? '使用验证码登录' : '使用密码登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
