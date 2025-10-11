import type { ReplyData } from './reply';


interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
  isFollow: boolean;
  beingFollow: boolean;
}

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