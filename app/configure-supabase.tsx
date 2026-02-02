
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  loadSupabaseConfig, 
  saveSupabaseConfig, 
  resetSupabaseConfig,
  testSupabaseConfig 
} from '@/lib/supabase';

export default function ConfigureSupabaseScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const loadCurrentConfig = async () => {
      console.log('Loading current Supabase configuration');
      const config = await loadSupabaseConfig();
      if (config.supabaseUrl) {
        setUrl(config.supabaseUrl);
      }
      if (config.supabaseAnonKey) {
        setAnonKey(config.supabaseAnonKey);
      }
      setInitialLoading(false);
    };
    loadCurrentConfig();
  }, []);

  const handleSave = async () => {
    console.log('User tapped Save button');

    const trimmedUrl = url.trim();
    const trimmedAnonKey = anonKey.trim();

    if (!trimmedUrl || !trimmedAnonKey) {
      showErrorModal('Erreur', 'Veuillez renseigner tous les champs.');
      return;
    }

    setLoading(true);

    try {
      // Test the configuration
      console.log('Testing Supabase configuration...');
      const testResult = await testSupabaseConfig(trimmedUrl, trimmedAnonKey);

      if (!testResult.success) {
        console.error('Supabase configuration test failed:', testResult.error);
        showErrorModal(
          'Configuration invalide',
          'Clés invalides ou projet inaccessible.\n\n' + (testResult.error || '')
        );
        return;
      }

      // Save the configuration
      console.log('Saving Supabase configuration...');
      await saveSupabaseConfig(trimmedUrl, trimmedAnonKey);

      console.log('Configuration saved successfully');
      showSuccessModal('Succès', 'Configuration enregistrée avec succès.');

      // Navigate to login after a short delay
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error) {
      console.error('Error saving Supabase configuration:', error);
      showErrorModal(
        'Erreur',
        'Une erreur est survenue lors de l\'enregistrement de la configuration.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('User tapped Cancel button');
    router.back();
  };

  const handleResetConfirm = async () => {
    console.log('User confirmed reset');
    setShowResetModal(false);
    setLoading(true);

    try {
      await resetSupabaseConfig();
      console.log('Configuration reset successfully');
      showSuccessModal('Succès', 'Configuration réinitialisée.');

      // Navigate back to the configuration required screen
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (error) {
      console.error('Error resetting configuration:', error);
      showErrorModal('Erreur', 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  const showErrorModal = (title: string, message: string) => {
    // Using a simple custom modal instead of Alert for cross-platform compatibility
    setModalContent({ title, message, type: 'error' });
    setShowModal(true);
  };

  const showSuccessModal = (title: string, message: string) => {
    setModalContent({ title, message, type: 'success' });
    setShowModal(true);
  };

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'error' });

  const urlPlaceholder = 'https://votre-projet.supabase.co';
  const anonKeyPlaceholder = 'Votre clé anonyme Supabase';
  const saveButtonText = 'Enregistrer';
  const cancelButtonText = 'Annuler';
  const resetButtonText = 'Réinitialiser configuration';
  const resetModalTitle = 'Confirmer la réinitialisation';
  const resetModalMessage = 'Voulez-vous vraiment effacer la configuration Supabase locale ?';
  const resetModalConfirm = 'Réinitialiser';
  const resetModalCancel = 'Annuler';

  if (initialLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Configuration Supabase' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Configuration Supabase' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={[styles.label, { color: colors.text }]}>
              Supabase URL
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder={urlPlaceholder}
              placeholderTextColor={colors.text + '80'}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              editable={!loading}
            />

            <Text style={[styles.label, { color: colors.text }]}>
              Supabase Anon Key
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder={anonKeyPlaceholder}
              placeholderTextColor={colors.text + '80'}
              value={anonKey}
              onChangeText={setAnonKey}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={4}
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{saveButtonText}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: colors.border },
              ]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                {cancelButtonText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.dangerButton,
              ]}
              onPress={() => setShowResetModal(true)}
              disabled={loading}
            >
              <Text style={styles.dangerButtonText}>{resetButtonText}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {resetModalTitle}
            </Text>
            <Text style={[styles.modalMessage, { color: colors.text }]}>
              {resetModalMessage}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton, { borderColor: colors.border }]}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={[styles.modalCancelButtonText, { color: colors.text }]}>
                  {resetModalCancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleResetConfirm}
              >
                <Text style={styles.modalConfirmButtonText}>{resetModalConfirm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success/Error Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {modalContent.title}
            </Text>
            <Text style={[styles.modalMessage, { color: colors.text }]}>
              {modalContent.message}
            </Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalSingleButton,
                { backgroundColor: modalContent.type === 'success' ? '#4CAF50' : '#f44336' }
              ]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalConfirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSingleButton: {
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  modalConfirmButton: {
    backgroundColor: '#f44336',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
