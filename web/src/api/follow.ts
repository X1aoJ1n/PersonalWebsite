import type { BaseResponse } from '@/models';
import axiosInstance from './axiosInstance';

export interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
  isFollow: boolean;
  beingFollow: boolean;
}

export interface PageQuery {
  id?: string;
  pageNum?: number;
  pageSize?: number;
}

// 关注用户
export const follow = async (followId: string) => {
  const res = await axiosInstance.post<BaseResponse<null>>(`/follow?followId=${followId}`);
  return res.data;
};

// 取消关注
export const unfollow = async (followId: string) => {
  const res = await axiosInstance.delete<BaseResponse<null>>(`/follow/cancel?followId=${followId}`);
  return res.data;
};

// 获取关注列表
export const getFollowingList = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimpleUserVO[]>>('/follow/list-following', { params: pageQuery });
  return res.data;
};

// 获取粉丝列表
export const getFollowerList = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimpleUserVO[]>>('/follow/list-follower', { params: pageQuery });
  return res.data;
};

// 检查关注状态
export const checkFollowStatus = async (followId: string) => {
  const res = await axiosInstance.get<BaseResponse<boolean>>(`/follow/check?followId=${followId}`);
  return res.data;
};