interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
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
  status: number;
  likeCount: number;
  replyCount: number;
  isLike: boolean;
  isCreator: boolean;
  createdAt: string;
  updatedAt: string;
}