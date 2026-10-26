import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);

  const handleCheckout = () => {
    if (user) {
      navigation.navigate('Checkout');
    } else {
      // Chưa đăng nhập → sang Đăng nhập, nhớ là sau đó phải quay lại Checkout
      navigation.navigate('Login', { redirect: 'Checkout' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Giỏ hàng (khung tạm, sẽ hoàn thiện ở tuần sau)</Text>
      <PrimaryButton title="Thanh toán" onPress={handleCheckout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  text: { fontSize: 16 },
});