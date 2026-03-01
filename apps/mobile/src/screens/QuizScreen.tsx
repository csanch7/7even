import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';

export function QuizScreen() {
  const { accessToken, markOnboardingComplete } = useAuth();
  const [interests, setInterests] = useState('coffee,music');

  const submitQuiz = async () => {
    try {
      await apiRequest(
        '/quiz/responses',
        {
          method: 'POST',
          body: JSON.stringify({
            answers: [
              { questionId: 'q1', value: 4 },
              { questionId: 'q2', value: 3 },
              { questionId: 'q3', value: 5 },
              { questionId: 'q4', value: 4 },
              { questionId: 'q5', value: 2 }
            ],
            interests: interests
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean)
          })
        },
        accessToken ?? undefined
      );
      markOnboardingComplete();
    } catch (error) {
      Alert.alert('Quiz submission failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Compatibility Quiz</Text>
      <Text style={styles.helper}>MVP uses default answers. Edit interests below.</Text>
      <TextInput style={styles.input} value={interests} onChangeText={setInterests} />
      <PrimaryButton label="Finish onboarding" onPress={submitQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F4EE', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#154734' },
  helper: { marginBottom: 16, color: '#4A4A4A' },
  input: {
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  }
});
