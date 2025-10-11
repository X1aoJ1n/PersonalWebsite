import type { SimpleUserVO } from '@/models/common';
import type { ReplyData } from './reply';


// 请求类型
export interface AddCommentRequest {
  postId: string;
  content: string;
}

export interface CommentRequest {
  id: string;
  content: string;
}

// 响应数据类型
export interface CommentData {
  id: string;
  userVO: SimpleUserVO;
  postId: string;
  content: string;
  replies: ReplyData[];
  likeCount: number;
  isLike: boolean;
  isCreator: boolean;
  createdAt: string;
  updatedAt: string;
}