"use client";
import React, { useState } from "react";
import Footer from "../../components/Footer";

function MainComponent() {
  const [userProfile, setUserProfile] = useState({
    name: "山田 花子",
    birthDate: "1990-04-15",
    zodiacSign: "おひつじ座",
    notificationEnabled: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  // 生年月日から天干を計算する関数
  const calculateHeavenlyStem = (birthDate) => {
    const heavenlyStems = ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"];
    const year = new Date(birthDate).getFullYear();
    return heavenlyStems[year % 10];
  };

  // 天干の説明
  const getHeavenlyStemDescription = (stem) => {
    const descriptions = {
      "甲": { element: "木", nature: "陽", character: "大樹のように力強く成長する" },
      "乙": { element: "木", nature: "陰", character: "草花のようにしなやかで繊細" },
      "丙": { element: "火", nature: "陽", character: "太陽のように明るく情熱的" },
      "丁": { element: "火", nature: "陰", character: "灯火のように温かく穏やか" },
      "戊": { element: "土", nature: "陽", character: "山のようにどっしりと安定" },
      "己": { element: "土", nature: "陰", character: "田畑のように優しく育む" },
      "庚": { element: "金", nature: "陽", character: "剣のように鋭く正義感が強い" },
      "辛": { element: "金", nature: "陰", character: "宝石のように繊細で美しい" },
      "壬": { element: "水", nature: "陽", character: "大河のように雄大で自由" },
      "癸": { element: "水", nature: "陰", character: "雨露のように静かで潤す" }
    };
    return descriptions[stem] || { element: "不明", nature: "不明", character: "不明" };
  };

  const heavenlyStem = calculateHeavenlyStem(userProfile.birthDate);
  const stemInfo = getHeavenlyStemDescription(heavenlyStem);

  return (
    <div className="relative flex h-screen flex-col bg-gradient-to-b from-pink-50 via-purple-50 to-white overflow-hidden">
      {/* ヘッダー */}
      <div className="relative z-10 pt-4 px-4 pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-light text-gray-800 tracking-wide">
            プロフィール
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 flex items-center justify-center transition-all"
          >
            {isEditing ? (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="relative flex-1 flex flex-col pb-20 overflow-hidden">
        <div className="px-4 py-2">
          <div className="space-y-3">
            {/* プロフィールカード */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-light text-gray-800 mb-0.5">
                    {userProfile.name}
                  </h2>
                  <p className="text-xs font-light text-gray-500">
                    {userProfile.zodiacSign}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-light text-gray-600 uppercase tracking-wide mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-xl bg-white/80 border border-white/60 text-sm text-gray-800 font-light focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-60 transition-all"
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-light text-gray-600 uppercase tracking-wide mb-1.5">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={userProfile.birthDate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-xl bg-white/80 border border-white/60 text-sm text-gray-800 font-light focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-60 transition-all"
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 天干カード */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-light text-gray-800 mb-3 tracking-wide">
                あなたの天干
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center shadow-md">
                  <span className="text-2xl font-light text-white">{heavenlyStem}</span>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-600">
                    五行: <span className="font-medium text-gray-800">{stemInfo.element}</span>
                  </p>
                  <p className="text-xs font-light text-gray-600 mt-0.5">
                    性質: <span className="font-medium text-gray-800">{stemInfo.nature}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-3 border border-white/40">
                <p className="text-xs font-light text-gray-700 leading-relaxed">
                  {stemInfo.character}
                </p>
              </div>
            </div>

            {/* 設定カード */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-light text-gray-800 mb-3 tracking-wide">
                設定
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-gray-800">通知</p>
                  <p className="text-[10px] font-light text-gray-500 mt-0.5">
                    運勢の通知を受け取る
                  </p>
                </div>
                <button
                  onClick={() =>
                    isEditing &&
                    setUserProfile({
                      ...userProfile,
                      notificationEnabled: !userProfile.notificationEnabled,
                    })
                  }
                  disabled={!isEditing}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    userProfile.notificationEnabled
                      ? "bg-gradient-to-r from-pink-400 to-pink-500"
                      : "bg-gray-300"
                  } ${!isEditing && "opacity-50"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      userProfile.notificationEnabled
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer activePage="profile" />
      </div>
    </div>
  );
}

export default MainComponent;