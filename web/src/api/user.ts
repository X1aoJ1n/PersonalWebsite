import type { BaseResponse, UserData, UserPreviewData, UserUpdateRequest, ChangeEmailRequest, ChangePasswordRequest } from '@/models';
import axiosInstance from './axiosInstance';

// 获取当前用户
export const getCurrentUser = async () => {
  const res = await axiosInstance.get<BaseResponse<UserData>>('/user');
  return res.data;
};

// 根据id获取用户
export const getUserById = async (id: string) => {
  const res = await axiosInstance.get<BaseResponse<UserData>>(`/user/${id}`);
  return res.data;
};

// 根据id获取用户预览
export const getUserPreviewById = async (id: string) => {
  const res = await axiosInstance.get<BaseResponse<UserPreviewData>>(`/user/preview/${id}`);
  return res.data;
};

// 修改用户信息
export const updateUserById = async (params: UserUpdateRequest) => {
  const res = await axiosInstance.put<BaseResponse<UserData>>('/user/update', params);
  return res.data;
};

// 更改头像
export const changeIcon = async (iconUrl: string) => {
  const res = await axiosInstance.put<BaseResponse<UserData>>(`/user/changeIcon?iconUrl=${iconUrl}`);
  return res.data;
};

// 更改邮箱
export const changeEmail = async (params: ChangeEmailRequest) => {
  const res = await axiosInstance.put<BaseResponse<null>>('/user/changeEmail', params);
  return res.data;
};

// 更改密码
export const changePassword = async (params: ChangePasswordRequest) => {
  const res = await axiosInstance.put<BaseResponse<null>>('/user/change-password', params);
  return res.data;
};

// 获取改密码验证码
export const getChangePasswordCode = async () => {
  const res = await axiosInstance.get<BaseResponse<null>>('/user/getChangePasswordCode');
  return res.data;
};

export const getChangeEmailCode = async (params: { email: string }) => {
  const res = await axiosInstance.get<BaseResponse<null>>('/user/getChangeEmailCode', { params });
  return res.data;
};