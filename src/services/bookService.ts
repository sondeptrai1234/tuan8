import { api } from '../api/client';
import { Book } from '../types';

async function getAll(): Promise<Book[]> {
  return (await api.get<Book[]>('/books')).data;
}

async function getById(id: number): Promise<Book> {
  return (await api.get<Book>(`/books/${id}`)).data;
}

// Sách liên quan: lọc trên server (cùng danh mục, trừ sách hiện tại)
async function getRelated(book: Book, limit = 10): Promise<Book[]> {
  const res = await api.get<Book[]>('/books', {
    params: { category: book.category, id_ne: book.id, _limit: limit },
  });
  return res.data;
}

export default { getAll, getById, getRelated };