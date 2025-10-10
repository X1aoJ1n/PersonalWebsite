import axios from 'axios';
import type { BaseResponse, ContactData, ContactRequest, AddContactRequest } from '@/models';
import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 根据用户id获取联系方式
export const getContactByUserId = async (userId: string) => {
  const res = await axios.get<BaseResponse<ContactData[]>>(`${BASE_URL}/contact/user?userId=${userId}`);
  return res.data;
};

// 根据id获取联系方式
export const getContactById = async (id: string) => {
  const res = await axios.get<BaseResponse<ContactData>>(`${BASE_URL}/contact/${id}`);
  return res.data;
};

// 添加新联系方式
export const addContact = async (params: AddContactRequest) => {
  const res = await axiosInstance.post<BaseResponse<ContactData[]>>(`${BASE_URL}/contact/add`, params);
  return res.data;
};

// 修改联系方式
export const updateContactById = async (params: ContactRequest) => {
  const res = await axiosInstance.put<BaseResponse<ContactData[]>>(`${BASE_URL}/contact/update`, params);
  return res.data;
};

// 删除联系方式
export const deleteContactById = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<ContactData[]>>(`${BASE_URL}/contact/${id}`);
  return res.data;
};
