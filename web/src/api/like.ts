import type { BaseResponse, LikeDTO } from '@/models';
import axiosInstance from './axiosInstance';

// 点赞帖子或评论
export const like = async (params: LikeDTO) => {
  const res = await axiosInstance.post<BaseResponse<boolean>>('/like', params);
  return res.data;
};

// 取消点赞
export const unlike = async (params: LikeDTO) => {
  const res = await axiosInstance.delete<BaseResponse<boolean>>('/like/cancel', { data: params });
  return res.data;
};

// 检查点赞状态
export const checkLiked = async (likeDTO: LikeDTO) => {
  const res = await axiosInstance.get<BaseResponse<boolean>>('/like/check', { params: likeDTO });
  return res.data;
};