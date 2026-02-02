
import React, { useState } from 'react';
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
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // Admin/Team Leader state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Driver state
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loadingDriver, setLoadingDriver] = useState(false);

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+33[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const isValidPin = (pin: string): boolean => {
    const pinRegex = /^[0-9]{4,6}$/;
    return pinRegex.test(pin);
  };

  // Computed validation states
  const emailValid = isValidEmail(email);
  const passwordValid = password.length > 0;
  const phoneValid = isValidPhone(phone);
  const pinValid = isValidPin(pin);

  const canSubmitAdmin = emailValid && passwordValid;
  const canSubmitDriver = phoneValid && pinValid;

  // Admin login handler
  const handleAdminLogin = async () => {
    console.log('User tapped Admin login button');
    setLoadingAdmin(true);
    setAdminError('');

    try {
      console.log('Attempting admin login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Admin login error:', error);
        
        // Provide user-friendly French error messages
        let errorMessage = 'Problème réseau ou serveur.';
        
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('invalid login credentials') ||
            error.message.includes('Invalid email or password')) {
          errorMessage = 'Identifiants incorrects.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email non confirmé.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Problème de connexion réseau.';
        }
        
        setAdminError(errorMessage);
      } else {
        console.log('Admin login successful, navigating to /router');
        router.replace('/router');
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      setAdminError('Problème réseau ou serveur.');
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Driver login handler (placeholder)
  const handleDriverLogin = () => {
    console.log('User tapped Driver login button');
    setLoadingDriver(true);

    // Placeholder: Store phone and PIN in state and show message
    console.log('Driver login attempt:', { phone, pin });
    
    setTimeout(() => {
      Alert.alert(
        'Information',
        `Connexion chauffeur sera activée à l'étape Page 2/4.\n\nTéléphone: ${phone}\nPIN: ${pin}`,
        [{ text: 'OK' }]
      );
      setLoadingDriver(false);
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Connexion',
          headerShown: true,
        }}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Admin/Team Leader Section */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Chef d'équipe / Admin
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: email.length > 0 && !emailValid ? '#EF4444' : colors.border,
                  }
                ]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setAdminError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loadingAdmin}
              />
              {email.length > 0 && !emailValid && (
                <Text style={styles.errorText}>
                  Format d'email invalide.
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    }
                  ]}
                  placeholder="Mot de passe"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setAdminError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loadingAdmin}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loadingAdmin}
                >
                  <IconSymbol
                    ios_icon_name={showPassword ? 'eye.slash' : 'eye'}
                    android_material_icon_name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Admin Error Message */}
            {adminError.length > 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {adminError}
                </Text>
              </View>
            )}

            {/* Admin Login Button */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: '#10B981' },
                (!canSubmitAdmin || loadingAdmin) && styles.buttonDisabled,
              ]}
              onPress={handleAdminLogin}
              disabled={!canSubmitAdmin || loadingAdmin}
            >
              {loadingAdmin ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Se connecter
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Driver Section */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Chauffeur
            </Text>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: phone.length > 0 && !phoneValid ? '#EF4444' : colors.border,
                  }
                ]}
                placeholder="Téléphone (+33...)"
                placeholderTextColor={colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loadingDriver}
              />
              {phone.length > 0 && !phoneValid && (
                <Text style={styles.errorText}>
                  Format de téléphone invalide (+33...).
                </Text>
              )}
            </View>

            {/* PIN Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: pin.length > 0 && !pinValid ? '#EF4444' : colors.border,
                  }
                ]}
                placeholder="PIN (4-6 chiffres)"
                placeholderTextColor={colors.textSecondary}
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loadingDriver}
              />
              {pin.length > 0 && !pinValid && (
                <Text style={styles.errorText}>
                  PIN numérique (4-6 chiffres).
                </Text>
              )}
            </View>

            {/* Driver Login Button */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: '#3B82F6' },
                (!canSubmitDriver || loadingDriver) && styles.buttonDisabled,
              ]}
              onPress={handleDriverLogin}
              disabled={!canSubmitDriver || loadingDriver}
            >
              {loadingDriver ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Se connecter
                </Text>
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
    paddingTop: 24,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    padding: 4,
  },
  errorContainer: {
    marginBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
