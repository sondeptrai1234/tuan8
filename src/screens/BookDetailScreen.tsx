import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RatingStars from '../components/RatingStars';
import ReviewItem from '../components/ReviewItem';
import ReviewForm from '../components/ReviewForm';
import RelatedBooks from '../components/RelatedBooks';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import bookService from '../services/bookService';
import reviewService from '../services/reviewService';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import { Book, Review } from '../types';
import { averageRating } from '../utils/rating';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen({ navigation, route }: Props) {
  const { bookId } = route.params;
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        // Gọi song song: thông tin sách + review của sách
        const [b, r] = await Promise.all([
          bookService.getById(bookId),
          reviewService.getByBook(bookId),
        ]);
        if (cancelled) return;
        setBook(b);
        setReviews(r);
        // Sách liên quan: lỗi phần này không làm hỏng cả trang
        bookService
          .getRelated(b)
          .then((list) => !cancelled && setRelated(list))
          .catch(() => {});
      } catch {
        if (!cancelled) setError('Không tải được thông tin sách');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const avg = useMemo(() => averageRating(reviews), [reviews]);

  const handleSubmitReview = useCallback(
    async (rating: number, comment: string) => {
      if (!user) return;
      let created: Review;
      try {
        created = await reviewService.create({
          bookId,
          userId: user.id, // phải trùng chủ token, nếu không server trả 403
          userName: user.name,
          rating,
          comment,
        });
      } catch (err: any) {
        if (err?.response?.status === 401) dispatch(logout()); // token hết hạn
        throw err; // để ReviewForm hiện lỗi
      }
      // Chèn vào đầu danh sách, điểm TB tự tính lại, không load lại trang
      setReviews((prev) => [created, ...prev]);
    },
    [bookId, user, dispatch],
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error || !book) return <Text style={styles.center}>{error ?? 'Không tìm thấy sách'}</Text>;

    return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Image source={{ uri: book.image }} style={styles.cover} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{book.category}</Text>
        </View>
        <Text style={styles.price}>{book.price.toLocaleString('vi-VN')} đ</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.desc}>{book.description}</Text>

        <Text style={styles.sectionTitle}>Đánh giá</Text>
        <View style={styles.avgRow}>
          <Text style={styles.avgNumber}>{avg.toFixed(1)}</Text>
          <View>
            <RatingStars value={avg} size={22} />
            <Text style={styles.count}>{reviews.length} đánh giá</Text>
          </View>
        </View>

        {user ? (
          <ReviewForm onSubmit={handleSubmitReview} />
        ) : (
          <PrimaryButton
            variant="outline"
            title="Đăng nhập để viết đánh giá"
            onPress={() => navigation.navigate('Login')}
          />
        )}

        {reviews.length === 0 ? (
          <Text style={styles.empty}>Chưa có đánh giá nào. Hãy là người đầu tiên.</Text>
        ) : (
          reviews.map((r) => <ReviewItem key={r.id} review={r} />)
        )}

        <RelatedBooks
          books={related}
          onPressBook={(id) => navigation.push('BookDetail', { bookId: id })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, textAlign: 'center', marginTop: 40 },
  hero: { alignItems: 'center', backgroundColor: colors.tint, paddingVertical: 28, paddingHorizontal: 16 },
  cover: {
    width: 170,
    aspectRatio: 2 / 3,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#1B1F3B',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 20,
  },
  author: { color: colors.muted, fontSize: 15, marginTop: 4 },
  chip: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 12,
  },
  chipText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  price: { fontSize: 22, color: colors.price, fontWeight: '800', marginTop: 12 },
  body: { padding: 16, width: '100%', maxWidth: 720, alignSelf: 'center' },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 19,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 24,
    marginBottom: 8,
  },
  desc: { lineHeight: 23, color: '#333', fontSize: 15 },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  avgNumber: { fontFamily: fonts.serif, fontSize: 44, fontWeight: '800', color: colors.ink },
  count: { color: colors.muted, marginTop: 2 },
  empty: { color: colors.muted, marginTop: 12 },
});