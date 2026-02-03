import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const fortuneData: Record<string, {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  teller: string;
  tellerImage: string;
  tellerBio: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  price: number;
  image: string;
  duration: string;
  rating: number;
  reviews: number;
}> = {
  '1': {
    id: '1',
    title: '恋愛運アップの秘訣',
    description: '今週のあなたの恋愛運を詳しく占います',
    fullDescription: 'あなたの生年月日と現在の状況から、恋愛運を詳しく鑑定します。出会いのチャンス、今のパートナーとの相性、気になる人へのアプローチ方法など、具体的なアドバイスをお伝えします。\n\n鑑定内容:\n• 今週の恋愛運の流れ\n• 出会いのタイミング\n• 相性の良い人の特徴\n• 開運アクション',
    teller: '星野美咲',
    tellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    tellerBio: '占い歴15年。タロットと西洋占星術を得意とし、恋愛相談で多くの方の幸せをサポートしてきました。',
    category: 'love',
    categoryLabel: '恋愛',
    categoryColor: '#EC4899',
    price: 500,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop',
    duration: '約10分',
    rating: 4.8,
    reviews: 256,
  },
  '2': {
    id: '2',
    title: '仕事運上昇のアドバイス',
    description: 'キャリアアップに向けた具体的なアドバイス',
    fullDescription: 'あなたの仕事運を多角的に鑑定し、キャリアアップのための具体的なアドバイスをお伝えします。転職のタイミング、人間関係の改善、収入アップのヒントなど。\n\n鑑定内容:\n• 今月の仕事運\n• 適職診断\n• 上司・同僚との相性\n• 成功への開運アクション',
    teller: '月宮葵',
    tellerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    tellerBio: '四柱推命とビジネス占いのスペシャリスト。企業コンサルタントの経験を活かした実践的なアドバイスが好評。',
    category: 'work',
    categoryLabel: '仕事',
    categoryColor: '#3B82F6',
    price: 800,
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=600&fit=crop',
    duration: '約15分',
    rating: 4.9,
    reviews: 189,
  },
  '3': {
    id: '3',
    title: '金運アップの方法',
    description: '財運を高めるための開運アドバイス',
    fullDescription: 'あなたの金運の流れを読み解き、財運アップのための具体的な方法をお伝えします。投資のタイミング、貯蓄のコツ、金運を上げる習慣など。\n\n鑑定内容:\n• 今年の金運の流れ\n• 財運アップの時期\n• お金との向き合い方\n• 開運アクション',
    teller: '天野蓮',
    tellerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    tellerBio: '風水と数秘術のエキスパート。金運・財運に特化した鑑定で、多くの方の経済状況改善をサポート。',
    category: 'money',
    categoryLabel: '金運',
    categoryColor: '#F59E0B',
    price: 600,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    duration: '約12分',
    rating: 4.7,
    reviews: 142,
  },
  '4': {
    id: '4',
    title: '今週の総合運勢',
    description: '恋愛・仕事・金運をまとめて鑑定',
    fullDescription: 'あなたの総合運を多角的に鑑定します。恋愛、仕事、金運、健康など、人生のあらゆる側面からアドバイスをお伝えします。\n\n鑑定内容:\n• 今週の運勢の流れ\n• ラッキーデー・アイテム\n• 注意すべき日\n• 開運アクション',
    teller: '星野美咲',
    tellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    tellerBio: '占い歴15年。タロットと西洋占星術を得意とし、恋愛相談で多くの方の幸せをサポートしてきました。',
    category: 'all',
    categoryLabel: '総合',
    categoryColor: '#8B5CF6',
    price: 300,
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=600&fit=crop',
    duration: '約8分',
    rating: 4.6,
    reviews: 312,
  },
};

export default function FortuneDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const fortune = fortuneData[id || '1'];

  if (!fortune) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>占いが見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: fortune.image }} style={styles.headerImage} />
          <View style={styles.imageBadge}>
            <View style={[styles.badge, { backgroundColor: fortune.categoryColor }]}>
              <Text style={styles.badgeText}>{fortune.categoryLabel}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{fortune.title}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingValue}>{fortune.rating}</Text>
            <Text style={styles.reviewCount}>({fortune.reviews}件のレビュー)</Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>🕐 {fortune.duration}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>鑑定内容</Text>
            <Text style={styles.description}>{fortune.fullDescription}</Text>
          </View>

          {/* Teller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>占い師</Text>
            <View style={styles.tellerCard}>
              <Image source={{ uri: fortune.tellerImage }} style={styles.tellerImage} />
              <View style={styles.tellerInfo}>
                <Text style={styles.tellerName}>{fortune.teller}</Text>
                <Text style={styles.tellerBio} numberOfLines={3}>
                  {fortune.tellerBio}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>価格</Text>
          <Text style={styles.price}>¥{fortune.price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => router.push(`/purchase/${id}`)}
        >
          <Text style={styles.purchaseButtonText}>購入する</Text>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#E5E7EB',
  },
  imageBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingStar: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  durationBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  tellerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tellerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#E5E7EB',
  },
  tellerInfo: {
    flex: 1,
  },
  tellerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  tellerBio: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceContainer: {
    marginRight: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#7C3AED',
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
