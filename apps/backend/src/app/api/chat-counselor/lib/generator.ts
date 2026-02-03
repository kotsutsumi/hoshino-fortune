import OpenAI from "openai";
import type { MessageAnalysis, ResponsePolicy, ChatMessage } from "./types";
import { MATSUKO_SYSTEM_PROMPT, generateContextPrompt } from "./prompts";

// OpenAI クライアント（遅延初期化）
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * マツコ風の応答を生成
 */
export async function generateResponse(
  userMessage: string,
  analysis: MessageAnalysis,
  policy: ResponsePolicy,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const openai = getOpenAIClient();

  // システムプロンプトとコンテキストプロンプトを結合
  const contextPrompt = generateContextPrompt(analysis, policy);
  const systemContent = `${MATSUKO_SYSTEM_PROMPT}\n\n## 今回の応答指針\n${contextPrompt}`;

  // 会話履歴をOpenAI形式に変換
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
  ];

  // 過去の会話を追加（最新5件まで）
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // 現在のユーザーメッセージを追加
  messages.push({ role: "user", content: userMessage });

  // OpenAI API を呼び出し
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.8,
    max_tokens: 500,
    presence_penalty: 0.6,
    frequency_penalty: 0.3,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return response;
}

/**
 * フォールバック応答（API失敗時）
 */
export function getFallbackResponse(analysis: MessageAnalysis): string {
  const fallbacks: Record<string, string[]> = {
    positive: [
      "あら、嬉しそうじゃない！その調子よ、アンタ！",
      "いい感じね〜。その幸せ、大事にしなさいよ。",
    ],
    negative: [
      "あらあら、辛かったわね。でもね、こういう時こそ自分を責めちゃダメよ。",
      "そうよね、辛い時は辛いって言っていいの。アタシはアンタの味方だから。",
    ],
    anxious: [
      "不安よね、わかるわ。でもね、その不安を感じられるってことは、アンタがちゃんと考えてる証拠よ。",
      "心配になる気持ち、よくわかるわ。でも大丈夫、なんとかなるもんよ。",
    ],
    neutral: [
      "ふーん、なるほどね。それで？もっと聞かせて。",
      "そうなの。アンタの話、もっと聞きたいわね。",
    ],
  };

  const responses = fallbacks[analysis.emotion] || fallbacks.neutral;
  return responses[Math.floor(Math.random() * responses.length)];
}
