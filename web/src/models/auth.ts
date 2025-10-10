import type { ContactData, OrganizationData } from "@/models";

// 请求类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  code: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

// 响应数据类型
export interface LoginData {
  id: string;
  token: string;
  username: string;
  email: string;
  icon: string;
  introduction: string;
  contacts: ContactData[];
  organizations: OrganizationData[];
  followerCount: number;
  followingCount: number;
}