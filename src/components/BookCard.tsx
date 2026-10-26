import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '../types';
import { colors, fonts } from '../theme';

type Props = { book: Book; width: number; onPress: () => void };

export default function BookCard({ book, width, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width }, pressed && { opacity: 0.8 }]}>
      <Image source={{ uri: book.image }} style={[styles.cover, { width }]} />
      <Text numberOfLines={2} style={styles.title}>
        {book.title}
      </Text>
      <Text numberOfLines={1} style={styles.author}>
        {book.author}
      </Text>
      <Text style={styles.price}>{book.price.toLocaleString('vi-VN')} đ</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cover: { aspectRatio: 2 / 3, borderRadius: 6, backgroundColor: colors.tint },
  title: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 8, lineHeight: 20 },
  author: { color: colors.muted, fontSize: 13, marginTop: 2 },
  price: { color: colors.price, fontWeight: '700', marginTop: 4 },
});