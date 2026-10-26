import { Platform } from 'react-native';

export const colors = {
  ink: '#1B1F3B',
  paper: '#F6F7F9',
  surface: '#FFFFFF',
  line: '#E3E5EA',
  muted: '#6B7280',
  primary: '#2E3A8C',
  tint: '#E9EBF5',
  price: '#B3261E',
  star: '#E8A317',
  danger: '#C62828',
};

export const fonts = {
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia, "Times New Roman", serif',
  }) as string,
};