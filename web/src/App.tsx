import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom' 
import { useEffect } from 'react';
import HomePage from './pages/HomePage' 
import AuthPage from './pages/AuthPage' 

const SITE_NAME = 'Better Call XiaoJin'; // 固定后缀

const titleMap: Record<string, string> = {
  '/': '首页',
  '/auth': '登录',
};

function TitleHandler() {
  const location = useLocation();
  useEffect(() => {
    const pageTitle = titleMap[location.pathname] || '';
    document.title = pageTitle ? `${pageTitle} - ${SITE_NAME}` : SITE_NAME;
  }, [location.pathname]);

  return null;
}


function App() {
  return (
    <BrowserRouter>
      <TitleHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
