import { determineTenGods, calculateGanzhi, getTenGodDescription } from '../../../utilities/tengan-system.js';

// 十神による4ジャンル運勢データ
const TEN_GODS_FORTUNE_DATA = {
  '比肩': {
    keywords: ['自己効力感','自己確信','スタート','個性','自己中心'],
    genres: {
      love: { score: 75, keyword: '対等な関係で愛を育もう', description: '対等な関係を築ける日。お互いの独立性を尊重することが大切。' },
      work: { score: 85, keyword: '個人の力を信じて挑戦', description: '個人の力を発揮できる日。チームワークよりも個人プレーが効果的。' },
      relationship: { score: 70, keyword: '仲間として支え合おう', description: '友人や同僚との関係が良好。競争よりも協調を心がけて。' },
      money: { score: 75, keyword: '自分の力で稼ごう', description: '自分の力で稼ぐことに向いている日。投資は慎重に。' }
    }
  },
  '劫財': {
    keywords: ['自己決定感','共同行動','協力','つながりの中の個性','浪費'],
    genres: {
      love: { score: 70, keyword: '情熱的に愛を伝えよう', description: '積極的なアプローチが効果的。ただし、相手のペースも考慮して。' },
      work: { score: 80, keyword: '新しい挑戦を始めよう', description: '行動力が高まる日。新しいプロジェクトに挑戦するのに適している。' },
      relationship: { score: 65, keyword: '元気な交流を楽しもう', description: 'エネルギッシュな交流ができるが、衝突にも注意。' },
      money: { score: 60, keyword: '計画的にお金を使おう', description: '衝動的な支出に注意。計画的な投資を心がけて。' }
    }
  },
  '食神': {
    keywords: ['喜びの有意味感','楽しさ','衣食住の豊かさ','ポジティブ感情','怠惰'],
    genres: {
      love: { score: 88, keyword: '自然体で魅力を放とう', description: '魅力が高まる日。自然体でいることで相手を惹きつける。' },
      work: { score: 90, keyword: '創造力を思いっきり発揮', description: '創造性が発揮される日。アイデア勝負の仕事に最適。' },
      relationship: { score: 85, keyword: '楽しい時間を共有しよう', description: '明るく楽しい交流ができる。芸術的な活動を通じた出会いも◎。' },
      money: { score: 75, keyword: '才能を活かして稼ごう', description: '才能を活かした収入が期待できる。楽しみながら稼げる日。' }
    }
  },
  '傷官': {
    keywords: ['表現の有意味感','言語化','独創性','芸術','神経質'],
    genres: {
      love: { score: 65, keyword: '新しい恋の形を求めよう', description: '既存の関係に変化を求める日。新しい出会いにも積極的に。' },
      work: { score: 85, keyword: '技術力で差をつけよう', description: '技術力や専門性が評価される日。革新的なアプローチで成果を。' },
      relationship: { score: 70, keyword: '率直に意見を伝えよう', description: '率直な意見交換ができるが、批判的になりすぎないよう注意。' },
      money: { score: 78, keyword: '専門知識で収益を上げよう', description: '技術や専門知識を活かした収入機会がある。' }
    }
  },
  '偏財': {
    keywords: ['自己決定感','社会的','人脈','財運','落ち着きがない'],
    genres: {
      love: { score: 82, keyword: '魅力的な出会いを求めて', description: '社交的な魅力で多くの人を惹きつける日。出会いのチャンスが豊富。' },
      work: { score: 88, keyword: '人脈を活かして成果を', description: '営業や交渉事に向いている日。人脈を活かして成果を上げよう。' },
      relationship: { score: 90, keyword: 'つながりを広げよう', description: '人とのつながりが広がる日。ネットワーキングに最適。' },
      money: { score: 85, keyword: '商売上手で利益を得よう', description: '商売や投資で利益を得やすい日。ただしリスク管理も忘れずに。' }
    }
  },
  '正財': {
    keywords: ['自己決定感','計画的選択','堅実','貯蓄','固執'],
    genres: {
      love: { score: 80, keyword: '誠実な愛で絆を深めよう', description: '真面目で誠実な態度が評価される日。長期的な関係を重視して。' },
      work: { score: 85, keyword: '責任を持って取り組もう', description: '責任感を持って取り組むことで成果が得られる。管理業務に適している。' },
      relationship: { score: 82, keyword: '信頼関係を大切にしよう', description: '信頼関係を築くのに適した日。約束を守ることが大切。' },
      money: { score: 90, keyword: '堅実に資産を築こう', description: '堅実な財務管理に向いている日。貯蓄や資産形成を検討しよう。' }
    }
  },
  '偏官': {
    keywords: ['挑戦的自己効力感','行動力','突破力','チャレンジ精神','短気'],
    genres: {
      love: { score: 70, keyword: '情熱的な愛で勝負しよう', description: '強いリーダーシップが魅力となるが、相手を圧迫しないよう注意。' },
      work: { score: 92, keyword: '権威を持って力を発揮', description: '権威ある立場で力を発揮する日。困難な課題にも果敢に挑戦を。' },
      relationship: { score: 75, keyword: '思いやりを持って統率を', description: 'リーダーシップを発揮できるが、独断的にならないよう配慮を。' },
      money: { score: 80, keyword: '大胆に投資判断しよう', description: '大胆な投資判断が求められる日。リスクとリターンを慎重に検討。' }
    }
  },
  '正官': {
    keywords: ['責任による影響感','ルールを守る','社会的地位','信頼される','ストレス'],
    genres: {
      love: { score: 85, keyword: '品格ある愛を育もう', description: '品格のある態度で相手から尊敬される日。真面目な交際を心がけて。' },
      work: { score: 88, keyword: '昇進のチャンスを掴もう', description: '責任感が評価され、昇進や昇格のチャンスがある日。' },
      relationship: { score: 88, keyword: '誠実さで信頼を築こう', description: '誠実で責任感のある態度が周りから信頼される。' },
      money: { score: 82, keyword: '安定した収入を大切に', description: '安定した収入や地位に伴う報酬が期待できる日。' }
    }
  },
  '偏印': {
    keywords: ['創造による影響感','変化','発明家','ユニークな知恵','気分屋'],
    genres: {
      love: { score: 75, keyword: '運命的な出会いを信じて', description: '直感的な出会いがある日。神秘的な魅力で相手を惹きつける。' },
      work: { score: 78, keyword: '新しいアプローチで挑戦', description: '直感力が冴える日。従来とは違うアプローチで問題解決を。' },
      relationship: { score: 72, keyword: '変化を求めて新しい縁を', description: '変化を求める気持ちが強まる。新しい人間関係を築こう。' },
      money: { score: 70, keyword: '慎重に投資を判断しよう', description: '変動の激しい投資には注意。直感に頼りすぎないよう慎重に。' }
    }
  },
  '印綬': {
    keywords: ['学びの有意味感','知識','安心感','母性','保守的'],
    genres: {
      love: { score: 83, keyword: '包み込む愛で癒やそう', description: '優しく包容力のある態度で相手を癒やす日。母性的な魅力が光る。' },
      work: { score: 87, keyword: '学びながら成長しよう', description: '学習能力が高まり、新しい知識やスキルを身につけるのに最適。' },
      relationship: { score: 85, keyword: '人を支えて絆を深めよう', description: '人を支え、守る役割を果たす日。頼られることが多くなりそう。' },
      money: { score: 78, keyword: '教育への投資を考えよう', description: '教育や知識への投資が将来の利益につながる日。' }
    }
  }
};

