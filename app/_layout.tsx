
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useNetworkState } from "expo-network";
import { useFonts } from "expo-font";
import { useColorScheme, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import "react-native-reanimated";
import { colors } from "@/styles/commonStyles";
import { getSupabaseConfig, SupabaseConfigStatus } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

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

function ConfigurationRequiredScreen({ config, onReload }: { config: SupabaseConfigStatus; onReload: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const urlDisplay = config.supabaseUrl || '(vide)';
  const keyDisplay = config.supabaseAnonKey ? '********' : '(vide)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.dark.background : colors.light.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: isDark ? colors.dark.text : colors.light.text }]}>
            Configuration Supabase requise
          </Text>
          
          <Text style={[styles.message, { color: isDark ? colors.dark.text : colors.light.text }]}>
            Veuillez renseigner les clés Supabase dans la section "extra" de votre fichier app.json :
          </Text>

          <View style={[styles.codeBlock, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
            <Text style={[styles.codeText, { color: isDark ? '#e0e0e0' : '#333' }]}>
              {`{
  "expo": {
    "extra": {
      "supabaseUrl": "YOUR_SUPABASE_URL",
      "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
    }
  }
}`}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusTitle, { color: isDark ? colors.dark.text : colors.light.text }]}>
              État actuel :
            </Text>
            
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: isDark ? colors.dark.text : colors.light.text }]}>
                supabaseUrl:
              </Text>
              <Text style={[styles.statusValue, { color: config.supabaseUrl ? '#4CAF50' : '#f44336' }]}>
                {urlDisplay}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: isDark ? colors.dark.text : colors.light.text }]}>
                supabaseAnonKey:
              </Text>
              <Text style={[styles.statusValue, { color: config.supabaseAnonKey ? '#4CAF50' : '#f44336' }]}>
                {keyDisplay}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isDark ? colors.dark.primary : colors.light.primary }]}
            onPress={onReload}
          >
            <Text style={styles.buttonText}>Recharger la configuration</Text>
          </TouchableOpacity>

          <Text style={[styles.helpText, { color: isDark ? '#999' : '#666' }]}>
            Après avoir modifié app.json, redémarrez l'application ou appuyez sur "Recharger".
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isConnected } = useNetworkState();
  const [supabaseConfigStatus, setSupabaseConfigStatus] = useState<SupabaseConfigStatus | null>(null);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('RootLayout: Checking Supabase configuration');
    setSupabaseConfigStatus(getSupabaseConfig());
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      console.warn('No internet connection detected');
    }
  }, [isConnected]);

  const handleReload = () => {
    console.log('RootLayout: Reloading Supabase configuration');
    // Clear the cached config and re-evaluate
    setSupabaseConfigStatus(null);
    setTimeout(() => {
      setSupabaseConfigStatus(getSupabaseConfig());
    }, 100);
  };

  if (!loaded) {
    return null;
  }

  // Show loading while checking configuration
  if (!supabaseConfigStatus) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? colors.dark.background : colors.light.background }}>
        <Text style={{ color: colorScheme === 'dark' ? colors.dark.text : colors.light.text }}>
          Chargement de la configuration...
        </Text>
      </View>
    );
  }

  // Show configuration screen if Supabase is not configured
  if (!supabaseConfigStatus.configured) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : LightTheme}>
          <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
          <ConfigurationRequiredScreen config={supabaseConfigStatus} onReload={handleReload} />
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  // If configured, proceed with normal app rendering
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  codeBlock: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
