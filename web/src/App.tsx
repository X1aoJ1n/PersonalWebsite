// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import OrganizationEditPage from '@/pages/OrganizationEditPage';
import UnderDevelopmentPage from '@/pages/UnderDevelopmentPage'; // 1. 引入新组件


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

      // --- 2. 将待开发页面指向 UnderDevelopmentPage ---
      { path: 'settings', element: <UnderDevelopmentPage /> },
      { path: 'recommend-user', element: <UnderDevelopmentPage /> },
      { path: 'ai-agents', element: <UnderDevelopmentPage /> },
      { path: 'notifications', element: <UnderDevelopmentPage /> },
      { path: 'post/:postId', element: <UnderDevelopmentPage /> },
    { path: 'search', element: <UnderDevelopmentPage /> },

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;