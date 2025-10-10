import type { BaseResponse, ContactData, ContactRequest, AddContactRequest } from '@/models';
import axiosInstance from './axiosInstance';

// 根据用户id获取联系方式
export const getContactByUserId = async (userId: string) => {
  const res = await axiosInstance.get<BaseResponse<ContactData[]>>(`/contact/user?userId=${userId}`);
  return res.data;
};

// 根据id获取联系方式
export const getContactById = async (id: string) => {
  const res = await axiosInstance.get<BaseResponse<ContactData>>(`/contact/${id}`);
  return res.data;
};

// 添加新联系方式
export const addContact = async (params: AddContactRequest) => {
  const res = await axiosInstance.post<BaseResponse<ContactData[]>>('/contact/add', params);
  return res.data;
};

// 修改联系方式
export const updateContactById = async (params: ContactRequest) => {
  const res = await axiosInstance.put<BaseResponse<ContactData[]>>('/contact/update', params);
  return res.data;
};

// 删除联系方式
export const deleteContactById = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<ContactData[]>>(`/contact/${id}`);
  return res.data;
};