"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";

function QuestsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [dailyLimit, setDailyLimit] = useState({ used: 2, max: 5 });

  const [questions] = useState([
    {
      id: 1,
      type: "multiple",
      question: "今日の気分はいかがですか？",
      options: [
        { value: "excellent", label: "とても良い", points: 30 },
        { value: "good", label: "良い", points: 25 },
        { value: "normal", label: "普通", points: 20 },
        { value: "tired", label: "疲れている", points: 15 }
      ],
      icon: "fa-smile"
    },
    {
      id: 2,
      type: "multiple",
      question: "最近、新しいことにチャレンジしましたか？",
      options: [
        { value: "yes_big", label: "大きなチャレンジをした", points: 35 },
        { value: "yes_small", label: "小さなことから始めた", points: 30 },
        { value: "planning", label: "計画中", points: 20 },
        { value: "no", label: "まだしていない", points: 10 }
      ],
      icon: "fa-rocket"
    },
    {
      id: 3,
      type: "image",
      question: "この画像から感じる印象は？",
      image: "🌅",
      options: [
        { value: "hope", label: "希望", points: 25 },
        { value: "peace", label: "平和", points: 25 },
        { value: "energy", label: "エネルギー", points: 25 },
        { value: "calm", label: "落ち着き", points: 25 }
      ],
      icon: "fa-image"
    },
    {
      id: 4,
      type: "scale",
      question: "今の人生の満足度を教えてください",
      scale: { min: 1, max: 10 },
      pointsPerLevel: 3,
      icon: "fa-heart"
    },
    {
      id: 5,
      type: "multiple",
      question: "ストレス解消法は何ですか？",
      options: [
        { value: "music", label: "音楽を聴く", points: 20 },
        { value: "exercise", label: "運動する", points: 25 },
        { value: "sleep", label: "睡眠", points: 20 },
        { value: "hobby", label: "趣味に没頭", points: 25 },
        { value: "friends", label: "友達と話す", points: 30 }
      ],
      icon: "fa-leaf"
    }
  ]);

  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculatePoints = () => {
    let total = 0;
    questions.forEach(q => {
      const answer = userAnswers[q.id];
      if (answer) {
        if (q.type === 'scale') {
          total += parseInt(answer) * q.pointsPerLevel;
        } else {
          const option = q.options.find(opt => opt.value === answer);
          if (option) total += option.points;
        }
      }
    });
    return total;
  };

  const submitAnswers = () => {
    const points = calculatePoints();
    setPointsEarned(points);
    setShowResult(true);
    setDailyLimit(prev => ({ ...prev, used: prev.used + 1 }));
  };

  const resetQuest = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setPointsEarned(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#FFF8F8] pb-24">
        <div className="p-4">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF9494] to-[#FFB4B4] rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-trophy text-3xl text-white"></i>
            </div>
            <h1 className="text-2xl font-bold text-[#FF9494] mb-2">クエスト完了！</h1>
            <p className="text-gray-600">お疲れ様でした</p>
          </div>

          <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm text-center">
            <div className="text-4xl font-bold text-[#FF9494] mb-2 flex items-center justify-center gap-2">
              <i className="fas fa-coins text-yellow-500"></i>
              +{pointsEarned}
            </div>
            <p className="text-gray-600">フォーチュンポイント獲得</p>
          </div>

          <div className="bg-[#FFE4E4] rounded-3xl p-6 mb-4">
            <h3 className="font-bold text-[#FF9494] mb-3">あなたの傾向</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              今日のあなたは前向きなエネルギーに満ちています。新しいチャレンジへの意欲も高く、
              周囲との関係も良好なようですね。この調子で素晴らしい一日をお過ごしください！
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={resetQuest}
              className="w-full bg-[#FF9494] text-white py-4 rounded-full font-bold hover:bg-[#FF7979] transition-colors"
              disabled={dailyLimit.used >= dailyLimit.max}
            >
              {dailyLimit.used >= dailyLimit.max 
                ? `本日の上限に達しました (${dailyLimit.used}/${dailyLimit.max})`
                : `もう一度チャレンジ (${dailyLimit.used}/${dailyLimit.max})`
              }
            </button>
            <button 
              onClick={() => window.location.href = '/home'}
              className="w-full bg-white text-[#FF9494] py-4 rounded-full font-bold border-2 border-[#FFE4E4] hover:bg-[#FFF8F8] transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
        <Footer activePage="quests" />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-24">
      <div className="p-4">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#FF9494] mb-2">デイリークエスト</h1>
          <p className="text-sm text-gray-600">質問に答えてポイントを獲得</p>
          <div className="text-xs text-gray-500 mt-1">
            残り {dailyLimit.max - dailyLimit.used} 回
          </div>
        </div>

        {/* プログレスバー */}
        <div className="bg-white rounded-full p-2 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">進捗</span>
            <span className="text-xs text-[#FF9494] font-bold">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="h-2 bg-[#FFE4E4] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF9494] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 質問カード */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#FFE4E4] rounded-full flex items-center justify-center">
              <i className={`fas ${question.icon} text-[#FF9494] text-lg`}></i>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800">{question.question}</h2>
            </div>
          </div>

          {question.type === 'image' && (
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{question.image}</div>
            </div>
          )}

          {/* 選択肢 */}
          {question.type === 'multiple' && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    userAnswers[question.id] === option.value
                      ? 'bg-[#FF9494] text-white'
                      : 'bg-[#FFF8F8] text-gray-700 hover:bg-[#FFE4E4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    <span className="text-sm opacity-80">+{option.points}pt</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* スケール回答 */}
          {question.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{question.scale.min}</span>
                <span>{question.scale.max}</span>
              </div>
              <input
                type="range"
                min={question.scale.min}
                max={question.scale.max}
                value={userAnswers[question.id] || question.scale.min}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="w-full accent-[#FF9494]"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-[#FF9494]">
                  {userAnswers[question.id] || question.scale.min}
                </span>
                <div className="text-sm text-gray-600 mt-1">
                  +{(userAnswers[question.id] || question.scale.min) * question.pointsPerLevel}pt
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              className="flex-1 bg-white text-[#FF9494] py-4 rounded-full font-bold border-2 border-[#FFE4E4] hover:bg-[#FFF8F8] transition-colors"
            >
              前へ
            </button>
          )}
          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
              } else {
                submitAnswers();
              }
            }}
            disabled={!userAnswers[question.id]}
            className="flex-1 bg-[#FF9494] text-white py-4 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF7979] transition-colors"
          >
            {currentQuestion < questions.length - 1 ? '次へ' : '完了'}
          </button>
        </div>
      </div>

      <Footer activePage="game" />
    </div>
  );
}

export default QuestsPage; 