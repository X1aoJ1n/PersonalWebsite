import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
//import ProfilePage from '@/pages/ProfilePage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthPage /> },
 // { path: '/profile', element: <ProfilePage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
