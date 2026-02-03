"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Footer from "../components/Footer";

function MainComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isHoroscopeExpanded, setIsHoroscopeExpanded] = useState(false);
  const [horoscope, setHoroscope] = useState({
    luck: "⭐️⭐️⭐️",
    message: "今日は新しいことに挑戦するのに良い日です。",
    color: "青",
    number: "7",
  });
  
  // タブ管理の状態を追加
  const [activeTab, setActiveTab] = useState("calendar"); // "calendar" or "consultation"
  
  // 日付詳細モーダル内タブ
  const [detailTab, setDetailTab] = useState("fortune"); // "fortune" | "history"
  
  // 占い相談の状態を追加
  const [consultationData, setConsultationData] = useState({
    selectedCategory: "",
    selectedType: "",
    customQuestion: "",
    showResult: false,
    consultationResult: null
  });
  
  // ゲーミフィケーション要素を追加
  const [gameData, setGameData] = useState({
    fortunePoints: 1250,
    todayFortunes: 1, // 今日の占い実行回数
    showFPDialog: false,
    nextFortuneCost: 80 // 次の占いに必要なFP
  });

  const [conversation] = useState([
    {
      role: "assistant",
      content:
        "こんにちは！ここでは最近の振り返りや気づきを記録しているわ。予定ごとにどんな気持ちだったか、あとで読み返せるようにしてあるの。",
      timestamp: new Date().toISOString(),
    },
    {
      role: "user",
      content: "昨日の会議、緊張したけどちゃんと伝えられて良かった。",
      timestamp: new Date().toISOString(),
    },
    {
      role: "assistant",
      content:
        "ちゃんと成果が出てるじゃない。頑張った自分を褒めてね。次は深呼吸を忘れずにいきましょ。",
      timestamp: new Date().toISOString(),
    },
  ]);
  const chatScrollRef = useRef(null);
  
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedDate]);
  
  // FP消費ダイアログの状態
  const [fpDialog, setFpDialog] = useState({
    show: false,
    cost: 0,
    category: "",
    type: "consultation" // 占い相談用
  });
  
  // 占い相談のカテゴリ
  const consultationCategories = [
    { id: "love", name: "恋愛", icon: "fa-heart", color: "from-pink-400 to-pink-600", description: "恋愛関係・出会い・結婚" },
    { id: "work", name: "仕事", icon: "fa-briefcase", color: "from-blue-400 to-blue-600", description: "転職・昇進・職場関係" },
    { id: "money", name: "金運", icon: "fa-coins", color: "from-yellow-400 to-yellow-600", description: "投資・収入・お金の悩み" },
    { id: "health", name: "健康", icon: "fa-heartbeat", color: "from-green-400 to-green-600", description: "体調・メンタル・生活習慣" },
    { id: "family", name: "家族", icon: "fa-home", color: "from-purple-400 to-purple-600", description: "家族関係・子育て・親戚" },
    { id: "future", name: "将来", icon: "fa-crystal-ball", color: "from-indigo-400 to-indigo-600", description: "人生設計・夢・目標" }
  ];

  // 占いタイプ
  const consultationTypes = [
    { id: "today", name: "今日の運勢", cost: 80, description: "今日1日の運勢を詳しく占います" },
    { id: "week", name: "今週の運勢", cost: 150, description: "今週の全体的な流れを占います" },
    { id: "month", name: "今月の運勢", cost: 300, description: "今月の運勢と注意点を占います" },
    { id: "custom", name: "カスタム質問", cost: 200, description: "あなたの知りたいことを自由に質問" }
  ];
  
  // デモデータを追加（過去の日付のみに会話履歴）
  const [schedules, setSchedules] = useState(() => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    
    return {
      // 2日前
      [twoDaysAgo.getDate()]: [
        {
          id: 1,
          title: "朝のジョギング",
          time: "07:00",
          description: "公園を30分ランニング",
          reflection: {
            completed: true,
            rating: 5,
            notes: "天気が良くて気持ちよかった！新しいコースを発見した。",
            learnings: "早起きすると一日が充実する"
          }
        },
        {
          id: 2,
          title: "プロジェクト会議",
          time: "14:00",
          description: "新機能の仕様検討",
          reflection: {
            completed: true,
            rating: 4,
            notes: "良いアイデアが出た。次回までに資料準備が必要。",
            learnings: "チームで意見を出し合うと良い解決策が見つかる"
          }
        }
      ],
      // 3日前
      [threeDaysAgo.getDate()]: [
        {
          id: 3,
          title: "友人とランチ",
          time: "12:30",
          description: "久しぶりの再会",
          reflection: {
            completed: true,
            rating: 5,
            notes: "楽しい時間を過ごせた。また会う約束をした。",
            learnings: "人との繋がりを大切にしたい"
          }
        }
      ],
      // 5日前
      [fiveDaysAgo.getDate()]: [
        {
          id: 4,
          title: "買い物",
          time: "18:00",
          description: "スーパーで夕食の材料を購入",
          reflection: {
            completed: true,
            rating: 3,
            notes: "買い忘れがあった。次回はリストを作ろう。",
            learnings: "計画的に買い物をすると無駄が減る"
          }
        }
      ]
    };
  });
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    description: "",
    time: "",
  });
  const [reflectionData, setReflectionData] = useState({
    completed: false,
    rating: 3,
    notes: "",
    learnings: ""
  });
  const [error, setError] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // 占い相談を実行する関数
  const executeConsultation = () => {
    const category = consultationCategories.find(c => c.id === consultationData.selectedCategory);
    const type = consultationTypes.find(t => t.id === consultationData.selectedType);
    
    if (!category || !type) return;

    setFpDialog({
      show: true,
      cost: type.cost,
      category: category.name,
      type: "consultation"
    });
  };

  // 有料占い相談実行（FP消費）
  const executePaymentConsultation = () => {
    if (gameData.fortunePoints >= fpDialog.cost) {
      setGameData(prev => ({
        ...prev,
        fortunePoints: prev.fortunePoints - fpDialog.cost
      }));
      
      // 占い結果を生成
      generateConsultationResult();
      setFpDialog({ show: false, cost: 0, category: "", type: "" });
    }
  };

  // 占い結果を生成
  const generateConsultationResult = () => {
    const category = consultationCategories.find(c => c.id === consultationData.selectedCategory);
    const type = consultationTypes.find(t => t.id === consultationData.selectedType);
    
    const results = {
      love: {
        today: "今日の恋愛運は絶好調！新しい出会いのチャンスがあります。積極的にコミュニケーションを取ることで、素敵な展開が期待できそうです。",
        week: "今週は恋愛面で大きな変化が訪れそうです。月曜日から水曜日にかけては少し慎重に、木曜日以降は積極的にアプローチしてみましょう。",
        month: "今月は恋愛運が徐々に上昇していきます。上旬は準備期間、中旬から下旬にかけて素晴らしい出会いや進展が期待できます。",
        custom: `あなたの質問「${consultationData.customQuestion}」について占いました。現在の状況を整理し、心の準備を整えることが大切です。答えは既にあなたの心の中にあります。`
      },
      work: {
        today: "仕事運は安定しています。新しいプロジェクトに積極的に参加することで、スキルアップのチャンスが得られそうです。",
        week: "今週は仕事面で重要な決断を迫られるかもしれません。焦らず慎重に判断し、周囲の意見も参考にしてください。",
        month: "今月は仕事運が上昇傾向にあります。新しいチャレンジを恐れずに取り組むことで、大きな成果を得られるでしょう。",
        custom: `あなたの質問「${consultationData.customQuestion}」について占いました。現在の努力は必ず報われます。信念を持って進んでください。`
      },
      money: {
        today: "金運は普通です。無駄遣いを控え、計画的にお金を使うことを心がけましょう。投資は慎重に。",
        week: "今週は金運にムラがありそうです。前半は節約を心がけ、後半に少しずつ投資を検討してみてください。",
        month: "今月は金運が徐々に向上していきます。新しい収入源を探すのに良い時期です。",
        custom: `あなたの質問「${consultationData.customQuestion}」について占いました。お金に関する決断は慎重に。長期的な視点を持つことが重要です。`
      },
      health: {
        today: "健康運は良好です。適度な運動と栄養バランスの取れた食事を心がけることで、より良いコンディションを維持できます。",
        week: "今週は体調管理に注意が必要です。特に中旬以降は疲れが溜まりやすいので、十分な休息を取ってください。",
        month: "今月は健康運が安定しています。新しい健康習慣を始めるのに良い時期です。",
        custom: `あなたの質問「${consultationData.customQuestion}」について占いました。体と心の声に耳を傾け、無理をしないことが大切です。`
      },
      family: {
        today: "家族運は安定しています。家族との時間を大切にし、感謝の気持ちを伝えることで絆が深まります。",
        week: "今週は家族関係で小さな調整が必要かもしれません。相手の立場に立って考えることが解決の鍵です。",
        month: "今月は家族運が向上していきます。家族イベントや旅行を計画するのに良い時期です。",
        custom: `あなたの質問「${consultationData.customQuestion}」について占いました。家族との絆を大切にし、お互いを理解し合うことが重要です。`
      },
      future: {
        today: "将来に向けて良いエネルギーが流れています。今日立てた計画は実現する可能性が高いです。",
        week: "今週は将来の方向性について考える良い時期です。長期的な目標を設定してみましょう。",
        month: "今月は将来運が大きく向上します。新しい可能性に挑戦する絶好のタイミングです。",
        custom: `あなたの質問「${consultationData.customQuestion}」について占いました。未来は今この瞬間の選択で決まります。希望を持って前進してください。`
      }
    };

    const result = {
      category: category.name,
      type: type.name,
      question: consultationData.selectedType === 'custom' ? consultationData.customQuestion : `${category.name}の${type.name}`,
      result: results[consultationData.selectedCategory][consultationData.selectedType] || "素晴らしい未来が待っています。",
      advice: "この占い結果を参考に、前向きに行動してみてください。",
      luckyColor: ["赤", "青", "緑", "紫", "黄色", "オレンジ"][Math.floor(Math.random() * 6)],
      luckyNumber: Math.floor(Math.random() * 9) + 1
    };

    setConsultationData(prev => ({
      ...prev,
      showResult: true,
      consultationResult: result
    }));
  };

  // 月の日数を取得
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 月の最初の日の曜日を取得
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // カレンダーの日付配列を生成
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // 前月の日付を埋める
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // 当月の日付を埋める
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  // 今日の日付を取得
  const today = new Date();
  const isToday = (date) => {
    return (
      date?.getDate() === today.getDate() &&
      date?.getMonth() === today.getMonth() &&
      date?.getFullYear() === today.getFullYear()
    );
  };

  // 予定を取得する
  const fetchSchedules = useCallback(async () => {
    try {
      const response = await fetch("/api/get_schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        }),
      });

      if (!response.ok) {
        // APIが存在しない場合はデモデータを使用
        console.log("API not available, using demo data");
        return;
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // 日付ごとに予定を整理
      const schedulesByDate = {};
      data.schedules.forEach((schedule) => {
        const date = new Date(schedule.date).getDate();
        if (!schedulesByDate[date]) {
          schedulesByDate[date] = [];
        }
        schedulesByDate[date].push(schedule);
      });
      setSchedules(schedulesByDate);
    } catch (error) {
      console.error("Using demo data:", error);
      // エラーの場合はデモデータを継続使用
    }
  }, [currentDate]);

  // 予定を追加する
  const addSchedule = async () => {
    if (!selectedDate || !newSchedule.title) {
      setError("タイトルは必須です");
      return;
    }

    try {
      const newId = Date.now(); // 簡単なID生成
      const newScheduleData = {
        id: newId,
        title: newSchedule.title,
        time: newSchedule.time,
        description: newSchedule.description,
        reflection: null
      };

      const dateKey = selectedDate.getDate();
      setSchedules(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newScheduleData]
      }));

      setShowScheduleModal(false);
      setNewSchedule({ title: "", description: "", time: "" });
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // 予定を編集する
  const editSchedule = async () => {
    if (!editingSchedule || !editingSchedule.title) {
      setError("タイトルは必須です");
      return;
    }

    try {
      const dateKey = selectedDate.getDate();
      setSchedules(prev => ({
        ...prev,
        [dateKey]: prev[dateKey].map(schedule => 
          schedule.id === editingSchedule.id ? editingSchedule : schedule
        )
      }));

      setEditingSchedule(null);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // 予定を削除する
  const deleteSchedule = async (scheduleId) => {
    if (!confirm("この予定を削除しますか？")) return;

    try {
      const dateKey = selectedDate.getDate();
      setSchedules(prev => ({
        ...prev,
        [dateKey]: prev[dateKey].filter(schedule => schedule.id !== scheduleId)
      }));

      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // 振り返りを保存する
  const saveReflection = () => {
    if (!selectedSchedule) return;

    const dateKey = selectedDate.getDate();
    setSchedules(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(schedule => 
        schedule.id === selectedSchedule.id 
          ? { ...schedule, reflection: reflectionData }
          : schedule
      )
    }));

    setShowReflectionModal(false);
    setReflectionData({ completed: false, rating: 3, notes: "", learnings: "" });
    setSelectedSchedule(null);
  };

  // 振り返りモーダルを開く
  const openReflectionModal = (schedule) => {
    setSelectedSchedule(schedule);
    if (schedule.reflection) {
      setReflectionData(schedule.reflection);
    } else {
      setReflectionData({ completed: false, rating: 3, notes: "", learnings: "" });
    }
    setShowReflectionModal(true);
  };

  // 予定の時間でソート
  const sortSchedulesByTime = (schedules) => {
    return schedules.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  // 星評価コンポーネント
  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${!readonly && "hover:text-yellow-400"}`}
            disabled={readonly}
          >
            ⭐️
          </button>
        ))}
      </div>
    );
  };

  // 月が変わったら予定を再取得
  useEffect(() => {
    fetchSchedules();
  }, [currentDate, fetchSchedules]);

  // 占いカテゴリを実行する関数
  const performFortune = (category, categoryName) => {
    // 初回は無料、2回目以降はFP消費
    if (gameData.todayFortunes >= 1) {
      setFpDialog({
        show: true,
        cost: gameData.nextFortuneCost,
        category: categoryName,
        type: "fortune"
      });
      return;
    }

    // 無料占い実行
    executeFortune(category, categoryName, 0);
  };

  // 有料占い実行（FP消費）
  const executePaymentFortune = () => {
    if (gameData.fortunePoints >= fpDialog.cost) {
      setGameData(prev => ({
        ...prev,
        fortunePoints: prev.fortunePoints - fpDialog.cost,
        todayFortunes: prev.todayFortunes + 1,
        nextFortuneCost: prev.nextFortuneCost + 40 // 次回はより高額に
      }));
      
      if (fpDialog.type === "consultation") {
        generateConsultationResult();
      } else {
        executeFortune("paid", fpDialog.category, fpDialog.cost);
      }
      setFpDialog({ show: false, cost: 0, category: "", type: "" });
    }
  };

  // 占い実行共通処理
  const executeFortune = (category, categoryName, cost) => {
    const fortunes = {
      love: {
        luck: "💖💖💖💖",
        message: "素敵な出会いがあなたを待っています。今日は恋愛運が絶好調！",
        color: "ピンク",
        number: "2"
      },
      work: {
        luck: "💼💼💼",
        message: "仕事での成功のチャンスが巡ってきます。積極的に行動しましょう。",
        color: "ネイビー",
        number: "8"
      },
      money: {
        luck: "💰💰💰💰💰",
        message: "金運が上昇中！投資や節約に良いタイミングです。",
        color: "ゴールド",
        number: "3"
      },
      health: {
        luck: "🌱🌱🌱",
        message: "体調管理に気をつけて。運動や健康的な食事を心がけましょう。",
        color: "グリーン", 
        number: "9"
      }
    };

    setHoroscope(fortunes[category] || fortunes.love);
    setIsHoroscopeExpanded(true);
    
    if (cost === 0) {
      setGameData(prev => ({
        ...prev,
        todayFortunes: prev.todayFortunes + 1
      }));
    }
  };

  return (
    <div className="relative flex h-screen flex-col bg-gradient-to-b from-pink-50 via-purple-50 to-white overflow-hidden">
      {/* ヘッダー（帯状アコーディオン） */}
      <div className="relative z-10">
        <button
          onClick={() => setIsHoroscopeExpanded(!isHoroscopeExpanded)}
          className="w-full bg-white/40 backdrop-blur-md border-b border-white/60 shadow-sm transition-all hover:bg-white/50"
        >
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* 左側：日付 */}
              <h1 className="text-lg font-light text-gray-800 tracking-[0.12em]">
                {today.getMonth() + 1}月{today.getDate()}日
              </h1>
              
              {/* 右側：運勢スコア + 矢印 */}
              <div className="flex items-center gap-3">
                {/* 運勢スコア */}
                <span className="text-2xl font-light tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {horoscope.luck}
                </span>
                
                {/* 矢印 */}
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                    isHoroscopeExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 展開時のコンテンツ */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isHoroscopeExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pt-4 space-y-4">
                {/* 占い結果メッセージ */}
                <p className="text-sm font-light leading-relaxed text-gray-800 text-left">
                  {horoscope.message}
                </p>
                
                {/* ラッキーカラー */}
                <div className="flex items-center justify-between pt-4 border-t border-white/50">
                  <span className="text-xs font-light text-gray-600 tracking-wide uppercase">Lucky Color</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-light text-gray-800">{horoscope.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

    

      {/* カレンダーコンテンツ */}
      <div className="relative flex-1 flex flex-col pb-24 overflow-hidden">
          <div className="flex-1 flex flex-col px-4 py-4">
            <div className="flex-1 flex flex-col">
            {/* カレンダーヘッダー */}
            <div className="flex justify-between items-center mb-4 shrink-0">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                  )
                }
                className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
              >
                ＜
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-light text-gray-800 tracking-wide">
                  {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                </h2>
              </div>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                  )
                }
                className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
              >
                ＞
              </button>
            </div>

          
            {/* 曜日の表示 */}
            <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`text-center py-1.5 text-xs font-light ${
                    index === 0
                      ? "text-pink-500"
                      : index === 6
                      ? "text-indigo-500"
                      : "text-gray-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダー本体 */}
            <div className="grid grid-cols-7 gap-1 flex-1 overflow-y-auto">
              {generateCalendarDays().map((day, index) => {
                const hasSchedules = day && schedules[day]?.length > 0;
                const daySchedules = day ? schedules[day] || [] : [];
                const isSelected = 
                  day === selectedDate?.getDate() &&
                  currentDate.getMonth() === selectedDate?.getMonth() &&
                  currentDate.getFullYear() === selectedDate?.getFullYear();
                const isTodayDate = isToday(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                );

                return (
                  <div
                    key={index}
                    onClick={() =>
                      day &&
                      setSelectedDate(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                      )
                    }
                    className={`
                      relative flex flex-col items-center rounded-lg cursor-pointer transition-all duration-200 p-1.5
                      ${!day ? "" : "hover:bg-pink-50"}
                      ${isSelected ? "bg-pink-50 ring-2 ring-pink-400" : ""}
                      ${isTodayDate ? "border-2 border-pink-400" : ""}
                      ${hasSchedules ? "bg-gradient-to-b from-pink-50/50 to-white/50" : ""}
                      min-h-[4rem]
                    `}
                  >
                    {day && (
                      <div className="flex flex-col items-center justify-center h-full">
                        {/* 日付 */}
                        <span
                          className={`text-base font-medium mb-1 ${
                            index % 7 === 0
                              ? "text-pink-500"
                              : index % 7 === 6
                              ? "text-indigo-500"
                              : "text-gray-700"
                          }`}
                        >
                          {day}
                        </span>
                        
                        {/* インディケータマーク */}
                        <div className="flex items-center gap-0.5 mt-auto">
                          {/* 運気が良い日のマーク（⭐️が3つ以上の場合） */}
                          {horoscope.luck.length >= 6 && isTodayDate && (
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-sm">
                              <span className="text-[8px]">⭐️</span>
                            </div>
                          )}
                          
                          {/* 会話履歴がある日のマーク */}
                          {hasSchedules && (
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center shadow-sm">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
   

      {/* 予定追加/編集モーダル */}
      {(showScheduleModal || editingSchedule) && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowScheduleModal(false);
            setEditingSchedule(null);
            setError(null);
          }}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
             
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingSchedule(null);
                  setError(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFE4E4] text-[#FF9494] hover:bg-[#FF9494] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* 日付選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日付*
                </label>
                <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF9494]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル*
                </label>
                <input
                  type="text"
                  value={editingSchedule ? editingSchedule.title : newSchedule.title}
                  onChange={(e) => {
                    if (editingSchedule) {
                      setEditingSchedule({ ...editingSchedule, title: e.target.value });
                    } else {
                      setNewSchedule({ ...newSchedule, title: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF9494]"
                  placeholder="予定のタイトル"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  時間
                </label>
                <input
                  type="time"
                  value={editingSchedule ? editingSchedule.time : newSchedule.time}
                  onChange={(e) => {
                    if (editingSchedule) {
                      setEditingSchedule({ ...editingSchedule, time: e.target.value });
                    } else {
                      setNewSchedule({ ...newSchedule, time: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF9494]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メモ
                </label>
                <textarea
                  value={editingSchedule ? editingSchedule.description : newSchedule.description}
                  onChange={(e) => {
                    if (editingSchedule) {
                      setEditingSchedule({ ...editingSchedule, description: e.target.value });
                    } else {
                      setNewSchedule({ ...newSchedule, description: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF9494]"
                  rows="3"
                  placeholder="予定の詳細"
                />
              </div>

              {error && (
                <div className="text-[#FF9494] bg-[#FFE4E4] rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={editingSchedule ? editSchedule : addSchedule}
                  className="flex-1 bg-[#FF9494] text-white py-3 rounded-xl hover:bg-[#FF8484] transition-colors font-bold"
                >
                  {editingSchedule ? "更新" : "追加"}
                </button>
                {editingSchedule && (
                  <button
                    onClick={() => deleteSchedule(editingSchedule.id)}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 日付詳細モーダル */}
      {selectedDate && !showScheduleModal && !editingSchedule && !showReflectionModal && activeTab === "calendar" && (
        <div
          className="fixed inset-0 bg-pink-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedDate(null);
            setDetailTab("fortune");
          }}
        >
          <div
            className="bg-gradient-to-b from-pink-50 via-white to-pink-50/50 rounded-3xl p-6 w-full max-w-md h-[85vh] flex flex-col shadow-2xl border border-pink-200/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="text-2xl font-light bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent tracking-wide">
                {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-100/80 backdrop-blur-sm text-pink-600 hover:bg-pink-200 hover:text-pink-700 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* タブ切り替え */}
            <div className="flex bg-pink-100/60 backdrop-blur-sm rounded-full p-1 text-sm font-light mb-6 shrink-0 border border-pink-200/60">
              <button
                onClick={() => setDetailTab("fortune")}
                className={`flex-1 py-2 rounded-full transition-all ${
                  detailTab === "fortune"
                    ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-sm font-medium"
                    : "text-gray-600"
                }`}
              >
                運勢
              </button>
              <button
                onClick={() => setDetailTab("history")}
                className={`flex-1 py-2 rounded-full transition-all ${
                  detailTab === "history"
                    ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-sm font-medium"
                    : "text-gray-600"
                }`}
              >
                会話履歴
              </button>
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
              {detailTab === "fortune" ? (
                <div className="space-y-4">
                  {/* 運勢スコア */}
                  <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-5 border border-pink-200/60 shadow-sm">
                    <div className="text-center">
                      <p className="text-xs font-light text-pink-600 uppercase tracking-wide mb-3">Today's Fortune</p>
                      <div className="text-4xl mb-2">
                        {horoscope.luck}
                      </div>
                    </div>
                  </div>

                  {/* アドバイスメッセージ */}
                  <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-5 border border-pink-200/60 shadow-sm">
                    <p className="text-sm font-light leading-relaxed text-gray-800">
                      {horoscope.message}
                    </p>
                  </div>

                  {/* ラッキーカラー */}
                  <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-5 border border-pink-200/60 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-light text-pink-600 tracking-wide uppercase">Lucky Color</span>
                      <span className="text-sm font-light text-gray-800">{horoscope.color}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-pink-50 to-white backdrop-blur-sm rounded-2xl p-5 flex flex-col h-full border border-pink-200/60 shadow-sm">
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <h4 className="text-sm font-light text-gray-800 tracking-wide">
                      会話履歴
                    </h4>
                    <span className="text-xs text-pink-500 font-light">
                      過去の記録
                    </span>
                  </div>

                  <div
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto space-y-3 min-h-0"
                  >
                    {conversation.map((entry, index) => (
                      <div
                        key={`${entry.timestamp}-${index}`}
                        className={`flex ${
                          entry.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-sm font-light leading-relaxed ${
                            entry.role === "user"
                              ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-tr-sm"
                              : "bg-white text-gray-700 rounded-tl-sm border border-pink-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{entry.content}</p>
                          <span className="block text-[10px] mt-1.5 opacity-60 text-right">
                            {new Date(entry.timestamp).toLocaleString("ja-JP", {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-pink-500 font-light mt-4 shrink-0 text-center">
                    過去の会話履歴のみ確認できます
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ボトムナビゲーション（固定） */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer activePage="calendar" />
      </div>
    </div>
  );
}

export default MainComponent;