
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@react-navigation/native';

export default function IndexScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    console.log('Index: Checking auth state', { loading, hasSession: !!session });
    
    if (!loading) {
      if (session) {
        console.log('Index: User authenticated, redirecting to router');
        router.replace('/router');
      } else {
        console.log('Index: No session, redirecting to login');
        router.replace('/login');
      }
    }
  }, [loading, session]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Green Hands
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
