import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '../types';

type Props = { books: Book[]; onPressBook: (id: number) => void };

export default function RelatedBooks({ books, onPressBook }: Props) {
  if (books.length === 0) return null;
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.title}>Sách liên quan</Text>
      <FlatList
        horizontal
        data={books}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onPressBook(item.id)}>
            <Image source={{ uri: item.image }} style={styles.cover} />
            <Text numberOfLines={2} style={styles.name}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  card: { width: 110, marginRight: 12 },
  cover: { width: 110, height: 160, borderRadius: 8, backgroundColor: '#eee' },
  name: { marginTop: 4, fontSize: 13 },
});