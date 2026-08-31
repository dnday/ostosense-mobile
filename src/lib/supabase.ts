import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Pakai environment variables atau hardcode sementara agar mudah diuji di Expo
const SUPABASE_URL = 'https://jmjxhtksvsfpczpdwfqa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanhodGtzdnNmcGN6cGR3ZnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mjk3MTUsImV4cCI6MjA5OTAwNTcxNX0.lWsuf47uvOHfVIr3iz4oLH8U4ZPiErkucusNBjcJSzc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // AsyncStorage's web shim touches `window` at init, which crashes Expo Router's SSR (Node has no window).
    // On web, leave storage unset so supabase-js falls back to its own SSR-safe browser detection.
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
