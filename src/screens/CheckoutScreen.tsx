import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen({ navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);

  // Lớp bảo vệ thứ hai: dù vào bằng cách nào mà chưa đăng nhập (hoặc vừa đăng xuất)
  // thì cũng bị đẩy sang Đăng nhập
  useEffect(() => {
    if (!user) navigation.replace('Login', { redirect: 'Checkout' });
  }, [user, navigation]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <Text>Người đặt: {user.name}</Text>
      <Text style={styles.note}>Khung tối giản, hoàn thiện ở Tuần 9.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '800' },
  note: { color: '#888', marginTop: 8 },
});