import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
//--------------------
import { useColorScheme } from '@/hooks/useColorScheme';
//--------------------
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '@/db';

export const DATABASE_NAME = 'books';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error during setup:', error);
      }
    };
    setup();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SQLiteProvider>
      </Suspense>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
