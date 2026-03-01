import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');

  const handleRegister = async () => {
    try {
      await register({
        email,
        password,
        fullName,
        age: 20,
        dateOfBirth: '2004-01-01',
        school,
        gender: 'woman',
        orientation: 'straight',
        profilePhotoUrl: 'https://example.com/profile.jpg',
        preferredGenders: ['man'],
        preferredAgeMin: 18,
        preferredAgeMax: 30,
        interests: ['coffee', 'music']
      });

      Alert.alert('Registered', 'Check your OTP via backend response, verify email, then login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder=".edu email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="School" value={school} onChangeText={setSchool} />
      <PrimaryButton label="Create account" onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F6F4EE', flexGrow: 1, justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  }
});
