// src/App.tsx
// 1. 导入 Navigate
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import OrganizationEditPage from '@/pages/OrganizationEditPage';
import UnderDevelopmentPage from '@/pages/UnderDevelopmentPage'; 
import PostDetailPage from '@/pages/PostDetailPage';
import PostEditPage from '@/pages/PostEditPage';
import PostCreatePage from '@/pages/PostCreatePage';
import FollowListPage from '@/pages/FollowListPage';
import SettingPage from '@/pages/SettingPage';
import NotificationPage from '@/pages/NotificationPage';

import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/:userId', element: <ProfilePage /> },
      { path: 'profile/edit', element: <EditProfilePage /> },
      { path: 'organization/add', element: <OrganizationEditPage /> },
      { path: 'organization/edit/:orgId', element: <OrganizationEditPage /> },
      { path: 'post/:postId', element: <PostDetailPage /> },
      { path: 'post/edit/:postId', element: <PostEditPage /> },
      { path: 'post/create', element: <PostCreatePage /> },
      { path: 'profile/:userId/follows', element: <FollowListPage /> },
      { path: 'settings', element: <SettingPage /> },
      { path: 'notifications', element: <NotificationPage /> },

      { path: 'recommend-user', element: <UnderDevelopmentPage /> },
      { path: 'search', element: <UnderDevelopmentPage /> },

      { 
        path: 'xiaojin', 
        element: <Navigate to="/profile/a9294cb6-dacd-43a6-aeaf-1b321bbc4f2e" replace /> 
      },

      // 3. 404 页面必须在最后
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;