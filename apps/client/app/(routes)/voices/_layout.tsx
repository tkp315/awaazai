import { Stack } from 'expo-router';

export default function VoicesLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[botId]/create" />
      <Stack.Screen name="[botId]/[voiceId]" />
    </Stack>
  );
}
