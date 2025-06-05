import React, { useState, useRef, useEffect } from 'react';

export default function Header({ toggleSidebar,onLogout  }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [activeMessageTab, setActiveMessageTab] = useState('all');
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New message from John", time: "2 mins ago", read: false, icon: "fa-envelope" },
        { id: 2, text: "Payment received of $250", time: "1 hour ago", read: true, icon: "fa-dollar-sign" },
        { id: 3, text: "Your subscription is expiring soon", time: "5 hours ago", read: false, icon: "fa-exclamation-circle" },
        { id: 4, text: "New feature available: Dark Mode", time: "1 day ago", read: true, icon: "fa-bell" }
    ]);
    
    const [messages, setMessages] = useState([
        { id: 1, sender: "John Doe", text: "Hey, how are you doing with the project?", time: "10:30 AM", unread: true, avatar: "JD" },
        { id: 2, sender: "Sarah Smith", text: "Meeting at 2 PM tomorrow", time: "Yesterday", unread: true, avatar: "SS" },
        { id: 3, sender: "Support Team", text: "Your ticket #4567 has been resolved", time: "Jul 12", unread: false, avatar: "ST" },
        { id: 4, sender: "Alex Johnson", text: "Please review the documents I shared", time: "Jul 10", unread: false, avatar: "AJ" }
    ]);
    
    const notificationsRef = useRef(null);
    const messagesRef = useRef(null);
    const profileRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target) && 
                !event.target.closest('.notifications')) {
                setShowNotifications(false);
            }
            if (messagesRef.current && !messagesRef.current.contains(event.target) && 
                !event.target.closest('.Messages')) {
                setShowMessages(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target) && 
                !event.target.closest('.profileButton')) {
                setShowProfile(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowMessages(false);
        setShowProfile(false);
    };
    
    const toggleMessages = () => {
        setShowMessages(!showMessages);
        setShowNotifications(false);
        setShowProfile(false);
    };
    
    const toggleProfile = () => {
        setShowProfile(!showProfile);
        setShowNotifications(false);
        setShowMessages(false);
    };
    
    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(notification => 
            notification.id === id ? {...notification, read: true} : notification
        ));
    };
    
    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({...notification, read: true})));
    };
    
    const markMessageAsRead = (id) => {
        setMessages(messages.map(message => 
            message.id === id ? {...message, unread: false} : message
        ));
    };
    
    const filteredMessages = activeMessageTab === 'unread' 
        ? messages.filter(m => m.unread)
        : messages;
    
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    const unreadMessagesCount = messages.filter(m => m.unread).length;

    return (
        <div className='h-[8%] w-full border-b-2 border-gray-400/20 flex items-center justify-between px-3 py-5'>
            {/* Left Side - Logo and Menu */}
            <div className="LeftSide flex h-full items-center">
                <div className="GreenDot h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 bg-gradient-to-b from-green-400 via-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold ">
                    i
                </div>
                <h4 className='text-white font-bold sm:block hidden ms-2 text-2xl'>IdharUdhar</h4>
                <button 
                    className="MenuToggle-button h-8 w-8 bg-green-600/30 rounded-full flex justify-center items-center text-green-700/90 ms-4 md:hidden hover:bg-green-600/50 transition-colors duration-200"
                    onClick={toggleSidebar}
                >
                    <i className="fas fa-stream"></i>
                </button>
            </div>

            {/* Right Side - Search and Icons */}
            <div className="Right-side h-full flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                <div className="InputBox h-7 md:h-8 lg:h-9 w-30 sm:w-40 md:w-50 sm:block hidden relative">
                    <input 
                        type="text" 
                        placeholder='Search..' 
                        className='bg-gray-800/60 h-full w-full rounded-full border border-gray-400/20 text-gray-400 ps-7 md:ps-8 lg:ps-9 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all duration-200' 
                    />
                    <i className="fas fa-search absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
                </div>

                {/* Notifications Dropdown */}
                <div className="relative">
                    <div 
                        className="notifications h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/60 hover:text-green-200 transition-all duration-200 text-xs md:text-sm cursor-pointer"
                        onClick={toggleNotifications}
                    >
                        <i className="far fa-bell"></i>
                        {unreadNotificationsCount > 0 && (
                            <div className="NotificationDot absolute -right-1 top-0 h-2 w-2 md:h-3 md:w-3 bg-green-400 rounded-full text-[8px] md:text-[10px] text-white flex items-center justify-center">
                                {unreadNotificationsCount}
                            </div>
                        )}
                    </div>
                    
                    {showNotifications && (
                        <div 
                            ref={notificationsRef}
                            className="absolute sm:right-0 -right-14 mt-2 sm:w-80 w-60 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 transform transition-all duration-200 origin-top"
                            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="text-white font-semibold">Notifications</h3>
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-green-400 text-xs hover:underline"
                                >
                                    Mark all as read
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-400">
                                        No notifications available
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors duration-150 flex items-start ${!notification.read ? 'bg-gray-700/30' : ''}`}
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-600/30' : 'bg-green-500/20'} mr-3`}>
                                                <i className={`fas ${notification.icon} ${notification.read ? 'text-gray-400' : 'text-green-400'} text-sm`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm truncate ${notification.read ? 'text-gray-300' : 'text-white font-medium'}`}>
                                                    {notification.text}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                                            </div>
                                            {!notification.read && (
                                                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-3 text-center border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
                                <button className="text-green-400 text-sm hover:underline font-medium">
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Messages Dropdown */}
                <div className="relative">
                    <div 
                        className="Messages h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/60 hover:text-green-200 transition-all duration-200 text-xs md:text-sm cursor-pointer"
                        onClick={toggleMessages}
                    >
                        <i className="far fa-comment-alt"></i>
                        {unreadMessagesCount > 0 && (
                            <div className="NotificationDot absolute -right-1 top-0 h-2 w-2 md:h-3 md:w-3 bg-green-400 rounded-full text-[8px] md:text-[10px] text-white flex items-center justify-center">
                                {unreadMessagesCount}
                            </div>
                        )}
                    </div>
                    
                    {showMessages && (
                        <div 
                            ref={messagesRef}
                            className="absolute  sm:right-0 -right-10 mt-2 sm:w-80 w-60 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 transform transition-all duration-200 origin-top"
                            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div className="p-3 border-b border-gray-700">
                                <h3 className="text-white font-semibold">Messages</h3>
                                <div className="flex mt-2 border-b border-gray-700 -mx-3">
                                    <button 
                                        className={`flex-1 py-1 text-xs font-medium ${activeMessageTab === 'all' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setActiveMessageTab('all')}
                                    >
                                        All Messages
                                    </button>
                                    <button 
                                        className={`flex-1 py-1 text-xs font-medium ${activeMessageTab === 'unread' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setActiveMessageTab('unread')}
                                    >
                                        Unread ({unreadMessagesCount})
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {filteredMessages.length === 0 ? (
                                    <div className="p-4 text-center text-gray-400">
                                        No messages found
                                    </div>
                                ) : (
                                    filteredMessages.map(message => (
                                        <div 
                                            key={message.id} 
                                            className={`p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors duration-150 flex items-start ${message.unread ? 'bg-gray-700/30' : ''}`}
                                            onClick={() => markMessageAsRead(message.id)}
                                        >
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium mr-3">
                                                {message.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <h4 className={`text-sm truncate ${message.unread ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                        {message.sender}
                                                    </h4>
                                                    <span className="text-gray-400 text-xs ml-2 whitespace-nowrap">
                                                        {message.time}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-xs mt-1 truncate">
                                                    {message.text}
                                                </p>
                                            </div>
                                            {message.unread && (
                                                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-3 text-center border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
                                <button className="text-green-400 text-sm hover:underline font-medium">
                                    View All Messages
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative">
                    <div 
                        className="profileButton h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white flex items-center justify-center font-semibold hover:bg-gradient-to-l transition-all duration-700 text-xs md:text-sm lg:text-base cursor-pointer shadow-lg hover:shadow-green-500/20"
                        onClick={toggleProfile}
                    >
                        Ar
                    </div>
                    
                    {showProfile && (
                        <div 
                            ref={profileRef}
                            className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 transform transition-all duration-200 origin-top"
                            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white flex items-center justify-center font-semibold shadow-md">
                                        Ar
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-white font-medium">Aryan</p>
                                        <p className="text-gray-400 text-xs">admin@idharudhar.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-1">
                                <a href="#" className="blck px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center">
                                    <i className="fas fa-user-circle mr-3 text-gray-400 w-4 text-center"></i>
                                    Your Profile
                                </a>
                                <a href="#" className="blck px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center">
                                    <i className="fas fa-cog mr-3 text-gray-400 w-4 text-center"></i>
                                    Settings
                                </a>
                                <a href="#" className="blck px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center">
                                    <i className="fas fa-credit-card mr-3 text-gray-400 w-4 text-center"></i>
                                    Billing
                                </a>
                                <a href="#" className="blck px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center">
                                    <i className="fas fa-tachometer-alt mr-3 text-gray-400 w-4 text-center"></i>
                                    Dashboard
                                </a>
                            </div>
                            <div className="py-1 border-t border-gray-700" onClick={onLogout}>
                                <a href="#" className="blck px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-150 flex items-center">
                                    <i className="fas fa-sign-out-alt mr-3 w-4 text-center"></i>
                                    Sign out
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
