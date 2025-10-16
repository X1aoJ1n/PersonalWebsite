import type { ContactData } from "./contact";
import type { OrganizationData } from "./organization";

// 请求类型
export interface UserUpdateRequest {
  username?: string;
  introduction?: string;
}

export interface ChangeEmailRequest {
  code: string;
  email: string;
}

export interface ChangePasswordRequest {
  code: string;
  password: string;
  confirmPassword: string;
}

// 响应数据类型
export interface UserData {
  id: string;
  username: string;
  email: string;
  icon?: string;
  introduction?: string;
  contacts: ContactData[];
  organizations: OrganizationData[];
  followerCount: number;
  followingCount: number;
}

export interface UserPreviewData {
  id: string;
  username: string;
  icon?: string;
  introduction?: string;
  followerCount: number;
  followingCount: number;
  isFollow: boolean;
  likeCount: number;
}