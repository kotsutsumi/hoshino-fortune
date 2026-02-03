"use client";
import React, { useState } from "react";
import Footer from "../../components/Footer";

function GamePage() {
  // 現在の年を取得
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);

  // 月の情報（1-12月）
  const months = [
    { id: 1, name: "1月", theme: "新年の輝き", color: "from-red-400 to-pink-500", emoji: "🎍" },
    { id: 2, name: "2月", theme: "冬の温もり", color: "from-pink-400 to-rose-500", emoji: "💝" },
    { id: 3, name: "3月", theme: "春の息吹", color: "from-pink-300 to-purple-400", emoji: "🌸" },
    { id: 4, name: "4月", theme: "桜色の夢", color: "from-pink-200 to-purple-300", emoji: "🌺" },
    { id: 5, name: "5月", theme: "新緑の輝き", color: "from-green-400 to-emerald-500", emoji: "🌿" },
    { id: 6, name: "6月", theme: "梅雨の静寂", color: "from-blue-300 to-indigo-400", emoji: "☔" },
    { id: 7, name: "7月", theme: "夏空の青", color: "from-blue-400 to-cyan-500", emoji: "🌊" },
    { id: 8, name: "8月", theme: "太陽の祭り", color: "from-orange-400 to-yellow-500", emoji: "☀️" },
    { id: 9, name: "9月", theme: "秋の始まり", color: "from-amber-400 to-orange-500", emoji: "🍂" },
    { id: 10, name: "10月", theme: "紅葉の彩り", color: "from-red-500 to-orange-600", emoji: "🍁" },
    { id: 11, name: "11月", theme: "晩秋の静けさ", color: "from-amber-600 to-brown-500", emoji: "🍃" },
    { id: 12, name: "12月", theme: "冬の奇跡", color: "from-blue-600 to-indigo-700", emoji: "❄️" },
  ];

  // 壁紙の詳細を取得
  const getWallpaperDetails = (month) => {
    return {
      title: `${selectedYear}年${month.name}の壁紙`,
      theme: month.theme,
      description: `${month.name}のテーマ「${month.theme}」に合わせて特別にデザインされた壁紙です。この月の運気を高める色彩とデザインが施されています。`,
      // 実際の壁紙画像URLをここに設定（現在はプレースホルダー）
      imageUrl: `/wallpapers/${selectedYear}/${month.id}.jpg`,
      downloadUrl: `/wallpapers/${selectedYear}/${month.id}-full.jpg`,
    };
  };

  // 月カードをクリックした時
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setShowWallpaperModal(true);
  };

  // ダウンロードボタン
  const handleDownload = (wallpaper) => {
    // 実際のダウンロード処理（画像が存在する場合）
    const link = document.createElement('a');
    link.href = wallpaper.downloadUrl;
    link.download = `${selectedYear}年${wallpaper.title}.jpg`;
    // 画像が存在しない場合はアラートを表示
    alert(`${wallpaper.title}をダウンロードします`);
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="relative flex h-screen flex-col bg-gradient-to-b from-pink-50 via-purple-50 to-white overflow-hidden">
      {/* ヘッダー */}
      <div className="relative z-10">
        <div className="w-full bg-white/40 backdrop-blur-md border-b border-white/60 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* 左側：タイトル */}
              <h1 className="text-lg font-light text-gray-800 tracking-[0.12em]">
                月替わり壁紙
              </h1>
              
              {/* 右側：年選択 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
                >
                  ＜
                </button>
                <span className="text-base font-light text-gray-800 tracking-wide min-w-[4rem] text-center">
                  {selectedYear}年
                </span>
                <button
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
                >
                  ＞
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative flex-1 flex flex-col pb-24 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* 説明文 */}
          <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-200/60 shadow-sm">
            <p className="text-sm font-light leading-relaxed text-gray-800 text-center">
              毎月テーマに合わせた特別な壁紙を配布しています。<br />
              お気に入りの月の壁紙をダウンロードしてお楽しみください。
            </p>
          </div>

          {/* 月のグリッド */}
          <div className="grid grid-cols-3 gap-4">
            {months.map((month) => (
              <button
                key={month.id}
                onClick={() => handleMonthClick(month)}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {/* グラデーション背景 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${month.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* コンテンツ */}
                <div className="relative flex flex-col items-center gap-2">
                  {/* 絵文字 */}
                  <div className="text-4xl mb-1">
                    {month.emoji}
                  </div>
                  
                  {/* 月名 */}
                  <div className={`text-base font-medium bg-gradient-to-r ${month.color} bg-clip-text text-transparent`}>
                    {month.name}
                  </div>
                  
                  {/* テーマ */}
                  <div className="text-xs font-light text-gray-600 text-center">
                    {month.theme}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 壁紙詳細モーダル */}
      {showWallpaperModal && selectedMonth && (
        <div
          className="fixed inset-0 bg-pink-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowWallpaperModal(false);
            setSelectedMonth(null);
          }}
        >
          <div
            className="bg-gradient-to-b from-pink-50 via-white to-pink-50/50 rounded-3xl p-6 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-pink-200/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="text-xl font-light bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent tracking-wide">
                {selectedYear}年 {selectedMonth.name}
              </h3>
              <button
                onClick={() => {
                  setShowWallpaperModal(false);
                  setSelectedMonth(null);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-100/80 backdrop-blur-sm text-pink-600 hover:bg-pink-200 hover:text-pink-700 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
              <div className="space-y-6">
                {/* 壁紙プレビュー */}
                <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-4 border border-pink-200/60 shadow-sm">
                  <div className={`aspect-[9/16] bg-gradient-to-br ${selectedMonth.color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                    {/* プレースホルダー画像 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">{selectedMonth.emoji}</div>
                      <div className="text-white text-2xl font-light drop-shadow-lg">
                        {selectedYear}
                      </div>
                      <div className="text-white text-xl font-light drop-shadow-lg">
                        {selectedMonth.name}
                      </div>
                    </div>
                    {/* 実際の画像がある場合はここに表示 */}
                    {/* <img 
                      src={getWallpaperDetails(selectedMonth).imageUrl}
                      alt={getWallpaperDetails(selectedMonth).title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    /> */}
                  </div>
                </div>

                {/* テーマ情報 */}
                <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-5 border border-pink-200/60 shadow-sm">
                  <div className="mb-3">
                    <p className="text-xs font-light text-pink-600 uppercase tracking-wide mb-1">Theme</p>
                    <p className={`text-lg font-medium bg-gradient-to-r ${selectedMonth.color} bg-clip-text text-transparent`}>
                      {selectedMonth.theme}
                    </p>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-gray-800">
                    {getWallpaperDetails(selectedMonth).description}
                  </p>
                </div>

                {/* ダウンロードボタン */}
                <button
                  onClick={() => handleDownload(getWallpaperDetails(selectedMonth))}
                  className={`w-full bg-gradient-to-r ${selectedMonth.color} text-white py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-light text-base`}
                >
                  壁紙をダウンロード
                </button>

                {/* 注意事項 */}
                <div className="text-xs text-gray-500 font-light text-center space-y-1">
                  <p>※ 壁紙は個人利用のみ可能です</p>
                  <p>※ 高解像度版がダウンロードされます</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ボトムナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer activePage="game" />
      </div>
    </div>
  );
}

export default GamePage; 