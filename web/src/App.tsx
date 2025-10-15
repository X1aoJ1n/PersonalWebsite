// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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

      // --- 2. 将待开发页面指向 UnderDevelopmentPage ---
      { path: 'recommend-user', element: <UnderDevelopmentPage /> },
      { path: 'ai-agents', element: <UnderDevelopmentPage /> },
      { path: 'notifications', element: <UnderDevelopmentPage /> },
      { path: 'search', element: <UnderDevelopmentPage /> },

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;