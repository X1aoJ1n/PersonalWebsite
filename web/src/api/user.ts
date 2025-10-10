import axios from 'axios';
import type { BaseResponse, UserData, UserUpdateRequest, ChangeEmailRequest, ChangePasswordRequest } from '@/models';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 获取当前用户
export const getCurrentUser = async () => {
  const res = await axios.get<BaseResponse<UserData>>('/user');
  return res.data;
};

// 根据id获取用户
export const getUserById = async (id: string) => {
  const res = await axios.get<BaseResponse<UserData>>(`${BASE_URL}/user/${id}`);
  return res.data;
};

// 修改用户信息
export const updateUserById = async (params: UserUpdateRequest) => {
  const res = await axios.put<BaseResponse<UserData>>(`${BASE_URL}/user/update`, params);
  return res.data;
};

// 更改头像
export const changeIcon = async (iconUrl: string) => {
  const res = await axios.put<BaseResponse<UserData>>(`${BASE_URL}/user/changeIcon?iconUrl=${iconUrl}`);
  return res.data;
};

// 更改邮箱
export const changeEmail = async (params: ChangeEmailRequest) => {
  const res = await axios.put<BaseResponse<null>>(`${BASE_URL}/user/changeEmail`, params);
  return res.data;
};

// 更改密码
export const changePassword = async (params: ChangePasswordRequest) => {
  const res = await axios.put<BaseResponse<null>>(`${BASE_URL}/user/change-password`, params);
  return res.data;
};

// 获取改密码验证码
export const getChangePasswordCode = async () => {
  const res = await axios.get<BaseResponse<null>>(`${BASE_URL}/user/getChangePasswordCode`);
  return res.data;
};
