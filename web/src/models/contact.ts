// 请求类型
export interface ContactRequest {
  id: string;
  type?: string;
  data?: string;
}

export interface AddContactRequest {
  type: string;
  data: string;
}

// 响应数据类型
export interface ContactData {
  id: string;
  type: string;
  data: string;
}