"use client";
import React from "react";

function Footer({ activePage }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="flex justify-around items-center h-20 px-1">
        <a
          href="/home"
          className={`flex flex-col items-center justify-center px-1 ${
            activePage === 'home' 
              ? 'w-16 h-16 bg-gradient-to-br from-[#FF9494] to-[#FFB4B4] rounded-full text-white transform -translate-y-4 shadow-lg'
              : 'text-[#FFB4B4] hover:text-[#FF9494] transition-colors'
          }`}
        >
          <i className={`fas fa-home ${activePage === 'home' ? 'text-xl' : 'text-2xl mb-1'}`}></i>
          <span className="text-[9px] font-medium hidden min-[360px]:block">ホーム</span>
        </a>
        
        <a
          href="/"
          className={`flex flex-col items-center justify-center px-1 ${
            activePage === 'calendar' 
              ? 'w-16 h-16 bg-gradient-to-br from-[#FF9494] to-[#FFB4B4] rounded-full text-white transform -translate-y-4 shadow-lg'
              : 'text-[#FFB4B4] hover:text-[#FF9494] transition-colors'
          }`}
        >
          <i className={`fas fa-calendar-alt ${activePage === 'calendar' ? 'text-xl' : 'text-2xl mb-1'}`}></i>
          <span className="text-[9px] font-medium hidden min-[360px]:block">占い</span>
        </a>
        
        <a
          href="/game"
          className={`flex flex-col items-center justify-center px-1 relative ${
            activePage === 'game' 
              ? 'w-16 h-16 bg-gradient-to-br from-[#FF9494] to-[#FFB4B4] rounded-full text-white transform -translate-y-4 shadow-lg'
              : 'text-[#FFB4B4] hover:text-[#FF9494] transition-colors'
          }`}
        >
          <i className={`fas fa-gamepad ${activePage === 'game' ? 'text-xl' : 'text-2xl mb-1'}`}></i>
          <span className="text-[9px] font-medium hidden min-[360px]:block">メニュー</span>
          {/* 通知バッジ - 新しいクエストがある場合 */}
          {activePage !== 'game' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          )}
        </a>
        
        <a
          href="/profile"
          className={`flex flex-col items-center justify-center px-1 ${
            activePage === 'profile' 
              ? 'w-16 h-16 bg-gradient-to-br from-[#FF9494] to-[#FFB4B4] rounded-full text-white transform -translate-y-4 shadow-lg'
              : 'text-[#FFB4B4] hover:text-[#FF9494] transition-colors'
          }`}
        >
          <i className={`fas fa-cog ${activePage === 'profile' ? 'text-xl' : 'text-2xl mb-1'}`}></i>
          <span className="text-[9px] font-medium hidden min-[360px]:block">設定</span>
        </a>
      </div>
    </div>
  );
}

export default Footer; 