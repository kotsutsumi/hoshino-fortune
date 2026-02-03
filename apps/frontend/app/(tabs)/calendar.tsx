import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { theme, categoryStyles } from '../../lib/theme';

// 曜日名
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 月の日数を取得
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// 月の最初の曜日を取得
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ダミー運勢データ
function getFortuneForDay(day: number): number {
  // 日付に基づいた疑似ランダムスコア
  return ((day * 7 + 3) % 5) + 1;
}

interface FortuneModalProps {
  visible: boolean;
  date: Date | null;
  onClose: () => void;
}

function FortuneModal({ visible, date, onClose }: FortuneModalProps) {
  if (!date) return null;

  const overallScore = getFortuneForDay(date.getDate());
  const scoreStars = '⭐'.repeat(overallScore) + '☆'.repeat(5 - overallScore);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalDate}>
              {date.getMonth() + 1}月{date.getDate()}日の運勢
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.overallScore}>
            <Text style={styles.overallScoreLabel}>総合運</Text>
            <Text style={styles.overallScoreStars}>{scoreStars}</Text>
          </View>

          <Text style={styles.fortuneMessage}>
            今日は穏やかなエネルギーが流れる日。
            自分のペースを大切にしながら、
            新しいことにもチャレンジしてみて。
          </Text>

          <View style={styles.categoriesContainer}>
            {(Object.entries(categoryStyles) as [string, { color: string; emoji: string; label: string }][]).map(([key, catStyle]) => {
              const score = ((getFortuneForDay(date.getDate()) + key.length) % 5) + 1;
              return (
                <View key={key} style={styles.categoryRow}>
                  <Text style={styles.categoryEmoji}>{catStyle.emoji}</Text>
                  <Text style={styles.categoryLabel}>{catStyle.label}</Text>
                  <Text style={styles.categoryScore}>
                    {'⭐'.repeat(score)}{'☆'.repeat(5 - score)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.luckyItems}>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyItemLabel}>🎨 ラッキーカラー</Text>
              <Text style={styles.luckyItemValue}>ピンク</Text>
            </View>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyItemLabel}>🎁 ラッキーアイテム</Text>
              <Text style={styles.luckyItemValue}>香水</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.detailButton} onPress={onClose}>
            <Text style={styles.detailButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (day: number) => {
    setSelectedDate(new Date(year, month, day));
    setModalVisible(true);
  };

  // カレンダーの日付配列を生成
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // 6行になるよう調整
  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* カレンダーヘッダー */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {year}年 {month + 1}月
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* 曜日ヘッダー */}
        <View style={styles.weekdayHeader}>
          {WEEKDAYS.map((day, index) => (
            <Text
              key={day}
              style={[
                styles.weekdayText,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText,
              ]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* カレンダーグリッド */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day !== null && isToday(day) ? styles.todayCell : undefined,
              ]}
              onPress={() => day !== null && handleDayPress(day)}
              disabled={day === null}
            >
              {day && (
                <>
                  <Text
                    style={[
                      styles.dayText,
                      index % 7 === 0 && styles.sundayText,
                      index % 7 === 6 && styles.saturdayText,
                      isToday(day) && styles.todayText,
                    ]}
                  >
                    {day}
                  </Text>
                  <View style={styles.fortuneIndicator}>
                    <Text style={styles.fortuneIndicatorText}>
                      {'●'.repeat(Math.min(getFortuneForDay(day), 3))}
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 凡例 */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>運勢の目安</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <Text style={styles.legendDots}>●●●</Text>
              <Text style={styles.legendText}>好調</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendDots}>●●</Text>
              <Text style={styles.legendText}>普通</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendDots}>●</Text>
              <Text style={styles.legendText}>注意</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <FortuneModal
        visible={modalVisible}
        date={selectedDate}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  weekdayHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundWhite,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  sundayText: {
    color: '#EF4444',
  },
  saturdayText: {
    color: '#3B82F6',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.backgroundWhite,
    padding: 4,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  todayCell: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  todayText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  fortuneIndicator: {
    marginTop: 2,
  },
  fortuneIndicatorText: {
    fontSize: 6,
    color: theme.colors.primary,
    letterSpacing: -1,
  },
  legend: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: 12,
    ...theme.shadow.sm,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendDots: {
    fontSize: 10,
    color: theme.colors.primary,
    letterSpacing: -1,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  bottomPadding: {
    height: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    ...theme.shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDate: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  overallScore: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallScoreLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  overallScoreStars: {
    fontSize: 24,
    color: theme.colors.warning,
  },
  fortuneMessage: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  categoryScore: {
    fontSize: 14,
    color: theme.colors.warning,
  },
  luckyItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  luckyItem: {
    alignItems: 'center',
  },
  luckyItemLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  luckyItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  detailButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: theme.colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});
