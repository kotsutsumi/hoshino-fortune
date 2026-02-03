import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { experience, mood, context } = await request.json();
    
    if (!experience) {
      return Response.json({ error: "体験内容が必要です" }, { status: 400 });
    }

    // OpenAI APIを呼び出してポジティブな変換を実行
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `あなたは優しくて可愛らしい、まるで親友のような温かいAIアシスタントです。ユーザーが今日体験したことを、親しみやすい口語で可愛く励まし、ポジティブに捉え直してあげてください。

【話し方の特徴】
- 親しみやすい関西弁やゆるい口調を混ぜる
- 「〜だよね」「〜なのよ」「〜しちゃお♪」などの可愛い語尾
- 絵文字や感情表現を豊富に使う
- 友達に話しかけるような親近感のある言葉遣い
- 「大丈夫だよ〜」「きっと上手くいくから♪」などの優しい励まし
- 時々関西弁「そやねん！」「ええやん！」なども使う

【重要なポイント】
- どんなネガティブな体験も、可愛く前向きに捉え直す
- 具体的で親しみやすい明日からの行動提案
- まるで親友が話しかけるような温かさ
- ユーザーの気持ちに寄り添いつつ、楽しく前向きに

【出力形式】
必ず以下のJSON形式で回答してください：
{
  "reframedPerspective": "体験を可愛くポジティブに捉え直した視点（親しみやすい口調で100文字程度）",
  "empathyMessage": "親友のような共感と受け止めメッセージ（可愛い口調で80文字程度）", 
  "growthOpportunity": "成長の機会を可愛く表現（親しみやすい口調で120文字程度）",
  "tomorrowAction": "明日からの行動を可愛く提案（親しみやすい口調で100文字程度）",
  "longTermVision": "長期的ビジョンを可愛く表現（親しみやすい口調で100文字程度）",
  "encouragingWords": "可愛い励ましの言葉（親しみやすい口調で60文字程度）",
  "practicalTip": "実践的コツを可愛く提案（親しみやすい口調で80文字程度）"
}`
        },
        {
          role: "user", 
          content: buildReframePrompt({ experience, mood, context })
        }
      ],
      max_tokens: 1000,
      temperature: 0.8
    });

    const responseContent = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      return Response.json({
        success: true,
        originalExperience: experience,
        mood: mood || "不明",
        context: context || "一般的",
        aiResponse: parsedResponse,
        timestamp: new Date().toISOString()
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return Response.json({
        success: false,
        error: "AI応答の解析に失敗しました",
        rawResponse: responseContent
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Positive Reframe API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return Response.json({
        error: "OpenAI APIの利用制限に達しました",
        fallback: generateFallbackResponse(experience)
      }, { status: 429 });
    }
    
    return Response.json({ 
      error: "ポジティブ変換の処理に失敗しました",
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: "Positive Reframe API",
    description: "ユーザーの体験をポジティブに変換し、明日からの行動につながるアドバイスを提供します",
    endpoints: {
      POST: {
        description: "体験をポジティブに変換",
        parameters: {
          experience: "今日の体験内容（必須）",
          mood: "現在の気分（任意）",
          context: "状況の背景（任意）"
        }
      }
    },
    examples: {
      input: {
        experience: "今日は仕事でミスをしてしまい、上司に怒られました",
        mood: "落ち込んでいる",
        context: "新しいプロジェクト"
      },
      output: "ポジティブな変換とアドバイスを提供"
    }
  });
}

function buildReframePrompt({ experience, mood, context }) {
  let prompt = `今日の体験をポジティブに捉え直してほしいです。\n\n`;
  
  prompt += `【今日の体験】\n${experience}\n\n`;
  
  if (mood) {
    prompt += `【現在の気分】\n${mood}\n\n`;
  }
  
  if (context) {
    prompt += `【状況・背景】\n${context}\n\n`;
  }
  
  // 変換のアプローチをランダムに変化させる
  const approaches = [
    "【重視してほしい観点】\nこの体験を「学びの機会」として捉え、スキルアップにつながる視点を重視してください。",
    "【重視してほしい観点】\nこの体験を「人間関係の成長」として捉え、コミュニケーション向上につながる視点を重視してください。",
    "【重視してほしい観点】\nこの体験を「自己理解の深化」として捉え、自分らしさの発見につながる視点を重視してください。",
    "【重視してほしい観点】\nこの体験を「レジリエンス（回復力）の向上」として捉え、困難に立ち向かう力の成長につながる視点を重視してください。",
    "【重視してほしい観点】\nこの体験を「新しい可能性の発見」として捉え、これまで気づかなかった才能や道筋の発見につながる視点を重視してください。"
  ];
  
  const randomApproach = approaches[Math.floor(Math.random() * approaches.length)];
  prompt += randomApproach + "\n\n";
  
  prompt += `【お願い】\n`;
  prompt += `この体験から得られる価値を見つけ出し、明日からの具体的な行動につながる前向きなアドバイスをお願いします。`;
  prompt += `ただし、体験自体を否定するのではなく、そこから学べることや成長できることに焦点を当ててください。`;
  
  return prompt;
}

function generateFallbackResponse(experience) {
  return {
    reframedPerspective: "今日のこと、実はすっごく意味のある体験だったんだよ〜✨ きっと未来の自分が「あの時があったから！」って思える日が来るよ♪",
    empathyMessage: "お疲れさま〜💦 そんな日もあるよね！ 気持ちすっごくわかるよ〜😊",
    growthOpportunity: "これね、実は隠れた成長チャンス！✨ こういう体験があるから、人ってどんどん強くなれるし、優しくもなれるんだよ〜♪",
    tomorrowAction: "今日はゆっくり休んで、明日は「よし！」って小さな一歩から始めてみよ〜🌱 無理しないでね♪",
    longTermVision: "この経験がね、きっと将来の「あなたらしさ」を作る大事なピースになるから〜✨ 楽しみだよね！",
    encouragingWords: "あなたなら絶対大丈夫だよ〜！💪✨",
    practicalTip: "気持ちを紙に書き出してみて〜📝 意外とスッキリするし、客観視もできちゃうよ♪"
  };
}