export async function POST(request) {
  try {
    const { birthDate, targetDate } = await request.json();
    
    if (!birthDate) {
      return Response.json(
        { error: "生年月日が必要です" },
        { status: 400 }
      );
    }
    
    // 生年月日から日干支を計算
    const birthDateObj = new Date(birthDate);
    const birthDayGanzhi = calculateGanzhi(
      birthDateObj.getFullYear(),
      birthDateObj.getMonth() + 1,
      birthDateObj.getDate()
    );
    
    // 対象日の干支を計算（省略時は今日）
    let targetDayGanzhi;
    if (targetDate) {
      const targetDateObj = new Date(targetDate);
      targetDayGanzhi = calculateGanzhi(
        targetDateObj.getFullYear(),
        targetDateObj.getMonth() + 1,
        targetDateObj.getDate()
      );
    } else {
      const today = new Date();
      targetDayGanzhi = calculateGanzhi(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
    }
    
    // 十神を判定（シンプルな事前定義データから取得）
    const tenGodsResult = determineTenGods(birthDayGanzhi, targetDayGanzhi);
    const tenGod = tenGodsResult.tenGod;
    
    // 十神による運勢データを取得
    const fortuneData = TEN_GODS_FORTUNE_DATA[tenGod];
    
    if (!fortuneData) {
      return Response.json(
        { error: "十神の運勢データが見つかりません" },
        { status: 500 }
      );
    }
    
    // 総合スコアを計算
    const totalScore = Math.round((
      fortuneData.genres.love.score +
      fortuneData.genres.work.score +
      fortuneData.genres.relationship.score +
      fortuneData.genres.money.score
    ) / 4);
    
    return Response.json({
      success: true,
      birthDate,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      tenGodsAnalysis: {
        birthDayGanzhi,
        targetDayGanzhi,
        birthHeavenly: tenGodsResult.birthHeavenly,
        targetHeavenly: tenGodsResult.targetHeavenly,
        tenGod,
        tenGodDescription: tenGodsResult.description
      },
      fortune: {
        type: `${tenGod}の日`,
        keywords: fortuneData.keywords,
        genres: fortuneData.genres,
        totalScore
      }
    });
    
  } catch (error) {
    console.error('Ten Gods API Error:', error);
    return Response.json(
      { error: "十神の判定に失敗しました: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const birthDate = searchParams.get('birthDate');
  const targetDate = searchParams.get('targetDate');
  
  if (!birthDate) {
    return Response.json(
      { error: "生年月日が必要です" },
      { status: 400 }
    );
  }
  
  try {
    // POST メソッドと同じロジックを実行
    const birthDateObj = new Date(birthDate);
    const birthDayGanzhi = calculateGanzhi(
      birthDateObj.getFullYear(),
      birthDateObj.getMonth() + 1,
      birthDateObj.getDate()
    );
    
    let targetDayGanzhi;
    if (targetDate) {
      const targetDateObj = new Date(targetDate);
      targetDayGanzhi = calculateGanzhi(
        targetDateObj.getFullYear(),
        targetDateObj.getMonth() + 1,
        targetDateObj.getDate()
      );
    } else {
      const today = new Date();
      targetDayGanzhi = calculateGanzhi(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
    }
    
    const tenGodsResult = determineTenGods(birthDayGanzhi, targetDayGanzhi);
    const tenGod = tenGodsResult.tenGod;
    const fortuneData = TEN_GODS_FORTUNE_DATA[tenGod];
    
    if (!fortuneData) {
      return Response.json(
        { error: "十神の運勢データが見つかりません" },
        { status: 500 }
      );
    }
    
    const totalScore = Math.round((
      fortuneData.genres.love.score +
      fortuneData.genres.work.score +
      fortuneData.genres.relationship.score +
      fortuneData.genres.money.score
    ) / 4);
    
    return Response.json({
      success: true,
      birthDate,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      tenGodsAnalysis: {
        birthDayGanzhi,
        targetDayGanzhi,
        birthHeavenly: tenGodsResult.birthHeavenly,
        targetHeavenly: tenGodsResult.targetHeavenly,
        tenGod,
        tenGodDescription: tenGodsResult.description
      },
      fortune: {
        type: `${tenGod}の日`,
        keywords: fortuneData.keywords,
        genres: fortuneData.genres,
        totalScore
      }
    });
    
  } catch (error) {
    console.error('Ten Gods API Error:', error);
    return Response.json(
      { error: "十神の判定に失敗しました: " + error.message },
      { status: 500 }
    );
  }
} 