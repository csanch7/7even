import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7even</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder=".edu email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="password"
        value={password}
        onChangeText={setPassword}
      />
      <PrimaryButton label="Sign in" onPress={handleLogin} />
      <PrimaryButton label="Create account" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#F6F4EE' },
  title: { fontSize: 36, fontWeight: '800', marginBottom: 24, color: '#154734' },
  input: {
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  }
});
