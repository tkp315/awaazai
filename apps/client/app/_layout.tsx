import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { queryClient } from '@/api';
import { toastConfig } from '@/components/ui/toast';

import '../global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Font loading skeleton - add fonts here when needed
  const [fontsLoaded, fontError] = useFonts({
    // "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    // "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    // "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    // "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <Stack  >
           <Stack.Screen
           name='(auth)'
           options={{
            headerShown:false
           }}
           />
          </Stack>
        </QueryClientProvider>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
