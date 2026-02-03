import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F5F3FF',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="fortune/[id]"
          options={{
            title: '占い詳細',
            headerBackTitle: '戻る',
          }}
        />
        <Stack.Screen
          name="purchase/[id]"
          options={{
            title: '購入確認',
            headerBackTitle: '戻る',
          }}
        />
        <Stack.Screen
          name="purchase/complete"
          options={{
            title: '購入完了',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
