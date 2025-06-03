import React from 'react'

export default function Header({ toggleSidebar }){
    return (
       <div className='h-[8%] w-full border-b-2 border-gray-400/20 flex items-center justify-between px-3 py-5'>

            <div className="LeftSide flex h-full items-center">
                <div className="GreenDot h-12 w-12 bg-gradient-to-b from-green-400 via-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold ">
                    i
                </div>
                <h4 className='text-white font-bold sm:block hidden ms-2 text-2xl'>IdharUdhar</h4>
                <button 
                  className="MenuToggle-button h-8 w-8 bg-green-600/30 rounded-full flex justify-center items-center text-green-700/90 ms-4 md:hidden"
                  onClick={toggleSidebar}
                >
                    <i className="fas fa-stream"></i>
                </button>
            </div>

            <div className="Right-side h-full flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                <div className="InputBox h-7 md:h-8 lg:h-9 w-30 sm:w-40 md:w-50 sm:block hidden relative">
                    <input 
                        type="text" 
                        placeholder='Search..' 
                        className='bg-gray-800/60 h-full w-full rounded-full border border-gray-400/20 text-gray-400 ps-7 md:ps-8 lg:ps-9 text-xs md:text-sm' 
                    />
                    <i className="fas fa-search absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
                </div>

                <div className="notifications h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/60 hover:text-green-200 transition-all duration-200 text-xs md:text-sm">
                    <i className="far fa-comment-alt"></i>
                    <div className="NotificationDot absolute -right-1 top-0 h-2 w-2 md:h-3 md:w-3 bg-green-400 rounded-full text-[8px] md:text-[10px] text-white flex items-center justify-center">
                        2
                    </div>
                </div>
                <div className="Messages h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/60 hover:text-green-200 transition-all duration-200 text-xs md:text-sm">
                    <i className="fas fa-paperclip"></i>
                    <div className="NotificationDot absolute -right-1 top-0 h-2 w-2 md:h-3 md:w-3 bg-green-400 rounded-full text-[8px] md:text-[10px] text-white flex items-center justify-center">
                        3
                    </div>
                </div>
                <div className="profileButton h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white flex items-center justify-center font-semibold hover:bg-gradient-to-l transition-all duration-700 text-xs md:text-sm lg:text-base">
                    Ar
                </div>
            </div>
        </div>
    )
}