import { z } from "zod";

// 十天干
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export type HeavenlyStem = typeof HEAVENLY_STEMS[number];

// 十神
export const TEN_GODS = [
  '比肩', '劫財', '食神', '傷官', '偏財',
  '正財', '偏官', '正官', '偏印', '印綬'
] as const;
export type TenGod = typeof TEN_GODS[number];

// 運勢カテゴリ
export const FORTUNE_CATEGORIES = ['love', 'work', 'relationships', 'money'] as const;
export type FortuneCategory = typeof FORTUNE_CATEGORIES[number];

// カテゴリラベル
export const CATEGORY_LABELS: Record<FortuneCategory, string> = {
  love: '恋愛運',
  work: '仕事運',
  relationships: '人間関係運',
  money: '金運',
};

// スコアレベル
export type ScoreLevel = 1 | 2 | 3 | 4 | 5;

// カテゴリ別運勢
export interface CategoryFortune {
  category: FortuneCategory;
  label: string;
  score: ScoreLevel;
  message: string;
  advice: string;
}

// 日の運勢レスポンス
export interface DayFortuneResponse {
  date: string;
  userHeavenlyStem: HeavenlyStem;
  dayHeavenlyStem: HeavenlyStem;
  tenGod: TenGod;
  tenGodDescription: string;
  overallScore: ScoreLevel;
  overallMessage: string;
  categories: CategoryFortune[];
  luckyColor: string;
  luckyItem: string;
  luckyDirection: string;
}

// リクエストバリデーション
export const DayFortuneRequestSchema = z.object({
  userHeavenlyStem: z.enum(HEAVENLY_STEMS),
  date: z.string().optional(), // ISO date string, defaults to today
});

export type DayFortuneRequest = z.infer<typeof DayFortuneRequestSchema>;
