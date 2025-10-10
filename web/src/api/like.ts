import axios from 'axios';
import type { BaseResponse, LikeDTO } from '@/models';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 点赞帖子或评论
export const like = async (params: LikeDTO) => {
  const res = await axios.post<BaseResponse<boolean>>(`${BASE_URL}/like`, params);
  return res.data;
};

// 取消点赞
export const unlike = async (params: LikeDTO) => {
  const res = await axios.delete<BaseResponse<boolean>>(`${BASE_URL}/like/cancel`, { data: params });
  return res.data;
};

// 检查点赞状态
export const checkLiked = async (likeDTO: LikeDTO) => {
  const res = await axios.get<BaseResponse<boolean>>(`${BASE_URL}/like/check`, { params: likeDTO });
  return res.data;
};
