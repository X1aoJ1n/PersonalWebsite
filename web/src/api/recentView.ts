import type { BaseResponse, SimplePostData, SimpleUserVO } from '@/models';
import axiosInstance from './axiosInstance';

export interface PageQuery {
  id?: string;
  pageNum?: number;
  pageSize?: number;
}

// 获取用户最近浏览的帖子列表
export const getRecentViewPost = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimplePostData[]>>('/recent-view/post', {
    params: {
      pageNum: pageQuery.pageNum,
      pageSize: pageQuery.pageSize,
    }
  });
  return res.data;
};

// 获取用户发布的用户列表（最近浏览的用户）
export const getRecentViewUser = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimpleUserVO[]>>('/recent-view/user', {
    params: {
      pageNum: pageQuery.pageNum,
      pageSize: pageQuery.pageSize,
    }
  });
  return res.data;
};
