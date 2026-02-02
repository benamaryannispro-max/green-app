
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@react-navigation/native';
import { bootstrapFirstLeader } from '@/utils/bootstrap';

export default function RouterScreen() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    console.log('Router: Loading profile', { loading, hasUser: !!user, hasProfile: !!profile });
    
    if (!loading && user) {
      handleRouting();
    }
  }, [loading, user, profile]);

  const handleRouting = async () => {
    if (!user) {
      console.log('Router: No user, redirecting to login');
      router.replace('/login');
      return;
    }

    if (!profile) {
      console.log('Router: No profile found, user needs to complete registration');
      // TODO: Redirect to profile creation/completion screen
      router.replace('/login');
      return;
    }

    // Check if bootstrap is needed (first leader)
    const bootstrapped = await bootstrapFirstLeader(user.id);
    if (bootstrapped) {
      console.log('Router: User bootstrapped as first leader, refreshing profile');
      await refreshProfile();
      return; // Will re-trigger this effect with updated profile
    }

    // Route based on role
    console.log('Router: Routing based on role', profile.role);
    
    switch (profile.role) {
      case 'admin':
      case 'team_leader':
        router.replace('/admin-home');
        break;
      case 'driver':
        router.replace('/driver-dashboard');
        break;
      default:
        console.error('Router: Unknown role', profile.role);
        router.replace('/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Chargement du profil...
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
    fontSize: 16,
    opacity: 0.6,
  },
});
