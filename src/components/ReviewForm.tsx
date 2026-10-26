import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from './PrimaryButton';

type Props = { onSubmit: (rating: number, comment: string) => Promise<void> };

export default function ReviewForm({ onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (rating < 1) return setError('Vui lòng chọn số sao');
    if (!comment.trim()) return setError('Vui lòng nhập bình luận');
    setError('');
    setLoading(true);
    try {
      await onSubmit(rating, comment.trim());
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(
        err?.response?.status === 401
          ? 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
          : 'Không gửi được đánh giá, vui lòng thử lại',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Viết đánh giá</Text>
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable key={i} onPress={() => setRating(i)}>
            <Text style={{ fontSize: 30, color: i <= rating ? '#f5a623' : '#ccc' }}>★</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Bình luận của bạn"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <PrimaryButton title="Gửi đánh giá" onPress={handleSend} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8, marginBottom: 12 },
  label: { fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, minHeight: 70 },
  error: { color: '#c62828' },
});