import type { BaseResponse, UploadedFile } from '@/models';
import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 上传文件
export const uploadFile = async (file: File, category: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<BaseResponse<UploadedFile>>(`${BASE_URL}/file/upload?category=${category}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// 删除文件
export const deleteFile = async (fileUrl: string) => {
  const res = await axiosInstance.delete<BaseResponse<UploadedFile>>(`${BASE_URL}/file/delete?fileUrl=${fileUrl}`);
  return res.data;
};
