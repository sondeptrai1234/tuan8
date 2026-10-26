import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BookCard from '../components/BookCard';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import bookService from '../services/bookService';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import { colors, fonts } from '../theme';
import { Book } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ALL = 'Tất cả';
const PADDING = 16;
const GAP = 14;

export default function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { width } = useWindowDimensions();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState('');

  useEffect(() => {
    bookService
      .getAll()
      .then(setBooks)
      .catch(() => setError('Không tải được danh sách sách. Kiểm tra server và địa chỉ IP.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(books.map((b) => b.category)))],
    [books],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(
      (b) =>
        (category === ALL || b.category === category) &&
        (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    );
  }, [books, category, query]);

  // Số cột theo độ rộng màn hình, bề rộng tối đa 960 để trang web không bị bìa quá to
  const containerWidth = Math.min(width, 960);
  const cols = containerWidth >= 800 ? 4 : containerWidth >= 560 ? 3 : 2;
  const cardWidth = (containerWidth - PADDING * 2 - GAP * (cols - 1)) / cols;

  const header = (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>{user ? `Chào ${user.name}` : 'Chào bạn'}</Text>
          <Text style={styles.sub}>Hôm nay bạn muốn đọc gì?</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Cart')} style={styles.textBtn}>
          <Text style={styles.textBtnLabel}>Giỏ hàng</Text>
        </Pressable>
        <Pressable
          onPress={() => (user ? dispatch(logout()) : navigation.navigate('Login'))}
          style={styles.textBtn}
        >
          <Text style={styles.textBtnLabel}>{user ? 'Đăng xuất' : 'Đăng nhập'}</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Tìm theo tên sách hoặc tác giả"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => {
          const active = item === category;
          return (
            <Pressable
              onPress={() => setCategory(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && { color: '#fff' }]}>{item}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  if (error) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>Chưa kết nối được máy chủ</Text>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        key={cols}
        style={{ width: containerWidth }}
        data={filtered}
        numColumns={cols}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: PADDING, marginBottom: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            width={cardWidth}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Không tìm thấy sách phù hợp</Text>
            <Text style={styles.emptyText}>Thử từ khoá khác hoặc bỏ bộ lọc thể loại.</Text>
            <PrimaryButton
              variant="outline"
              title="Xoá bộ lọc"
              onPress={() => {
                setQuery('');
                setCategory(ALL);
              }}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: colors.paper },
  header: { padding: PADDING, gap: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hello: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.ink },
  sub: { color: colors.muted, marginTop: 2 },
  textBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  textBtnLabel: { color: colors.primary, fontWeight: '700' },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.ink,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.tint,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.ink, fontWeight: '600' },
  emptyBox: { padding: 24, gap: 10, alignItems: 'center' },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.ink },
  emptyText: { color: colors.muted, textAlign: 'center' },
});