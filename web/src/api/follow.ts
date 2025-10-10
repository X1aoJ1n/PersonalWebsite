import axios from 'axios';
import type { BaseResponse, SimpleUserVO, PageQuery } from '@/models';
import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 关注用户
export const follow = async (followId: string) => {
  const res = await axiosInstance.post<BaseResponse<null>>(`${BASE_URL}/follow?followId=${followId}`);
  return res.data;
};

// 取消关注
export const unfollow = async (followId: string) => {
  const res = await axiosInstance.delete<BaseResponse<null>>(`${BASE_URL}/follow/cancel?followId=${followId}`);
  return res.data;
};

// 获取关注列表
export const getFollowingList = async (pageQuery: PageQuery) => {
  const res = await axios.get<BaseResponse<SimpleUserVO[]>>(`${BASE_URL}/follow/list-following`, { params: pageQuery });
  return res.data;
};

// 获取粉丝列表
export const getFollowerList = async (pageQuery: PageQuery) => {
  const res = await axios.get<BaseResponse<SimpleUserVO[]>>(`${BASE_URL}/follow/list-follower`, { params: pageQuery });
  return res.data;
};

// 检查关注状态
export const checkFollowStatus = async (followId: string) => {
  const res = await axiosInstance.get<BaseResponse<boolean>>(`${BASE_URL}/follow/check?followId=${followId}`);
  return res.data;
};
