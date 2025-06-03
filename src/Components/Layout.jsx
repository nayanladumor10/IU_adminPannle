import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import MainSideBar from './MainSideBar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className='h-screen w-screen bg-gray-900 flex flex-col'>
      <Header toggleSidebar={toggleSidebar}/>
      <div className="MainContent flex flex-1 overflow-hidden">
        <MainSideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
        <div className={`MainScreen flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'md:ml-20' : 'ml-0 md:ml-20'
        }`}>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}