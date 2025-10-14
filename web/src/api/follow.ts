import type { BaseResponse } from '@/models';
import axiosInstance from './axiosInstance';

export interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
  isFollowed: boolean;
  beingFollowed: boolean;
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
export const getFollowingList = async (userId: string, pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimpleUserVO[]>>('/follow/list-following', { 
    params: {
      userId,          // Include the userId
      ...pageQuery     // Spread the rest of the pagination params
    } 
  });
  return res.data;
};

// 获取粉丝列表
export const getFollowerList = async (userId: string, pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimpleUserVO[]>>('/follow/list-follower', {
    params: {
      userId,          // Include the userId
      ...pageQuery     // Spread the rest of the pagination params
    } 
  });
  return res.data;
};

// 检查关注状态
export const checkFollowStatus = async (followId: string) => {
  const res = await axiosInstance.get<BaseResponse<boolean>>(`/follow/check?followId=${followId}`);
  return res.data;
};