// src/api/auth.ts
import axiosInstance from './axiosInstance'; // ✅ 确保导入的是配置好的实例
import type { BaseResponse, LoginData, LoginRequest, RegisterRequest } from '@/models';

// 密码登录
export const loginByPassword = async (params: LoginRequest) => {
  const res = await axiosInstance.post<BaseResponse<LoginData>>('/auth/login/password', params);
  return res.data;
};

// 验证码登录
export const loginByCode = async (params: LoginRequest) => {
  const res = await axiosInstance.post<BaseResponse<LoginData>>('/auth/login/code', params);
  return res.data;
};

// 注册
export const register = async (params: RegisterRequest) => {
  const res = await axiosInstance.post<BaseResponse<LoginData>>('/auth/register', params);
  return res.data;
};

// 获取验证码 (可用于注册和登录)
export const getVerificationCode = async (email: string) => {
  const res = await axiosInstance.get<BaseResponse<null>>(`/auth/getCode?email=${email}`);
  return res.data;
};