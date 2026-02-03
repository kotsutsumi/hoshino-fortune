"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { Send } from "lucide-react";

function MainComponent() {
  // 占いデータ（モック）
  const [fortuneData, setFortuneData] = useState({
    date: new Date(),
    luck: "⭐️⭐️⭐️⭐️",
    todayMessage: "今日は新しいチャレンジに最適な日。直感を信じて行動することで、思わぬ幸運が舞い込みます。午後からは人との交流が運気アップの鍵に。",
    luckyColor: "Lavender",
    luckyColorCode: "#E6E6FA",
  });

  // 運勢ポップアップの開閉状態
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false);

  // ゲーミフィケーション要素の状態を追加
  const [gameData, setGameData] = useState({
    fortunePoints: 1250,
    loginStreak: 7,
    dailyQuestCompleted: false,
    todayLogin: true,
    rewardClaimed: false
  });

  // マツコAIの状態
  const [userMessage, setUserMessage] = useState(""); // ユーザーの最新メッセージ
  const [aiResponse, setAiResponse] = useState(""); // AIの最新返答
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [questAnswer, setQuestAnswer] = useState(""); // 入力中のテキスト
  const [conversationHistory, setConversationHistory] = useState([]); // 会話履歴

  // デイリークエストの質問
  const [dailyQuestions] = useState([
    "今日何か悩んでることある？",
    "最近モヤモヤしてること、ある？",
    "今の気分、教えてちょうだい",
    "何か相談したいことある？",
    "気になってることがあったら言いなさいよ"
  ]);

  const [currentQuestionIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [expandedItems, setExpandedItems] = useState({
    color: false,
    item: false,
    number: false,
  });

  // キャラクターのアニメーション状態
  const [characterAnimation, setCharacterAnimation] = useState("idle");

  // キーボード表示対応
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        document.documentElement.style.setProperty(
          '--viewport-height',
          `${viewport.height}px`
        );
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const toggleItem = (itemKey) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleCharacterClick = () => {
    setCharacterAnimation("happy");
    setTimeout(() => setCharacterAnimation("idle"), 1000);
  };

  // ログイン報酬クリック
  const claimDailyReward = () => {
    setGameData(prev => ({
      ...prev,
      rewardClaimed: true,
      fortunePoints: prev.fortunePoints + 50 + (prev.loginStreak * 5) // ベース50 + 連続ボーナス
    }));
  };

  // マツコAIに相談を送信
  const handleQuestSubmit = async () => {
    if (!questAnswer.trim() || isLoadingAI) return;

    const message = questAnswer.trim();
    
    // ユーザーメッセージを保存
    setUserMessage(message);
    setQuestAnswer("");
    setIsLoadingAI(true);

    try {
      const response = await fetch('/api/chat-counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory // 会話履歴を送信
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // マツコAIの返答を保存
        setAiResponse(data.aiResponse);
        
        // 会話履歴に追加（最新10件まで保持）
        setConversationHistory(prev => {
          const newHistory = [
            ...prev,
            { role: 'user', content: message },
            { role: 'assistant', content: data.aiResponse }
          ];
          // 最新10件まで保持（20ターン = 10往復）
          return newHistory.slice(-20);
        });
        
        // クエスト完了
        if (!gameData.dailyQuestCompleted) {
          setGameData(prev => ({
            ...prev,
            dailyQuestCompleted: true,
            fortunePoints: prev.fortunePoints + 100
          }));
        }
      }
    } catch (error) {
      console.error('マツコAI Error:', error);
      // エラー時のフォールバック
      setAiResponse('ごめん、今ちょっと調子悪いのよ。また後で話しましょ。');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-white">
      {/* ヘッダー（帯状） */}
      <div className="relative z-20 bg-white">
        {/* 今日の運勢バナー */}
        <div className="w-full bg-white/40 backdrop-blur-md border-b border-white/60 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* 左側：アプリ名 */}
              <h1 className="text-lg font-light text-gray-800 tracking-[0.12em]">
                今日の運勢
              </h1>
              
              {/* 右側：運勢スコア + ボタン */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-light tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {fortuneData.luck}
                </span>
                <button
                  onClick={() => setIsFortuneModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-light rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  運勢を見る
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 運勢ポップアップモーダル */}
      {isFortuneModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsFortuneModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-md mx-4 w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light text-white tracking-wide">
                  今日の運勢
                </h2>
                <button
                  onClick={() => setIsFortuneModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* モーダルコンテンツ */}
            <div className="px-6 py-6 space-y-6">
              {/* 運勢スコア */}
              <div className="text-center">
                <div className="text-5xl mb-2">{fortuneData.luck}</div>
                <p className="text-sm text-gray-600 font-light">
                  {new Date(fortuneData.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* 占い結果メッセージ */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 tracking-wide">今日のメッセージ</h3>
                <p className="text-sm font-light leading-relaxed text-gray-800 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4">
                  {fortuneData.todayMessage}
                </p>
              </div>
              
              {/* ラッキーカラー */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 tracking-wide">ラッキーカラー</h3>
                <div className="flex items-center gap-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4">
                  <div 
                    className="w-12 h-12 rounded-full shadow-md border-2 border-white"
                    style={{ backgroundColor: fortuneData.luckyColorCode }}
                  ></div>
                  <span className="text-base font-light text-gray-800">{fortuneData.luckyColor}</span>
                </div>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsFortuneModalOpen(false)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 font-light"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツエリア */}
      <div className="relative flex-1 overflow-hidden">
        {/* 背景画像（このエリア全体に表示） */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background.png')",
          }}
        >
          {/* 背景画像がない場合は白背景が表示される */}
        </div>

        {/* キャラクター画像（全画面表示） */}
        <div className="absolute inset-0 flex items-start justify-center">
        <button
          onClick={handleCharacterClick}
          className="relative transition-transform duration-200 hover:scale-105 active:scale-95 w-full flex items-start justify-center"
        >
          {/* 画像ファイルを使用 */}
          <div className={`transition-transform duration-200 ${characterAnimation === "happy" ? "scale-110" : "scale-100"} relative w-full`}>
            <img 
              src="/character.png" 
              alt="キャラクター" 
              className="w-full max-w-full h-auto object-contain object-top"
              onError={(e) => {
                // 画像が見つからない場合は非表示
                e.target.style.display = 'none';
              }}
            />
          </div>
          {characterAnimation === "happy" && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <div className="text-6xl animate-bounce">♪</div>
            </div>
          )}
        </button>
      </div>
      </div>

      {/* チャットエリア（画像の上に被せて表示） */}
      <div className="absolute bottom-32 left-0 right-0 px-6 z-10">
        <div className="bg-gradient-to-br from-pink-200/95 to-rose-200/95 backdrop-blur-xl rounded-3xl shadow-2xl px-6 py-5 max-w-2xl mx-auto">
          {/* 会話エリア */}
          <div className="mb-4 max-h-[20vh] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300/30 scrollbar-track-transparent">
            <div className="space-y-3">
              {/* マツコAIの返答またはローディング */}
              {isLoadingAI ? (
                <div className="flex items-center justify-center py-3">
                  <div className="flex gap-2 items-center">
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              ) : aiResponse ? (
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-base font-light leading-relaxed text-gray-800 drop-shadow-sm whitespace-pre-wrap">
                      {aiResponse}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-base font-light leading-relaxed text-gray-800 drop-shadow-sm">
                      {dailyQuestions[currentQuestionIndex]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 入力エリア */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={questAnswer}
              onChange={(e) => setQuestAnswer(e.target.value)}
              onKeyDown={(e) => {
                // Enterで送信、Cmd+Enterで改行
                if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleQuestSubmit();
                }
              }}
              placeholder="メッセージを入力... "
              disabled={isLoadingAI}
              className="flex-1 bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 rounded-full text-base font-light focus:outline-none focus:ring-2 focus:ring-rose-300/50 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleQuestSubmit}
              disabled={isLoadingAI || !questAnswer.trim()}
              className="bg-rose-400 text-white p-3 rounded-full hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション（固定） */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer activePage="home" />
      </div>
    </div>
  );
}

export default MainComponent;