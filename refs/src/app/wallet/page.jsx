"use client";
import React, { useState } from "react";
import Footer from "../../components/Footer";

function WalletPage() {
  const [userPoints, setUserPoints] = useState({
    current: 1250,
    dailyEarned: 85,
    weeklyEarned: 450
  });

  const [purchasePacks] = useState([
    { id: 1, name: "スターターパック", points: 500, price: "¥480", popular: false },
    { id: 2, name: "フォーチュンパック", points: 1500, price: "¥1,200", popular: true, bonus: "レアアイテム×1" },
    { id: 3, name: "プレミアムパック", points: 3500, price: "¥2,400", popular: false, bonus: "エピックアイテム×1" }
  ]);

  const [pointHistory] = useState([
    { id: 1, type: "earn", amount: 50, reason: "デイリーログイン", time: "2時間前" },
    { id: 2, type: "spend", amount: -80, reason: "追加占い", time: "3時間前" },
    { id: 3, type: "earn", amount: 30, reason: "AI質問回答", time: "5時間前" },
    { id: 4, type: "earn", amount: 100, reason: "7日連続ログイン", time: "昨日" }
  ]);

  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-24">
      <div className="p-4">
        {/* ヘッダー */}
        <div className="text-[#FF9494] text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">フォーチュンポイント</h1>
          <p className="text-sm opacity-80">占いを楽しむための通貨</p>
        </div>

        {/* 現在のFP残高 */}
        <div className="bg-gradient-to-br from-[#FF9494] to-[#FFB4B4] rounded-3xl p-6 mb-4 text-white">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">現在の残高</div>
            <div className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <i className="fas fa-coins text-yellow-300"></i>
              {userPoints.current.toLocaleString()}
            </div>
            <div className="flex justify-around text-sm">
              <div className="text-center">
                <div className="opacity-90">今日獲得</div>
                <div className="font-bold">+{userPoints.dailyEarned}</div>
              </div>
              <div className="text-center">
                <div className="opacity-90">今週獲得</div>
                <div className="font-bold">+{userPoints.weeklyEarned}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 購入パック */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#FF9494] mb-4 flex items-center gap-2">
            <i className="fas fa-shopping-cart"></i>
            ポイント購入
          </h2>
          <div className="space-y-3">
            {purchasePacks.map((pack) => (
              <div 
                key={pack.id} 
                className={`relative border-2 rounded-xl p-4 ${
                  pack.popular 
                    ? 'border-[#FF9494] bg-[#FFE4E4]' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-2 left-4 bg-[#FF9494] text-white px-3 py-1 rounded-full text-xs font-bold">
                    人気
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">{pack.name}</div>
                    <div className="text-sm text-[#FF9494] flex items-center gap-1">
                      <i className="fas fa-coins"></i>
                      {pack.points.toLocaleString()} FP
                    </div>
                    {pack.bonus && (
                      <div className="text-xs text-gray-600 mt-1">
                        + {pack.bonus}
                      </div>
                    )}
                  </div>
                  <button className="bg-[#FF9494] text-white px-6 py-2 rounded-full font-bold hover:bg-[#FF7979] transition-colors">
                    {pack.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ポイント履歴 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#FF9494] mb-4 flex items-center gap-2">
            <i className="fas fa-history"></i>
            ポイント履歴
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pointHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-[#FFF8F8] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <i className={`fas ${item.type === 'earn' ? 'fa-plus' : 'fa-minus'} text-sm`}></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{item.reason}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                </div>
                <div className={`font-bold ${
                  item.type === 'earn' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.amount > 0 ? '+' : ''}{item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer activePage="game" />
    </div>
  );
}

export default WalletPage; 