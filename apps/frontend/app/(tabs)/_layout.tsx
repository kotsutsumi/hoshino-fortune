import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { theme, tabBarTheme, headerTheme } from '../../lib/theme';

const TAB_CONFIG = {
  index: { icon: '💬', label: 'ホーム' },
  calendar: { icon: '📅', label: '占い' },
  game: { icon: '🎮', label: 'メニュー' },
  profile: { icon: '⚙️', label: '設定' },
} as const;

type TabName = keyof typeof TAB_CONFIG;

function TabIcon({ name, focused }: { name: TabName; focused: boolean }) {
  const config = TAB_CONFIG[name];

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {config?.icon || '📱'}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarTheme.activeTintColor,
        tabBarInactiveTintColor: tabBarTheme.inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarTheme.backgroundColor,
          borderTopWidth: 1,
          borderTopColor: tabBarTheme.borderTopColor,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: headerTheme.backgroundColor,
        },
        headerTintColor: headerTheme.tintColor,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_CONFIG.index.label,
          headerTitle: 'マツコAI',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: TAB_CONFIG.calendar.label,
          headerTitle: '今日の運勢',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: TAB_CONFIG.game.label,
          headerTitle: 'メニュー',
          tabBarIcon: ({ focused }) => <TabIcon name="game" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: TAB_CONFIG.profile.label,
          headerTitle: '設定',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
});
