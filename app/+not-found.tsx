
import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Page introuvable
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Cette page n&apos;existe pas.
        </Text>
        <Link href="/" style={[styles.link, { color: colors.primary }]}>
          <Text style={styles.linkText}>
            Retour à l&apos;accueil
          </Text>
        </Link>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
