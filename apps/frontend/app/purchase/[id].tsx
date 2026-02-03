import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const fortuneData: Record<string, {
  id: string;
  title: string;
  teller: string;
  tellerImage: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  price: number;
  image: string;
}> = {
  '1': {
    id: '1',
    title: '恋愛運アップの秘訣',
    teller: '星野美咲',
    tellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    category: 'love',
    categoryLabel: '恋愛',
    categoryColor: '#EC4899',
    price: 500,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
  },
  '2': {
    id: '2',
    title: '仕事運上昇のアドバイス',
    teller: '月宮葵',
    tellerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    category: 'work',
    categoryLabel: '仕事',
    categoryColor: '#3B82F6',
    price: 800,
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=300&fit=crop',
  },
  '3': {
    id: '3',
    title: '金運アップの方法',
    teller: '天野蓮',
    tellerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    category: 'money',
    categoryLabel: '金運',
    categoryColor: '#F59E0B',
    price: 600,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
  },
  '4': {
    id: '4',
    title: '今週の総合運勢',
    teller: '星野美咲',
    tellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    category: 'all',
    categoryLabel: '総合',
    categoryColor: '#8B5CF6',
    price: 300,
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=300&fit=crop',
  },
};

const paymentMethods = [
  { id: 'card', label: 'クレジットカード', emoji: '💳', selected: true },
  { id: 'apple', label: 'Apple Pay', emoji: '🍎', selected: false },
  { id: 'google', label: 'Google Pay', emoji: '🤖', selected: false },
];

export default function PurchaseConfirm() {
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

  const handlePurchase = () => {
    // Navigate to completion screen
    router.replace('/purchase/complete');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ご注文内容</Text>
          <View style={styles.orderCard}>
            <Image source={{ uri: fortune.image }} style={styles.orderImage} />
            <View style={styles.orderInfo}>
              <View style={[styles.badge, { backgroundColor: fortune.categoryColor }]}>
                <Text style={styles.badgeText}>{fortune.categoryLabel}</Text>
              </View>
              <Text style={styles.orderTitle}>{fortune.title}</Text>
              <View style={styles.tellerRow}>
                <Image source={{ uri: fortune.tellerImage }} style={styles.tellerImage} />
                <Text style={styles.tellerName}>{fortune.teller}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>お支払い方法</Text>
          <View style={styles.paymentContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  method.selected && styles.paymentOptionSelected,
                ]}
              >
                <View style={styles.paymentLeft}>
                  <Text style={styles.paymentEmoji}>{method.emoji}</Text>
                  <Text style={styles.paymentLabel}>{method.label}</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    method.selected && styles.radioButtonSelected,
                  ]}
                >
                  {method.selected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>お支払い金額</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>商品価格</Text>
              <Text style={styles.priceValue}>¥{fortune.price.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>手数料</Text>
              <Text style={styles.priceValue}>¥0</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>合計（税込）</Text>
              <Text style={styles.totalValue}>¥{fortune.price.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            「購入する」をタップすると、
            <Text style={styles.termsLink}>利用規約</Text>と
            <Text style={styles.termsLink}>プライバシーポリシー</Text>
            に同意したことになります。
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalSmallLabel}>お支払い金額</Text>
          <Text style={styles.totalSmallValue}>¥{fortune.price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#E5E7EB',
  },
  orderInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  tellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tellerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
  },
  tellerName: {
    fontSize: 13,
    color: '#6B7280',
  },
  paymentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentOptionSelected: {
    backgroundColor: '#F5F3FF',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#7C3AED',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7C3AED',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7C3AED',
  },
  termsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  termsLink: {
    color: '#7C3AED',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalContainer: {
    marginRight: 16,
  },
  totalSmallLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  totalSmallValue: {
    fontSize: 22,
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
