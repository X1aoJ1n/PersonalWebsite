import type { BaseResponse, CommentData, CommentRequest, AddCommentRequest } from '@/models';
import type { PageQuery } from '@/models/common'; 
import axiosInstance from './axiosInstance';

// 获取帖子评论
export const getCommentsByPostId = async (postId: string, pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<CommentData[]>>(`/comment/list/by-post?postId=${postId}`, { params: pageQuery });
  return res.data;
};

// 修改评论
export const updateComment = async (params: CommentRequest) => {
  const res = await axiosInstance.put<BaseResponse<CommentData>>('/comment/update', params);
  return res.data;
};

// 创建评论
export const createComment = async (params: AddCommentRequest) => {
  const res = await axiosInstance.post<BaseResponse<CommentData>>('/comment/create', params);
  return res.data;
};

// 删除评论
export const deleteComment = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<boolean>>(`/comment/delete?id=${id}`);
  return res.data;
};

// 隐藏评论
export const archiveComment = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`/comment/archive?id=${id}`);
  return res.data;
};

// 取消隐藏评论
export const unarchiveComment = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`/comment/unarchive?id=${id}`);
  return res.data;
};