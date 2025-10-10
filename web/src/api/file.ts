import type { BaseResponse, UploadedFile } from '@/models';
import axiosInstance from './axiosInstance';

// 上传文件
export const uploadFile = async (file: File, category: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<BaseResponse<UploadedFile>>(`/file/upload?category=${category}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// 删除文件
export const deleteFile = async (fileUrl: string) => {
  const res = await axiosInstance.delete<BaseResponse<UploadedFile>>(`/file/delete?fileUrl=${fileUrl}`);
  return res.data;
};