import type { BaseResponse, OrganizationData, OrganizationRequest, AddOrganizationRequest } from '@/models';
import axiosInstance from './axiosInstance';

// 根据用户id获取组织
export const getOrganizationByUserId = async (userId: string) => {
  const res = await axiosInstance.get<BaseResponse<OrganizationData[]>>(`/organization/user?userId=${userId}`);
  return res.data;
};

// 根据id获取组织
export const getOrganizationById = async (id: string) => {
  const res = await axiosInstance.get<BaseResponse<OrganizationData>>(`/organization/${id}`);
  return res.data;
};

// 添加组织
export const addOrganization = async (params: AddOrganizationRequest) => {
  const res = await axiosInstance.post<BaseResponse<OrganizationData[]>>('/organization/add', params);
  return res.data;
};

// 修改组织
export const updateOrganizationById = async (params: OrganizationRequest) => {
  const res = await axiosInstance.put<BaseResponse<OrganizationData[]>>('/organization/update', params);
  return res.data;
};

// 删除组织
export const deleteOrganizationById = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<OrganizationData[]>>(`/organization/${id}`);
  return res.data;
};