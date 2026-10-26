import { api } from '../api/client';
import { Review } from '../types';

export type NewReview = Omit<Review, 'id' | 'createdAt'>;

async function getByBook(bookId: number): Promise<Review[]> {
  const res = await api.get<Review[]>('/reviews', {
    params: { bookId, _sort: 'createdAt', _order: 'desc' },
  });
  return res.data;
}

// Cần token, và userId trong body phải trùng chủ token
async function create(input: NewReview): Promise<Review> {
  const res = await api.post<Review>('/reviews', {
    ...input,
    createdAt: new Date().toISOString(),
  });
  return res.data;
}

export default { getByBook, create };