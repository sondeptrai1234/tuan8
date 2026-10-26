import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import { register } from '../store/authSlice';
import { validateEmail, validateName, validatePassword } from '../utils/validate';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const redirect = route.params?.redirect;
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const e = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(e);
    setServerError('');
    if (e.name || e.email || e.password) return;

    setLoading(true);
    try {
      await dispatch(register({ name, email, password })).unwrap();
            if (redirect === 'Checkout') {
        navigation.reset({
          index: 2,
          routes: [{ name: 'Home' }, { name: 'Cart' }, { name: 'Checkout' }],
        });
      } else {
        navigation.popToTop(); // đăng ký xong tự đăng nhập, về màn đầu
      } // đăng ký xong tự đăng nhập, về màn đầu
    } catch (msg) {
      setServerError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Đăng ký</Text>
      <FormInput
        label="Họ tên"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        error={errors.name}
      />
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
      <PrimaryButton title="Đăng ký" onPress={handleRegister} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  serverError: { color: '#c62828', marginBottom: 8 },
});