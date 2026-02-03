"use client";
import React, { useState } from "react";
import Footer from "../../components/Footer";

function CharacterPage() {
  const [characterStats, setCharacterStats] = useState({
    currentLevel: 3,
    loginStreak: 30,
    totalLogins: 67,
    nextLevelDays: 30 // 次のレベルまでに必要な連続日数
  });

  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);

  const evolutionStages = [
    {
      level: 1,
      name: "見習い占い師",
      requiredDays: 0,
      description: "占いの世界に足を踏み入れたばかりの初心者",
      abilities: ["基本占い機能"],
      appearance: {
        body: "#FFE4E4",
        accessory: "📖",
        aura: "none"
      }
    },
    {
      level: 2,
      name: "駆け出し占い師",
      requiredDays: 7,
      description: "占いに慣れ親しみ、基本的な技術を身につけた",
      abilities: ["基本占い機能", "ログインボーナス+10%"],
      appearance: {
        body: "#FFE4E4",
        accessory: "🔮",
        aura: "glow"
      }
    },
    {
      level: 3,
      name: "熟練占い師",
      requiredDays: 30,
      description: "占いの技術が向上し、より深い洞察ができるように",
      abilities: ["基本占い機能", "ログインボーナス+10%", "追加占い10%割引"],
      appearance: {
        body: "#FFE4E4",
        accessory: "✨",
        aura: "sparkle"
      }
    },
    {
      level: 4,
      name: "マスター占い師",
      requiredDays: 60,
      description: "占いの奥義を修得し、星々の声を聞くことができる",
      abilities: ["基本占い機能", "ログインボーナス+10%", "追加占い10%割引", "AI質問報酬+10%"],
      appearance: {
        body: "#FFE4E4",
        accessory: "⭐",
        aura: "stars"
      }
    },
    {
      level: 5,
      name: "伝説の予言者",
      requiredDays: 100,
      description: "時空を超えた叡智を持つ、伝説に語り継がれる存在",
      abilities: ["基本占い機能", "ログインボーナス+15%", "追加占い15%割引", "AI質問報酬+15%", "全FP獲得+15%"],
      appearance: {
        body: "#FFE4E4",
        accessory: "👑",
        aura: "rainbow"
      }
    }
  ];

  const currentStage = evolutionStages[characterStats.currentLevel - 1];
  const nextStage = evolutionStages[characterStats.currentLevel] || null;
  const progress = nextStage 
    ? Math.min((characterStats.loginStreak / nextStage.requiredDays) * 100, 100)
    : 100;

  const renderCharacter = (stage, size = "large") => {
    const sizeClasses = {
      small: "w-16 h-16",
      medium: "w-24 h-24", 
      large: "w-32 h-32"
    };

    const textSizes = {
      small: "text-lg",
      medium: "text-2xl",
      large: "text-3xl"
    };

    return (
      <div className={`${sizeClasses[size]} bg-[${stage.appearance.body}] rounded-full relative overflow-hidden mx-auto`}>
        {/* 基本キャラクター */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 目 */}
          <div className="absolute top-6 left-6 w-4 h-4 bg-black rounded-full">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-6 right-6 w-4 h-4 bg-black rounded-full">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          </div>
          
          {/* 口 */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-full"></div>
          
          {/* 頬 */}
          <div className="absolute top-10 left-3 w-3 h-3 bg-[#FFB4B4] rounded-full opacity-50"></div>
          <div className="absolute top-10 right-3 w-3 h-3 bg-[#FFB4B4] rounded-full opacity-50"></div>
        </div>
        
        {/* アクセサリー */}
        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${textSizes[size]}`}>
          {stage.appearance.accessory}
        </div>
        
        {/* オーラエフェクト */}
        {stage.appearance.aura === "glow" && (
          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-[#FF9494] to-transparent opacity-30"></div>
        )}
        
        {stage.appearance.aura === "sparkle" && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-2 right-2 animate-bounce">✨</div>
            <div className="absolute bottom-2 left-2 animate-bounce delay-300">✨</div>
          </div>
        )}
        
        {stage.appearance.aura === "stars" && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-1 right-4 animate-twinkle">⭐</div>
            <div className="absolute bottom-1 left-4 animate-twinkle delay-500">⭐</div>
            <div className="absolute top-4 left-1 animate-twinkle delay-1000">⭐</div>
          </div>
        )}
        
        {stage.appearance.aura === "rainbow" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 opacity-20 animate-spin-slow"></div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-24">
      <div className="p-4">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#FF9494] mb-2">占い師の成長</h1>
          <p className="text-sm text-gray-600">ログインを続けてキャラクターを進化させよう</p>
        </div>

        {/* 現在のキャラクター */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <div className="text-center mb-4">
            {renderCharacter(currentStage)}
            <h2 className="text-xl font-bold text-[#FF9494] mt-4">{currentStage.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{currentStage.description}</p>
          </div>

          {/* ステータス */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#FFE4E4] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[#FF9494]">{characterStats.currentLevel}</div>
              <div className="text-xs text-gray-600">レベル</div>
            </div>
            <div className="bg-[#FFE4E4] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[#FF9494]">{characterStats.loginStreak}</div>
              <div className="text-xs text-gray-600">連続ログイン</div>
            </div>
          </div>

          {/* スキル一覧 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-2">現在のスキル</h3>
            <div className="space-y-2">
              {currentStage.abilities.map((ability, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-gray-700">{ability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 進化進捗 */}
        {nextStage && (
          <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
            <h3 className="font-bold text-[#FF9494] mb-4">次の進化まで</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                {renderCharacter(currentStage, "small")}
                <div className="text-xs text-gray-600 mt-1">現在</div>
              </div>
              
              <div className="flex-1">
                <div className="h-2 bg-[#FFE4E4] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF9494] to-[#FFB4B4] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-gray-600 mt-1">
                  {characterStats.loginStreak} / {nextStage.requiredDays} 日
                </div>
              </div>
              
              <div className="text-center">
                {renderCharacter(nextStage, "small")}
                <div className="text-xs text-gray-600 mt-1">次のレベル</div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-gray-800">{nextStage.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{nextStage.description}</p>
              <div className="text-sm text-[#FF9494] mt-2">
                あと {nextStage.requiredDays - characterStats.loginStreak} 日で進化！
              </div>
            </div>

            {/* 次のレベルで解放されるスキル */}
            <div className="mt-4">
              <h5 className="font-bold text-gray-800 mb-2">新しく習得するスキル</h5>
              <div className="space-y-2">
                {nextStage.abilities.filter(ability => 
                  !currentStage.abilities.includes(ability)
                ).map((ability, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <i className="fas fa-star text-yellow-500"></i>
                    <span className="text-gray-700">{ability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 進化の歴史 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-[#FF9494] mb-4">進化の軌跡</h3>
          <div className="space-y-4">
            {evolutionStages.map((stage, index) => (
              <div 
                key={stage.level}
                className={`flex items-center gap-4 p-3 rounded-xl ${
                  stage.level <= characterStats.currentLevel 
                    ? 'bg-[#FFE4E4]' 
                    : 'bg-gray-100'
                }`}
              >
                {renderCharacter(stage, "small")}
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{stage.name}</div>
                  <div className="text-sm text-gray-600">
                    {stage.requiredDays === 0 ? '初期' : `${stage.requiredDays}日連続ログイン`}
                  </div>
                </div>
                <div className="text-right">
                  {stage.level <= characterStats.currentLevel ? (
                    <i className="fas fa-check-circle text-green-500 text-xl"></i>
                  ) : stage.level === characterStats.currentLevel + 1 ? (
                    <div className="text-[#FF9494] text-sm font-bold">
                      {Math.round(progress)}%
                    </div>
                  ) : (
                    <i className="fas fa-lock text-gray-400 text-xl"></i>
                  )}
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

export default CharacterPage; 