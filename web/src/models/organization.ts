// 请求类型
export interface OrganizationRequest {
  id: string;
  type?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  position?: string;
  description?: string;
  location: string;
}

export interface AddOrganizationRequest {
  type: string;
  name: string;
  startDate: string;
  endDate?: string;
  position: string;
  description?: string;
  location?: string;
}

// 响应数据类型
export interface OrganizationData {
  id: string;
  type: string;
  name: string;
  startDate: string; // LocalDate → string
  endDate: string;   // LocalDate → string
  position: string;
  description: string;
  location: string;
}