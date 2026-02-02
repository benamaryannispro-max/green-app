
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function DriverDashboardScreen() {
  const { colors } = useTheme();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    console.log('Driver Dashboard: Signing out');
    await signOut();
    router.replace('/login');
  };

  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: colors.text }]}>
            Page 5: Driver Dashboard
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            (À implémenter)
          </Text>
          
          {profile && (
            <View style={styles.profileInfo}>
              <Text style={[styles.infoText, { color: colors.text }]}>
                {fullName}
              </Text>
              <Text style={[styles.infoText, { color: colors.text }]}>
                Chauffeur
              </Text>
              <Text style={[styles.infoText, { color: colors.text }]}>
                {profile.phone}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 32,
  },
  profileInfo: {
    marginVertical: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
