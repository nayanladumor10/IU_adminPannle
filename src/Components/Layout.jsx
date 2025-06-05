import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import MainSideBar from "./MainSideBar"
import LoginForm from "../Pages/login/LoginForm"
import { ThemeProvider } from "../context/ThemeContext"

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token")
      setIsAuthenticated(!!token)
      setLoading(false)
    }
    checkAuth()
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLoginSuccess = () => {
    localStorage.setItem("admin_token", "your_auth_token_here")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
          <div className="MainContent flex flex-1 overflow-hidden">
            <MainSideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div
              className={`MainScreen flex-1 overflow-y-auto transition-all duration-300`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  )
}