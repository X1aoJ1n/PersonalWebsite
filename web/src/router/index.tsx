import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
