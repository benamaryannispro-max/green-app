
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Admin/Team Leader state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Driver state
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [driverLoading, setDriverLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\+33[1-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const isValidPin = (pin: string) => {
    const pinRegex = /^\d{4,6}$/;
    return pinRegex.test(pin);
  };

  const handleAdminLogin = async () => {
    console.log('User tapped Admin Login button');

    if (!isValidEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    if (!password) {
      Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      Alert.alert('Erreur', 'Supabase n\'est pas configuré. Veuillez vérifier votre configuration.');
      return;
    }

    setAdminLoading(true);
    console.log('Submitting admin login with email:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Admin login error:', error);
        Alert.alert('Erreur de connexion', 'Identifiants incorrects ou problème réseau');
      } else {
        console.log('Admin login successful, navigating to /router');
        router.replace('/router');
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDriverLogin = async () => {
    console.log('User tapped Driver Login button');

    if (!isValidPhone(phone)) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide (+33...)');
      return;
    }

    if (!isValidPin(pin)) {
      Alert.alert('Erreur', 'Le PIN doit contenir 4 à 6 chiffres');
      return;
    }

    setDriverLoading(true);
    console.log('Driver login placeholder - phone:', phone, 'pin:', pin);

    // Placeholder for driver login
    setTimeout(() => {
      setDriverLoading(false);
      Alert.alert(
        'Information',
        'La connexion chauffeur sera activée à l\'étape Page 2/4.'
      );
    }, 500);
  };

  const emailPlaceholder = 'Email';
  const passwordPlaceholder = 'Mot de passe';
  const phonePlaceholder = 'Téléphone (+33...)';
  const pinPlaceholder = 'PIN (4-6 chiffres)';
  const adminTitle = 'Chef d\'équipe / Admin';
  const driverTitle = 'Chauffeur';
  const loginButtonText = 'Se connecter';
  const showPasswordText = 'Afficher';
  const hidePasswordText = 'Masquer';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Connexion', headerShown: true }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Admin/Team Leader Section */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {adminTitle}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={emailPlaceholder}
                placeholderTextColor={colors.text + '80'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!adminLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={passwordPlaceholder}
                placeholderTextColor={colors.text + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                editable={!adminLoading}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={[styles.showPasswordText, { color: colors.primary }]}>
                  {showPassword ? hidePasswordText : showPasswordText}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                adminLoading && styles.buttonDisabled,
              ]}
              onPress={handleAdminLogin}
              disabled={adminLoading}
            >
              {adminLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{loginButtonText}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Driver Section */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {driverTitle}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={phonePlaceholder}
                placeholderTextColor={colors.text + '80'}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                editable={!driverLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={pinPlaceholder}
                placeholderTextColor={colors.text + '80'}
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                editable={!driverLoading}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                driverLoading && styles.buttonDisabled,
              ]}
              onPress={handleDriverLogin}
              disabled={driverLoading}
            >
              {driverLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{loginButtonText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  showPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
