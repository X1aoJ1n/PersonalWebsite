import axios from 'axios';
import type { BaseResponse, LoginData, LoginRequest, RegisterRequest } from '@/models';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 密码登录
export const loginByPassword = async (params: LoginRequest) => {
  const res = await axios.post<BaseResponse<LoginData>>(`${BASE_URL}/auth/login/password`, params);
  return res.data;
};

// 验证码登录
export const loginByCode = async (params: LoginRequest) => {
  const res = await axios.post<BaseResponse<LoginData>>(`${BASE_URL}/auth/login/code`, params);
  return res.data;
};

// 注册
export const register = async (params: RegisterRequest) => {
  const res = await axios.post<BaseResponse<LoginData>>(`${BASE_URL}/auth/register`, params);
  return res.data;
};

// 获取验证码
export const getRegisterCode = async (email: string) => {
  const res = await axios.get<BaseResponse<null>>(`${BASE_URL}/auth/getCode?email=${email}`);
  return res.data;
};
