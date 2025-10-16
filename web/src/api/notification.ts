import type { BaseResponse , NotificationData } from '@/models';
import axiosInstance from './axiosInstance';

// 获得未读消息的数字
export const countAllUnread = async () => {
  const res = await axiosInstance.get<BaseResponse<number>>('/notification/count-all-unread');
  return res.data;
};

// 获得未读点赞的数字
export const countLikeUnread = async () => {
  const res = await axiosInstance.get<BaseResponse<number>>('/notification/count-like-unread');
  return res.data;
};

// 获得未读关注的数字
export const countFollowUnread = async () => {
  const res = await axiosInstance.get<BaseResponse<number>>('/notification/count-follow-unread');
  return res.data;
};

// 获得未读评论和回复的数字
export const countCommentUnread = async () => {
  const res = await axiosInstance.get<BaseResponse<number>>('/notification/count-comment-unread');
  return res.data;
};

// 把某个通知设为已读
export const readNotification = async (id: string) => {
  const res = await axiosInstance.post<BaseResponse<boolean>>(`/notification/read`, null, {
    params: { id },
  });
  return res.data;
};

// 把特定Type的通知全部设为已读
export const readNotificationBatch = async (type: number) => {
  const res = await axiosInstance.post<BaseResponse<boolean>>(`/notification/read-batch`, null, {
    params: { type },
  });
  return res.data;
};

// 获取所有点赞通知
export const getLikeNotification = async () => {
  const res = await axiosInstance.get<BaseResponse<NotificationData[]>>('/notification/list-like');
  return res.data;
};

// 获取所有关注通知
export const getFollowNotification = async () => {
  const res = await axiosInstance.get<BaseResponse<NotificationData[]>>('/notification/list-follow');
  return res.data;
};

// 获取所有评论和回复通知
export const getCommentNotification = async () => {
  const res = await axiosInstance.get<BaseResponse<NotificationData[]>>('/notification/list-commentAndReply');
  return res.data;
};
