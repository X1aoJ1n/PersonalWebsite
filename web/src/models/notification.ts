interface SimpleUserVO {
  id: string;
  username: string;
  icon: string;
}

export interface NotificationData {
  id: string;
  read: boolean;
  type: number;
  createdAt: string; 
  targetUser: SimpleUserVO | null;
  targetId: string | null;
  targetType: number | null;
  targetContent: string | null;
  content: string | null;
  postId: string | null;
}