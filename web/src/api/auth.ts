import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginPasswordDTO {
  email: string;
  password: string;
}

export interface UserLoginVO {
  id: string;
  token: string;
  username: string;
  email: string;
  icon: string;
}

export interface ResponseUserLoginVO {
  code: number;
  message: string;
  data: UserLoginVO;
}

export const loginByPassword = async (params: LoginPasswordDTO) => {
  const response = await axios.post<ResponseUserLoginVO>(`${BASE_URL}/auth/login/password`, params);
  return response.data;
};