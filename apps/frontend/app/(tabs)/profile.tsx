import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { theme } from '../../lib/theme';

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

interface SettingRowProps {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

function SettingRow({
  icon,
  title,
  value,
  onPress,
  hasSwitch,
  switchValue,
  onSwitchChange,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={hasSwitch ? 1 : 0.7}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingTitle}>{title}</Text>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E5E7EB', true: theme.colors.primaryLight }}
          thumbColor={switchValue ? theme.colors.primary : '#F3F4F6'}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && <Text style={styles.settingValue}>{value}</Text>}
          <Text style={styles.settingArrow}>▶</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function StemPickerModal({
  visible,
  currentStem,
  onSelect,
  onClose,
}: {
  visible: boolean;
  currentStem: string;
  onSelect: (stem: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>天干を選択</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDescription}>
            あなたの生年月日から算出された天干を選択してください。
            天干がわからない場合は、生年月日設定から自動計算できます。
          </Text>

          <View style={styles.stemGrid}>
            {HEAVENLY_STEMS.map((stem) => (
              <TouchableOpacity
                key={stem}
                style={[
                  styles.stemButton,
                  currentStem === stem && styles.stemButtonActive,
                ]}
                onPress={() => {
                  onSelect(stem);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.stemButtonText,
                    currentStem === stem && styles.stemButtonTextActive,
                  ]}
                >
                  {stem}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const [heavenlyStem, setHeavenlyStem] = useState('甲');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showStemPicker, setShowStemPicker] = useState(false);

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'ログアウト', style: 'destructive', onPress: () => {} },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '退会',
      'アカウントを削除すると、すべてのデータが失われます。本当に退会しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '退会する', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* プロフィールヘッダー */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>ゲストユーザー</Text>
        <Text style={styles.userEmail}>ログインしてデータを保存</Text>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>ログイン / 新規登録</Text>
        </TouchableOpacity>
      </View>

      {/* 占い設定セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>占い設定</Text>

        <SettingRow
          icon="🌟"
          title="天干"
          value={heavenlyStem}
          onPress={() => setShowStemPicker(true)}
        />

        <SettingRow
          icon="📅"
          title="生年月日"
          value="未設定"
          onPress={() => Alert.alert('Coming Soon', '生年月日設定は近日公開予定です！')}
        />
      </View>

      {/* 通知設定セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知設定</Text>

        <SettingRow
          icon="🔔"
          title="プッシュ通知"
          hasSwitch
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />

        <SettingRow
          icon="📧"
          title="メール通知"
          value="ON"
          onPress={() => Alert.alert('Coming Soon', 'メール通知設定は近日公開予定です！')}
        />
      </View>

      {/* アプリ設定セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリ設定</Text>

        <SettingRow
          icon="🌙"
          title="ダークモード"
          hasSwitch
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
        />

        <SettingRow
          icon="🌐"
          title="言語"
          value="日本語"
          onPress={() => Alert.alert('Coming Soon', '言語設定は近日公開予定です！')}
        />
      </View>

      {/* サポートセクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>サポート</Text>

        <SettingRow
          icon="❓"
          title="よくある質問"
          onPress={() => Alert.alert('Coming Soon', 'FAQ機能は近日公開予定です！')}
        />

        <SettingRow
          icon="📝"
          title="お問い合わせ"
          onPress={() => Alert.alert('Coming Soon', 'お問い合わせ機能は近日公開予定です！')}
        />

        <SettingRow
          icon="⭐"
          title="アプリを評価"
          onPress={() => Alert.alert('Coming Soon', 'レビュー機能は近日公開予定です！')}
        />
      </View>

      {/* 法的情報セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>法的情報</Text>

        <SettingRow
          icon="📄"
          title="利用規約"
          onPress={() => Alert.alert('Coming Soon', '利用規約は近日公開予定です！')}
        />

        <SettingRow
          icon="🔒"
          title="プライバシーポリシー"
          onPress={() => Alert.alert('Coming Soon', 'プライバシーポリシーは近日公開予定です！')}
        />

        <SettingRow
          icon="📋"
          title="特定商取引法に基づく表記"
          onPress={() => Alert.alert('Coming Soon', '特商法表記は近日公開予定です！')}
        />
      </View>

      {/* アカウント管理セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アカウント</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>ログアウト</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>退会する</Text>
        </TouchableOpacity>
      </View>

      {/* アプリ情報 */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Hoshino Fortune v1.0.0</Text>
        <Text style={styles.copyright}>© 2024 Hoshino Fortune</Text>
      </View>

      <View style={styles.bottomPadding} />

      <StemPickerModal
        visible={showStemPicker}
        currentStem={heavenlyStem}
        onSelect={setHeavenlyStem}
        onClose={() => setShowStemPicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.backgroundWhite,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadow.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textWhite,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundWhite,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  settingArrow: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  logoutButton: {
    backgroundColor: theme.colors.backgroundWhite,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  deleteButton: {
    backgroundColor: theme.colors.backgroundWhite,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: theme.colors.error,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  bottomPadding: {
    height: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalClose: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    padding: 8,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  stemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stemButton: {
    width: '18%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: 10,
  },
  stemButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  stemButtonText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  stemButtonTextActive: {
    color: theme.colors.textWhite,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
