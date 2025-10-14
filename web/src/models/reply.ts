
interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
}

export interface ReplyToVO {
  replyId: string;
  userId: string;
  userName: string;
}

// 请求类型
export interface ReplyRequest {
  id: string;
  content: string;
}

export interface AddReplyRequest {
  commentId: string;
  replyTo?: string;
  content: string;
}



// 响应数据类型
export interface ReplyData {
  id: string;
  userVO: SimpleUserVO;
  commentId: string;
  replyToVO?: ReplyToVO; // 回复可能没有目标，所以可选
  content: string;
  status: number;
  likeCount: number;
  isLike: boolean;
  isCreator: boolean;
  createdAt: string; // LocalDateTime -> ISO string
  updatedAt: string;
}