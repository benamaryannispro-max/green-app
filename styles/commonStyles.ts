
import { StyleSheet } from 'react-native';

// Green Hands color palette - professional and clean
export const colors = {
  // Light theme
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    primary: '#10B981', // Green - main brand color
    primaryDark: '#059669',
    secondary: '#3B82F6', // Blue - secondary actions
    accent: '#F59E0B', // Amber - highlights
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  // Dark theme
  dark: {
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#10B981',
    primaryDark: '#059669',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    border: '#374151',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
});
