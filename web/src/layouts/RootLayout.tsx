// src/layouts/RootLayout.tsx

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; 
import { getCurrentUser } from '@/api/user';
import type { UserData } from '@/models'; 
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

// Updated Context Type
export interface OutletContextType {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const RootLayout: React.FC = () => {
  // Corrected state type
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // --- FIX for Error 2: Add back the search state ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- FIX for Error 2: Add back the search handler ---
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  // Your useEffect for checking login status is good
  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsAuthLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res.code === 200 && res.data) {
            setCurrentUser(res.data);
          } else {
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Token validation failed", error);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    };
    checkLoginStatus();
  }, [location.key]);

  if (isAuthLoading) {
    return <div>Loading Application...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      {/* --- FIX for Error 2: Pass all required props to Header --- */}
      <Header
        currentUser={currentUser}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearch}
      />
      <main style={styles.mainContent}>
        <Outlet context={{ currentUser, setCurrentUser }} />
      </main>
      <Footer />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f4f5f5',
  },
  mainContent: {
    flex: '1 0 auto',
  },
};

export default RootLayout;