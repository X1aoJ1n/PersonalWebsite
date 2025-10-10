// src/api/axiosInstance.ts
import axios from 'axios';


// 1. 创建一个新的 axios 实例
const axiosInstance = axios.create({
  baseURL: '/api', // 设置统一的请求前缀
  timeout: 10000, // 设置统一的超时时间
});

// 2. 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // a. 从 localStorage 中获取 token
    const token = localStorage.getItem('token');

    // b. 如果 token 存在，则为请求头添加 Authorization 字段
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // c. 必须返回 config 对象，否则请求会被中断
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// （可选）你也可以添加响应拦截器，例如处理 401 Unauthorized 错误
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      // 例如：token 过期或无效，清除本地 token 并跳转到登录页
      localStorage.removeItem('token');
      // 这里不能使用 useNavigate，因为它是一个 hook。通常会用 window.location.href
      // 或者在 App.tsx 中通过订阅事件来处理
      window.location.href = '/auth'; 
    }
    return Promise.reject(error);
  }
);

// 3. 导出这个配置好的实例
export default axiosInstance;