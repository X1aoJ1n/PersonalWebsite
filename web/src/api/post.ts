import type { BaseResponse, PostData, AddPostRequest, PostRequest, PageQuery, SimplePostData } from '@/models';
import axiosInstance from './axiosInstance';

// 获取帖子详情
export const getPostDetail = async (id: string) => {
  const res = await axiosInstance.get<BaseResponse<PostData>>(`/post/${id}`);
  return res.data;
};

// 获取用户发布的帖子列表
export const getUserPost = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimplePostData[]>>('/post/list/byUser', { params: pageQuery });
  return res.data;
};

// 获取所有帖子（最新）
export const getVisiblePost = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimplePostData[]>>('/post/list/all', { params: pageQuery });
  return res.data;
};

// 获取所有帖子（点赞）
export const getFavoritePost = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimplePostData[]>>('/post/list/favorite', { params: pageQuery });
  return res.data;
};

// 获取收藏帖子
export const getFollowPost = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.get<BaseResponse<SimplePostData[]>>('/post/list/follow', { params: pageQuery });
  return res.data;
};

// 创建帖子
export const createPost = async (params: AddPostRequest) => {
  const res = await axiosInstance.post<BaseResponse<PostData>>('/post/create', params);
  return res.data;
};

// 修改帖子
export const updatePost = async (params: PostRequest) => {
  const res = await axiosInstance.put<BaseResponse<PostData>>('/post/update', params);
  return res.data;
};

// 删除帖子
export const deletePost = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<boolean>>(`/post/delete?id=${id}`);
  return res.data;
};