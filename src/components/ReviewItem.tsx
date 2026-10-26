import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RatingStars from './RatingStars';
import { Review } from '../types';

export default function ReviewItem({ review }: { review: Review }) {
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.name}>{review.userName}</Text>
        <Text style={styles.date}>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</Text>
      </View>
      <RatingStars value={review.rating} size={16} />
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee', gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '700' },
  date: { color: '#888', fontSize: 12 },
  comment: { color: '#333' },
});