import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import MainSideBar from './MainSideBar';
import LoginForm from '../Pages/login/LoginForm';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check authentication status (replace with your actual auth check)
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, you would verify the token with your backend
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLoginSuccess = () => {
    // In a real app, you would store the token from your API response
    localStorage.setItem('admin_token', 'your_auth_token_here');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        // Show login form if not authenticated
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        // Show dashboard if authenticated
        <div className='h-screen w-screen bg-gray-900 flex flex-col'>
          <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
          <div className="MainContent flex flex-1 overflow-hidden">
            <MainSideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`MainScreen flex-1 overflow-y-auto transition-all duration-300 ${
              sidebarOpen ? 'md:ml-20' : 'ml-0 md:ml-20'
            }`}>
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
