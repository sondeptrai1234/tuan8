import { Review } from '../types';

export const averageRating = (reviews: Review[]): number =>
  reviews.length === 0
    ? 0
    : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;