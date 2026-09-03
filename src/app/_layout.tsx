import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/auth';
import { LoginScreen } from '@/components/login-screen';
import { usePushRegistration } from '@/hooks/use-push-registration';

SplashScreen.preventAutoHideAsync();

// Notifikasi tetap muncul (banner + suara) walau app lagi kebuka di depan.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  const { signedIn, loading } = useAuth();
  usePushRegistration();
  if (loading) return null;
  return signedIn ? <AppTabs /> : <LoginScreen />;
}
