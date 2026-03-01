import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { MatchResponse } from '../types/api';

interface Props {
  onProfilePress?: () => void;
}

export function MatchScreen({ onProfilePress }: Props) {
  const { accessToken, logout } = useAuth();
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now());

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
    } finally {
      setRefreshing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const getCountdownText = () => {
    const next = new Date(now);
    next.setHours(19, 0, 0, 0);
    const day = next.getDay();
    const isBeforeSundayRelease = day === 0 && now < next.getTime();
    const daysUntilSunday = isBeforeSundayRelease ? 0 : day === 0 ? 7 : 7 - day;
    next.setDate(next.getDate() + daysUntilSunday);

    const diffMs = Math.max(0, next.getTime() - now);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Match</Text>
        <Pressable style={styles.profileIcon} onPress={onProfilePress}>
          <Text style={styles.profileIconText}>Profile</Text>
        </Pressable>
      </View>
      {match ? (
        <>
          <Text style={styles.meta}>Status: {match.status}</Text>
          <Text style={styles.meta}>Expires: {new Date(match.expiresAt).toLocaleString()}</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>You Matched With</Text>
            <Text style={styles.metaStrong}>{match.matchedWith?.fullName ?? 'Your match'}</Text>
            {match.matchedWith?.school ? <Text style={styles.meta}>{match.matchedWith.school}</Text> : null}
            {match.matchedWith?.major ? <Text style={styles.meta}>{match.matchedWith.major}</Text> : null}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Date Suggestion (Template)</Text>
            <Text style={styles.meta}>Date idea: ____________________</Text>
            <Text style={styles.meta}>Place: _______________________</Text>
            <Text style={styles.meta}>Time: ________________________</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.meta}>No active match yet.</Text>
          <Text style={styles.meta}>Next match in: {getCountdownText()}</Text>
        </>
      )}
      <PrimaryButton label="Log out" onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F4EE', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: { fontSize: 28, fontWeight: '700', color: '#154734' },
  profileIcon: {
    backgroundColor: '#154734',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  profileIconText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  subtitle: { marginTop: 16, marginBottom: 8, fontSize: 18, fontWeight: '700', color: '#154734' },
  meta: { marginBottom: 6, color: '#4A4A4A' },
  metaStrong: { marginBottom: 6, color: '#1E2E27', fontWeight: '700', fontSize: 17 },
  card: { padding: 12, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#154734' }
});
