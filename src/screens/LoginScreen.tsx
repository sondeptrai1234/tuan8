import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import { validateEmail, validatePassword } from '../utils/validate';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation,route }: Props) {
    const redirect = route.params?.redirect;
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const e = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(e);
    setServerError('');
    if (e.email || e.password) return;

    setLoading(true);
    try {
      await dispatch(login({ email, password })).unwrap();
            if (redirect === 'Checkout') {
        navigation.reset({
          index: 2,
          routes: [{ name: 'Home' }, { name: 'Cart' }, { name: 'Checkout' }],
        });
      } else {
        navigation.goBack(); // đăng nhập xong quay lại màn trước
      }
    } catch (msg) {
      setServerError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Đăng nhập</Text>
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />
      <FormInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />
      {!!serverError && <Text style={styles.serverError}>{serverError}</Text>}
      <PrimaryButton title="Đăng nhập" onPress={handleLogin} loading={loading} />
      <PrimaryButton
  variant="outline"
  title="Chưa có tài khoản? Đăng ký"
  onPress={() => navigation.navigate('Register', { redirect })}
/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  serverError: { color: '#c62828', marginBottom: 8 },
});