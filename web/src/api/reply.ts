import axios from 'axios';
import type { BaseResponse, ReplyData, ReplyRequest, AddReplyRequest, PageQuery } from '@/models';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 获取评论回复
export const getRepliesByCommentId = async (pageQuery: PageQuery) => {
  const res = await axios.get<BaseResponse<ReplyData[]>>(`${BASE_URL}/reply/list/by-comment`, { params: pageQuery });
  return res.data;
};

// 创建回复
export const createReply = async (params: AddReplyRequest) => {
  const res = await axios.post<BaseResponse<ReplyData>>(`${BASE_URL}/reply/create`, params);
  return res.data;
};

// 修改回复
export const updateReply = async (params: ReplyRequest) => {
  const res = await axios.put<BaseResponse<ReplyData>>(`${BASE_URL}/reply/update`, params);
  return res.data;
};

// 删除回复
export const deleteReply = async (id: string) => {
  const res = await axios.put<BaseResponse<boolean>>(`${BASE_URL}/reply/delete?id=${id}`);
  return res.data;
};

// 隐藏回复
export const archiveReply = async (id: string) => {
  const res = await axios.put<BaseResponse<boolean>>(`${BASE_URL}/reply/archive?id=${id}`);
  return res.data;
};

// 删除回复（软删）
export const unarchiveReply = async (id: string) => {
  const res = await axios.put<BaseResponse<boolean>>(`${BASE_URL}/reply/unarchive?id=${id}`);
  return res.data;
};
