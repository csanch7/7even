import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import type { RootStackParamList } from '../../App';
import { MatchResponse } from '../types/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Match'>;

interface SuggestionItem {
  name: string;
  type: string;
  matchedTags: string[];
}

export function MatchScreen({ navigation }: Props) {
  const { accessToken, logout } = useAuth();
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setRefreshing(true);
    try {
      const current = await apiRequest<MatchResponse | null>(
        '/matches/current',
        undefined,
        accessToken
      );
      setMatch(current);
      if (current?._id) {
        const suggestionRes = await apiRequest<{ items: SuggestionItem[] }>(
          `/matches/${current._id}/suggestions`,
          undefined,
          accessToken
        );
        setSuggestions(suggestionRes?.items ?? []);
      } else {
        setSuggestions([]);
      }
    } finally {
      setRefreshing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Match</Text>
      {match ? (
        <>
          <Text style={styles.meta}>Status: {match.status}</Text>
          <Text style={styles.meta}>Expires: {new Date(match.expiresAt).toLocaleString()}</Text>
          <PrimaryButton label="Open Chat" onPress={() => navigation.navigate('Chat', { matchId: match._id })} />
          <Text style={styles.subtitle}>Top 5 Suggestions</Text>
          <FlatList
            data={suggestions}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text>{item.type}</Text>
                <Text>{item.matchedTags.join(', ')}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.meta}>No active match yet. Check back Sunday.</Text>
      )}
      <PrimaryButton label="Log out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F4EE', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#154734' },
  subtitle: { marginTop: 16, marginBottom: 8, fontSize: 18, fontWeight: '700', color: '#154734' },
  meta: { marginBottom: 6, color: '#4A4A4A' },
  card: { padding: 12, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 }
});
