// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 引入布局和页面组件
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
// import ProfilePage from '@/pages/ProfilePage';

// 将路由配置定义在组件外部，这是最佳实践
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // RootLayout 作为根元素
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      // { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;