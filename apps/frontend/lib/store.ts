import { atom } from 'jotai';
import { FortuneContent } from '@hoshino/domain';

export type AppError = {
  code: string;
  message: string;
  retryable: boolean;
};

// Fortune content atoms (existing)
export const fortunesAtom = atom<FortuneContent[]>([]);
export const fortunesLoadedAtom = atom<boolean>(false);
export const fortunesLoadingAtom = atom<boolean>(false);
export const fortunesFetchingAtom = atom<boolean>(false);
export const fortunesErrorAtom = atom<AppError | null>(null);

// Chat message type
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Chat atoms
export const chatMessagesAtom = atom<ChatMessage[]>([]);
export const chatLoadingAtom = atom<boolean>(false);
export const chatErrorAtom = atom<AppError | null>(null);

// User settings atoms
export const userHeavenlyStemAtom = atom<string>('甲');

// Day fortune type
export interface DayFortune {
  date: string;
  userHeavenlyStem: string;
  dayHeavenlyStem: string;
  tenGod: string;
  tenGodDescription: string;
  overallScore: number;
  overallMessage: string;
  categories: {
    category: string;
    label: string;
    score: number;
    message: string;
    advice: string;
  }[];
  luckyColor: string;
  luckyItem: string;
  luckyDirection: string;
}

// Day fortune atoms
export const todayFortuneAtom = atom<DayFortune | null>(null);
export const selectedDateAtom = atom<Date>(new Date());
export const fortuneLoadingAtom = atom<boolean>(false);
