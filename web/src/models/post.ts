interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
}
// 请求类型
export interface PostRequest {
  id: string;
  title?: string;
  preview?: string;
  content?: string;
}

export interface AddPostRequest {
  title: string;
  preview?: string;
  content: string;
}

// 响应数据类型
export interface SimplePostData {
  id: string;
  userVO: SimpleUserVO;
  title: string;
  preview?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string; // LocalDateTime → ISO string
  updatedAt: string;
}

export interface PostData {
  id: string;
  userVO: SimpleUserVO;
  title: string;
  preview?: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLike: boolean;
  isCreator: boolean;
  createdAt: string;
  updatedAt: string;
}