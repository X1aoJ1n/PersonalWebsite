import axios from 'axios';
import type { BaseResponse, PostData, AddPostRequest, PostRequest, PageQuery, SimplePostData } from '@/models';
import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 获取帖子详情
export const getPostDetail = async (id: string) => {
  const res = await axios.get<BaseResponse<PostData>>(`${BASE_URL}/post/${id}`);
  return res.data;
};

// 获取用户发布的帖子列表
export const getUserPost = async (pageQuery: PageQuery) => {
  const res = await axios.get<BaseResponse<SimplePostData[]>>(`${BASE_URL}/post/list/byUser`, { params: pageQuery });
  return res.data;
};

// 获取所有帖子（可见）
export const getVisiblePost = async (pageQuery: PageQuery) => {
  const res = await axios.get<BaseResponse<SimplePostData[]>>(`${BASE_URL}/post/list/all`, { params: pageQuery });
  return res.data;
};

// 获取收藏帖子
export const getFollowPost = async (pageQuery: PageQuery) => {
  const res = await axiosInstance.post<BaseResponse<SimplePostData[]>>(`${BASE_URL}/post/list/favorite`, null, { params: pageQuery });
  return res.data;
};

// 创建帖子
export const createPost = async (params: AddPostRequest) => {
  const res = await axiosInstance.post<BaseResponse<PostData>>(`${BASE_URL}/post/create`, params);
  return res.data;
};

// 修改帖子
export const updatePost = async (params: PostRequest) => {
  const res = await axiosInstance.put<BaseResponse<PostData>>(`${BASE_URL}/post/update`, params);
  return res.data;
};

// 删除帖子
export const deletePost = async (id: string) => {
  const res = await axiosInstance.delete<BaseResponse<boolean>>(`${BASE_URL}/post/delete?id=${id}`);
  return res.data;
};
