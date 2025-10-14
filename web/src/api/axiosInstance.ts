// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // 我们的目标 baseURL
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // --- 新增的终极调试日志 ---
    console.log(
      `[AXIOS DEBUG] Requesting URL: ${config.baseURL}${config.url}`,
      config
    );
    // --- 结束 ---

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ... 响应拦截器保持不变 ...
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;