import axios from 'axios';
import type { BaseResponse, CommentData, CommentRequest, AddCommentRequest, PageQuery } from '@/models';
import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 获取帖子评论
export const getCommentsByPostId = async (pageQuery: PageQuery) => {
  const res = await axios.get<BaseResponse<CommentData[]>>(`${BASE_URL}/comment/list/by-post`, { params: pageQuery });
  return res.data;
};

// 修改评论
export const updateComment = async (params: CommentRequest) => {
  const res = await axiosInstance.put<BaseResponse<CommentData>>(`${BASE_URL}/comment/update`, params);
  return res.data;
};

// 创建评论
export const createComment = async (params: AddCommentRequest) => {
  const res = await axiosInstance.post<BaseResponse<CommentData>>(`${BASE_URL}/comment/create`, params);
  return res.data;
};

// 删除评论
export const deleteComment = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`${BASE_URL}/comment/delete?id=${id}`);
  return res.data;
};

// 隐藏评论
export const archiveComment = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`${BASE_URL}/comment/archive?id=${id}`);
  return res.data;
};

// 取消隐藏评论
export const unarchiveComment = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`${BASE_URL}/comment/unarchive?id=${id}`);
  return res.data;
};
