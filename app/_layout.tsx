
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useNetworkState } from "expo-network";
import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import "react-native-reanimated";
import { colors } from "@/styles/commonStyles";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Custom theme with Green Hands colors
const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    card: colors.light.card,
    text: colors.light.text,
    border: colors.light.border,
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    card: colors.dark.card,
    text: colors.dark.text,
    border: colors.dark.border,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isConnected } = useNetworkState();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (isConnected === false) {
      console.warn('No internet connection detected');
    }
  }, [isConnected]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : LightTheme}>
        <AuthProvider>
          <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen 
              name="login" 
              options={{ 
                title: "Connexion",
                headerShown: true,
                headerBackTitle: "Retour"
              }} 
            />
            <Stack.Screen 
              name="router" 
              options={{ 
                title: "Chargement...",
                headerShown: false
              }} 
            />
            <Stack.Screen 
              name="admin-home" 
              options={{ 
                title: "Admin",
                headerShown: true,
                headerBackTitle: "Retour"
              }} 
            />
            <Stack.Screen 
              name="driver-dashboard" 
              options={{ 
                title: "Chauffeur",
                headerShown: true,
                headerBackTitle: "Retour"
              }} 
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
