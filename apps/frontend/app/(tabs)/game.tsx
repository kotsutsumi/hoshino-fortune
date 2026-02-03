import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { theme } from '../../lib/theme';

interface MenuItemProps {
  emoji: string;
  title: string;
  description: string;
  onPress: () => void;
  badge?: string;
}

function MenuItem({ emoji, title, description, onPress, badge }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.menuEmoji}>
        <Text style={styles.menuEmojiText}>{emoji}</Text>
      </View>
      <View style={styles.menuContent}>
        <View style={styles.menuTitleRow}>
          <Text style={styles.menuTitle}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Text style={styles.menuArrow}>▶</Text>
    </TouchableOpacity>
  );
}

function WallpaperCard({ imageUri, title, onDownload }: {
  imageUri: string;
  title: string;
  onDownload: () => void;
}) {
  return (
    <View style={styles.wallpaperCard}>
      <Image
        source={{ uri: imageUri }}
        style={styles.wallpaperImage}
        resizeMode="cover"
      />
      <View style={styles.wallpaperOverlay}>
        <Text style={styles.wallpaperTitle}>{title}</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
          <Text style={styles.downloadButtonText}>ダウンロード</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GameScreen() {
  const handleComingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature}機能は近日公開予定です！`);
  };

  const handleDownload = (title: string) => {
    Alert.alert('ダウンロード', `${title}の壁紙をダウンロードしますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'ダウンロード', onPress: () => Alert.alert('完了', 'ダウンロードが完了しました！') },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ヒーローセクション */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>お楽しみコンテンツ</Text>
        <Text style={styles.heroSubtitle}>壁紙やお守りで運気をアップ！</Text>
      </View>

      {/* 壁紙セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ 今月の壁紙</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.wallpaperScroll}
        >
          <WallpaperCard
            imageUri="https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=300&h=500&fit=crop"
            title="桜の開運壁紙"
            onDownload={() => handleDownload('桜の開運壁紙')}
          />
          <WallpaperCard
            imageUri="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=500&fit=crop"
            title="星空の癒し壁紙"
            onDownload={() => handleDownload('星空の癒し壁紙')}
          />
          <WallpaperCard
            imageUri="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=500&fit=crop"
            title="虹色の幸運壁紙"
            onDownload={() => handleDownload('虹色の幸運壁紙')}
          />
        </ScrollView>
      </View>

      {/* メニューセクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 コンテンツ</Text>

        <MenuItem
          emoji="🖼️"
          title="壁紙ギャラリー"
          description="運気アップの壁紙コレクション"
          onPress={() => handleComingSoon('壁紙ギャラリー')}
        />

        <MenuItem
          emoji="🎴"
          title="おみくじ"
          description="今日の運勢をおみくじで占う"
          onPress={() => handleComingSoon('おみくじ')}
          badge="NEW"
        />

        <MenuItem
          emoji="📿"
          title="お守り"
          description="あなただけの開運お守り"
          onPress={() => handleComingSoon('お守り')}
        />

        <MenuItem
          emoji="🔮"
          title="相性診断"
          description="気になる人との相性をチェック"
          onPress={() => handleComingSoon('相性診断')}
          badge="人気"
        />
      </View>

      {/* プレミアムセクション */}
      <View style={styles.premiumSection}>
        <View style={styles.premiumContent}>
          <Text style={styles.premiumTitle}>👑 プレミアム会員</Text>
          <Text style={styles.premiumDescription}>
            すべての壁紙とコンテンツが使い放題！
          </Text>
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => handleComingSoon('プレミアム')}
          >
            <Text style={styles.premiumButtonText}>詳しく見る</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textWhite,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  wallpaperScroll: {
    paddingRight: 16,
  },
  wallpaperCard: {
    width: 160,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    ...theme.shadow.md,
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  wallpaperOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wallpaperTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textWhite,
    marginBottom: 8,
  },
  downloadButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textWhite,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...theme.shadow.sm,
  },
  menuEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuEmojiText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginRight: 8,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textWhite,
  },
  menuDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  menuArrow: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginLeft: 8,
  },
  premiumSection: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.secondary,
    ...theme.shadow.lg,
  },
  premiumContent: {
    padding: 24,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textWhite,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: theme.colors.textWhite,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  bottomPadding: {
    height: 20,
  },
});
