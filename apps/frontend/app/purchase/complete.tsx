import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PurchaseComplete() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>
          <View style={styles.sparkles}>
            <Text style={styles.sparkle1}>✨</Text>
            <Text style={styles.sparkle2}>⭐</Text>
            <Text style={styles.sparkle3}>✨</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>購入完了！</Text>
        <Text style={styles.subtitle}>
          ご購入ありがとうございます{'\n'}
          占い結果をお楽しみください
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>🔮</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>鑑定結果</Text>
              <Text style={styles.infoDescription}>
                マイページからいつでも確認できます
              </Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>📧</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>メール通知</Text>
              <Text style={styles.infoDescription}>
                ご登録のメールアドレスに領収書を送信しました
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/(tabs)/mypage')}
        >
          <Text style={styles.primaryButtonText}>結果を見る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.secondaryButtonText}>ホームに戻る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  iconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sparkles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 24,
  },
  sparkle2: {
    position: 'absolute',
    top: 20,
    left: -20,
    fontSize: 20,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 10,
    right: -15,
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  bottomActions: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  secondaryButtonText: {
    color: '#7C3AED',
    fontSize: 17,
    fontWeight: '700',
  },
});
