import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  todayFortuneAtom,
  selectedDateAtom,
  fortuneLoadingAtom,
  userHeavenlyStemAtom,
  DayFortune,
} from '../lib/store';
import { getApiBaseUrl } from '@hoshino/api';

export function useDayFortune() {
  const [fortune, setFortune] = useAtom(todayFortuneAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [loading, setLoading] = useAtom(fortuneLoadingAtom);
  const [userHeavenlyStem] = useAtom(userHeavenlyStemAtom);

  const fetchFortune = useCallback(async (date?: Date) => {
    const targetDate = date || selectedDate;
    setLoading(true);

    try {
      const baseUrl = getApiBaseUrl();
      const dateStr = targetDate.toISOString().split('T')[0];
      const url = `${baseUrl}/api/day-fortune?userHeavenlyStem=${encodeURIComponent(userHeavenlyStem)}&date=${dateStr}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: DayFortune = await response.json();
      setFortune(data);
      return data;
    } catch (error) {
      console.error('Fortune fetch error:', error);
      // Return fallback data
      const fallbackFortune: DayFortune = {
        date: targetDate.toISOString().split('T')[0],
        userHeavenlyStem,
        dayHeavenlyStem: '甲',
        tenGod: '比肩',
        tenGodDescription: '自分と同じエネルギー。独立心と自主性が高まり、マイペースに進める日。',
        overallScore: 3,
        overallMessage: '今日は穏やかな一日。自分のペースを大切に過ごして。',
        categories: [
          { category: 'love', label: '恋愛運', score: 3, message: '安定した恋愛運', advice: '焦らずゆっくりと' },
          { category: 'work', label: '仕事運', score: 3, message: '普通の仕事運', advice: '着実に進めて' },
          { category: 'relationships', label: '人間関係運', score: 3, message: '普通の対人運', advice: '笑顔を忘れずに' },
          { category: 'money', label: '金運', score: 3, message: '普通の金運', advice: '無駄遣いに注意' },
        ],
        luckyColor: 'ピンク',
        luckyItem: '香水',
        luckyDirection: '南',
      };
      setFortune(fallbackFortune);
      return fallbackFortune;
    } finally {
      setLoading(false);
    }
  }, [selectedDate, userHeavenlyStem, setFortune, setLoading]);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    fetchFortune(date);
  }, [setSelectedDate, fetchFortune]);

  return {
    fortune,
    selectedDate,
    loading,
    fetchFortune,
    selectDate,
  };
}
