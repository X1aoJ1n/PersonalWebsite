import type { BaseResponse, ReplyData, ReplyRequest, AddReplyRequest, PageQuery } from '@/models';
import axiosInstance from './axiosInstance';

// 获取评论回复
export const getRepliesByCommentId = async (commentId: string, pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<ReplyData[]>>(`/reply/list/by-comment?commentId=${commentId}`, { params: pageQuery });
  return res.data;
};

// 创建回复
export const createReply = async (params: AddReplyRequest) => {
  const res = await axiosInstance.post<BaseResponse<ReplyData>>('/reply/create', params);
  return res.data;
};

// 修改回复
export const updateReply = async (params: ReplyRequest) => {
  const res = await axiosInstance.put<BaseResponse<ReplyData>>('/reply/update', params);
  return res.data;
};

// 删除回复
export const deleteReply = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<boolean>>(`/reply/delete?id=${id}`);
  return res.data;
};

// 隐藏回复
export const archiveReply = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`/reply/archive?id=${id}`);
  return res.data;
};

// 取消隐藏回复
export const unarchiveReply = async (id: string) => {
  const res = await axiosInstance.put<BaseResponse<boolean>>(`/reply/unarchive?id=${id}`);
  return res.data;
};