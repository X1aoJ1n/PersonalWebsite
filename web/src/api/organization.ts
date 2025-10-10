import axios from 'axios';
import type { BaseResponse, OrganizationData, OrganizationRequest, AddOrganizationRequest } from '@/models';
import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 根据用户id获取组织
export const getOrganizationByUserId = async (userId: string) => {
  const res = await axios.get<BaseResponse<OrganizationData[]>>(`${BASE_URL}/organization/user?userId=${userId}`);
  return res.data;
};

// 根据id获取组织
export const getOrganizationById = async (id: string) => {
  const res = await axios.get<BaseResponse<OrganizationData>>(`${BASE_URL}/organization/${id}`);
  return res.data;
};

// 添加组织
export const addOrganization = async (params: AddOrganizationRequest) => {
  const res = await axiosInstance.post<BaseResponse<OrganizationData[]>>(`${BASE_URL}/organization/add`, params);
  return res.data;
};

// 修改组织
export const updateOrganizationById = async (params: OrganizationRequest) => {
  const res = await axiosInstance.put<BaseResponse<OrganizationData[]>>(`${BASE_URL}/organization/update`, params);
  return res.data;
};

// 删除组织
export const deleteOrganizationById = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<OrganizationData[]>>(`${BASE_URL}/organization/${id}`);
  return res.data;
};
